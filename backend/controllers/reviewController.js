const Review = require('../models/Review');
const { Recipe } = require('../models/Recipe');

// @desc    Get all reviews for a recipe
// @route   GET /api/reviews/:recipeId
// @access  Public
const getRecipeReviews = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const reviews = await Review.find({ recipe: recipeId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews across app or by user (for Reviews and Ratings Page)
// @route   GET /api/reviews
// @access  Public / Private
const getAllReviews = async (req, res, next) => {
  try {
    const { userOnly } = req.query;
    const query = {};

    if (userOnly && req.user) {
      query.user = req.user._id;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name profileImage')
      .populate('recipe', 'title image category')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update review for a recipe
// @route   POST /api/reviews/:recipeId
// @access  Private
const createOrUpdateReview = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide both rating (1-5) and a comment' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Check if user already reviewed this recipe
    let review = await Review.findOne({
      user: req.user._id,
      recipe: recipeId
    });

    if (review) {
      // Update existing review
      review.rating = Number(rating);
      review.comment = comment.trim();
      await review.save();

      const populated = await Review.findById(review._id).populate(
        'user',
        'name profileImage'
      );

      return res.json({
        success: true,
        message: 'Your review was updated successfully!',
        review: populated
      });
    }

    // Create new review
    review = await Review.create({
      user: req.user._id,
      recipe: recipeId,
      rating: Number(rating),
      comment: comment.trim()
    });

    const populated = await Review.findById(review._id).populate(
      'user',
      'name profileImage'
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for your rating and review!',
      review: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this review' });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment.trim();

    await review.save();

    const populated = await Review.findById(review._id).populate(
      'user',
      'name profileImage'
    );

    res.json({
      success: true,
      message: 'Review updated successfully!',
      review: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this review' });
    }

    const recipeId = review.recipe;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average rating
    await Review.calculateAverageRating(recipeId);

    res.json({
      success: true,
      message: 'Review removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipeReviews,
  getAllReviews,
  createOrUpdateReview,
  updateReview,
  deleteReview
};
