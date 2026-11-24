const User = require('../models/User');
const { Recipe } = require('../models/Recipe');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');

// @desc    Get user profile & activity
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [recipes, favoriteCount, reviewsCount] = await Promise.all([
      Recipe.find({ author: user._id }).sort({ createdAt: -1 }),
      Favorite.countDocuments({ user: user._id }),
      Review.countDocuments({ user: user._id })
    ]);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt,
        recipeCount: recipes.length,
        favoriteCount,
        reviewsCount,
        recipes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & password
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, bio, profileImage, currentPassword, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'That email is already registered by another account' });
      }
      user.email = email.toLowerCase().trim();
    }

    // If profile image uploaded via Multer
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    } else if (profileImage) {
      user.profileImage = profileImage;
    }

    // Change password if requested
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
