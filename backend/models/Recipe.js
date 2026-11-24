const mongoose = require('mongoose');

const RECIPE_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Desserts',
  'Vegetarian',
  'Non-Vegetarian',
  'Fast Food',
  'Drinks',
  'Traditional Food'
];

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    image: {
      type: String,
      required: [true, 'Recipe image is required']
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: RECIPE_CATEGORIES,
        message: '{VALUE} is not a valid category'
      }
    },
    ingredients: {
      type: [String],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'Recipe must have at least one ingredient'
      }
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time in minutes is required'],
      min: [1, 'Preparation time must be at least 1 minute']
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time in minutes is required'],
      min: [0, 'Cooking time cannot be negative']
    },
    totalTime: {
      type: Number,
      default: function () {
        return (this.preparationTime || 0) + (this.cookingTime || 0);
      }
    },
    servings: {
      type: Number,
      required: [true, 'Number of servings is required'],
      min: [1, 'Servings must be at least 1']
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    instructions: {
      type: [String],
      required: [true, 'At least one instruction step is required'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'Recipe must have at least one cooking instruction'
      }
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isVegetarian: {
      type: Boolean,
      default: false
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to calculate totalTime
recipeSchema.pre('save', function (next) {
  this.totalTime = (this.preparationTime || 0) + (this.cookingTime || 0);
  next();
});

// Text index for search
recipeSchema.index({ title: 'text', description: 'text', ingredients: 'text' });

module.exports = {
  Recipe: mongoose.model('Recipe', recipeSchema),
  RECIPE_CATEGORIES
};
