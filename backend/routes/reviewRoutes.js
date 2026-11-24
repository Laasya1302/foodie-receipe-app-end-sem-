const express = require('express');
const router = express.Router();
const {
  getRecipeReviews,
  getAllReviews,
  createOrUpdateReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllReviews);
router.get('/:recipeId', getRecipeReviews);
router.post('/:recipeId', protect, createOrUpdateReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
