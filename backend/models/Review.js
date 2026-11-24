const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

// One review per user per recipe
reviewSchema.index({ user: 1, recipe: 1 }, { unique: true });

// Static method to recalculate average recipe rating
reviewSchema.statics.calculateAverageRating = async function (recipeId) {
  const stats = await this.aggregate([
    { $match: { recipe: recipeId } },
    {
      $group: {
        _id: '$recipe',
        averageRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  const Recipe = mongoose.model('Recipe');
  if (stats.length > 0) {
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      ratingsCount: stats[0].ratingsCount
    });
  } else {
    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: 0,
      ratingsCount: 0
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.recipe);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.recipe);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
