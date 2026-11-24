const Favorite = require('../models/Favorite');
const { Recipe } = require('../models/Recipe');

// @desc    Get all favorites of logged-in user
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'recipe',
        populate: {
          path: 'author',
          select: 'name email profileImage'
        }
      })
      .sort({ createdAt: -1 });

    // Filter out any favorites where recipe might have been deleted
    const validRecipes = favorites
      .filter((fav) => fav.recipe !== null)
      .map((fav) => fav.recipe);

    // Also return list of recipe IDs for quick client lookup
    const favoriteRecipeIds = validRecipes.map((r) => r._id.toString());

    res.json({
      success: true,
      count: validRecipes.length,
      recipes: validRecipes,
      favoriteIds: favoriteRecipeIds
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a recipe to favorites
// @route   POST /api/favorites/:recipeId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      user: req.user._id,
      recipe: recipeId
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'Recipe is already in your favourites',
        isFavorite: true
      });
    }

    await Favorite.create({
      user: req.user._id,
      recipe: recipeId
    });

    res.status(201).json({
      success: true,
      message: 'Recipe added to your favourites!',
      isFavorite: true
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a recipe from favorites
// @route   DELETE /api/favorites/:recipeId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      recipe: recipeId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Recipe was not found in your favourites',
        isFavorite: false
      });
    }

    res.json({
      success: true,
      message: 'Recipe removed from your favourites.',
      isFavorite: false
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};
