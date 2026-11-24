const express = require('express');
const router = express.Router();
const { Recipe, RECIPE_CATEGORIES } = require('../models/Recipe');

// Category curated display metadata
const CATEGORY_META = {
  'Breakfast': {
    description: 'Start your morning with energizing, healthy and delicious breakfast plates.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
    icon: 'Sun'
  },
  'Lunch': {
    description: 'Wholesome midday meals, bowls, and savory platters to keep you fueled.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    icon: 'Utensils'
  },
  'Dinner': {
    description: 'Hearty evening culinary wonders, gourmet entrees, and comforting family dinners.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    icon: 'Moon'
  },
  'Snacks': {
    description: 'Quick bites, crunchy appetizers, and afternoon treats bursting with taste.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?auto=format&fit=crop&w=800&q=80',
    icon: 'Cookie'
  },
  'Desserts': {
    description: 'Decadent sweets, velvety cakes, traditional treats, and indulgent delights.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    icon: 'Cake'
  },
  'Vegetarian': {
    description: 'Nutritious plant-based feasts loaded with colorful veggies, spices, and cheeses.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    icon: 'Leaf'
  },
  'Non-Vegetarian': {
    description: 'Succulent chicken, tender meats, and flavorful seafood cooked to perfection.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    icon: 'Flame'
  },
  'Fast Food': {
    description: 'Irresistible burgers, cheesy pizzas, loaded fries, and street-style favorites.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    icon: 'Pizza'
  },
  'Drinks': {
    description: 'Refreshing fruit coolers, smoothies, mocktails, tea, and aromatic coffees.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    icon: 'Coffee'
  },
  'Traditional Food': {
    description: 'Timeless heritage dishes, authentic regional specialties, and generational recipes.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    icon: 'Sparkles'
  }
};

// @desc    Get all categories with image, description, and dynamic recipe counts
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    // Count recipes per category in MongoDB
    const categoryCounts = await Recipe.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    categoryCounts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const categories = RECIPE_CATEGORIES.map((name) => {
      const meta = CATEGORY_META[name] || {};
      return {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name,
        description: meta.description || `${name} recipes to enjoy anytime.`,
        image: meta.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
        icon: meta.icon || 'Utensils',
        recipeCount: countMap[name] || 0
      };
    });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
