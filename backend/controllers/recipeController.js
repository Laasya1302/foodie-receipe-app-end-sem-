const { Recipe, RECIPE_CATEGORIES } = require('../models/Recipe');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');

// Helper to parse array fields if sent as JSON string or comma-separated string from multipart/form-data
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field.filter(item => item && item.trim().length > 0);
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed.map(s => String(s).trim()).filter(Boolean);
    } catch {
      // not JSON, fallback to newline or comma
      if (field.includes('\n')) {
        return field.split('\n').map(s => s.trim()).filter(Boolean);
      }
      return field.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
};

// @desc    Get all recipes with search & filter options
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res, next) => {
  try {
    const {
      search,
      category,
      difficulty,
      isVegetarian,
      maxPrepTime,
      maxCookTime,
      author,
      sort,
      limit,
      page
    } = req.query;

    const query = {};

    // Text / keyword search across title, description, and ingredients
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { ingredients: searchRegex },
        { category: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = category.trim();
    }

    // Difficulty filter
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    // Vegetarian filter
    if (isVegetarian !== undefined && isVegetarian !== '') {
      query.isVegetarian = isVegetarian === 'true' || isVegetarian === true;
    }

    // Max times filter
    if (maxPrepTime) {
      query.preparationTime = { $lte: Number(maxPrepTime) };
    }
    if (maxCookTime) {
      query.cookingTime = { $lte: Number(maxCookTime) };
    }

    // Author filter (for My Recipes)
    if (author) {
      query.author = author;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'popular' || sort === 'rating') {
      sortOptions = { averageRating: -1, ratingsCount: -1 };
    } else if (sort === 'fastest') {
      sortOptions = { totalTime: 1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    }

    // Pagination
    const pageSize = Number(limit) || 50;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .populate('author', 'name email profileImage')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
      Recipe.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: recipes.length,
      total,
      page: currentPage,
      pages: Math.ceil(total / pageSize),
      recipes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      'author',
      'name email profileImage bio createdAt'
    );

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      preparationTime,
      cookingTime,
      servings,
      difficulty,
      isVegetarian,
      imageUrl
    } = req.body;

    const ingredients = parseArrayField(req.body.ingredients);
    const instructions = parseArrayField(req.body.instructions);

    // Image can come from Multer uploaded file or a direct image URL
    let image = imageUrl;
    if (req.file) {
      // Store relative path for web access
      image = `/uploads/${req.file.filename}`;
    }

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, description and category' });
    }

    if (!image) {
      return res.status(400).json({ success: false, message: 'Please upload an image or provide an image URL' });
    }

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one ingredient' });
    }

    if (!instructions || instructions.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one cooking instruction step' });
    }

    const prep = Number(preparationTime) || 10;
    const cook = Number(cookingTime) || 15;
    const srv = Number(servings) || 2;

    const isVeg =
      isVegetarian === 'true' ||
      isVegetarian === true ||
      category === 'Vegetarian';

    const recipe = await Recipe.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      image,
      ingredients,
      instructions,
      preparationTime: prep,
      cookingTime: cook,
      totalTime: prep + cook,
      servings: srv,
      difficulty: difficulty || 'Medium',
      isVegetarian: isVeg,
      author: req.user._id
    });

    const populated = await Recipe.findById(recipe._id).populate(
      'author',
      'name email profileImage'
    );

    res.status(201).json({
      success: true,
      message: 'Recipe published successfully!',
      recipe: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing recipe
// @route   PUT /api/recipes/:id
// @access  Private (Owner only)
const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only edit your own recipes' });
    }

    const {
      title,
      description,
      category,
      preparationTime,
      cookingTime,
      servings,
      difficulty,
      isVegetarian,
      imageUrl
    } = req.body;

    if (title) recipe.title = title.trim();
    if (description) recipe.description = description.trim();
    if (category) recipe.category = category.trim();

    if (req.file) {
      // If user uploaded a new file, update image
      recipe.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      recipe.image = imageUrl;
    }

    if (req.body.ingredients) {
      const parsedIngredients = parseArrayField(req.body.ingredients);
      if (parsedIngredients.length > 0) recipe.ingredients = parsedIngredients;
    }

    if (req.body.instructions) {
      const parsedInstructions = parseArrayField(req.body.instructions);
      if (parsedInstructions.length > 0) recipe.instructions = parsedInstructions;
    }

    if (preparationTime !== undefined) recipe.preparationTime = Number(preparationTime);
    if (cookingTime !== undefined) recipe.cookingTime = Number(cookingTime);
    recipe.totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

    if (servings !== undefined) recipe.servings = Number(servings);
    if (difficulty) recipe.difficulty = difficulty;
    if (isVegetarian !== undefined) {
      recipe.isVegetarian = isVegetarian === 'true' || isVegetarian === true;
    }

    await recipe.save();

    const populated = await Recipe.findById(recipe._id).populate(
      'author',
      'name email profileImage'
    );

    res.json({
      success: true,
      message: 'Recipe updated successfully!',
      recipe: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Owner only)
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only delete your own recipes' });
    }

    // Remove associated favorites and reviews
    await Promise.all([
      Favorite.deleteMany({ recipe: recipe._id }),
      Review.deleteMany({ recipe: recipe._id }),
      Recipe.findByIdAndDelete(recipe._id)
    ]);

    res.json({
      success: true,
      message: 'Recipe and associated reviews removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
