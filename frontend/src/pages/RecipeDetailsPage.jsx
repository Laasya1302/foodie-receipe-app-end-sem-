import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { recipeAPI, reviewAPI, formatImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoriteContext';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';
import {
  Clock,
  Users,
  Flame,
  Heart,
  ChefHat,
  Leaf,
  Calendar,
  Share2,
  Edit,
  Trash2,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  Star
} from 'lucide-react';
import './RecipeDetailsPage.css';

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        const [recipeRes, reviewsRes] = await Promise.all([
          recipeAPI.getRecipeById(id),
          reviewAPI.getRecipeReviews(id)
        ]);

        if (recipeRes.data && recipeRes.data.recipe) {
          setRecipe(recipeRes.data.recipe);
        }

        if (reviewsRes.data && reviewsRes.data.reviews) {
          setReviews(reviewsRes.data.reviews);
          // Check if current user has already reviewed
          if (user) {
            const myReview = reviewsRes.data.reviews.find((r) => r.user?._id === user._id);
            if (myReview) {
              setUserRating(myReview.rating);
              setUserComment(myReview.comment);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setToast({ message: 'Recipe could not be loaded or was removed.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    const res = await toggleFavorite(recipe);
    if (res.requireAuth) {
      navigate('/login', { state: { from: { pathname: `/recipes/${id}` } } });
      return;
    }
    setToast({
      message: res.message,
      type: res.success ? 'success' : 'error'
    });
  };

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleStepCheck = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/recipes/${id}` } } });
      return;
    }

    if (!userComment.trim()) {
      setToast({ message: 'Please write a brief comment with your rating.', type: 'error' });
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewAPI.createOrUpdateReview(id, {
        rating: userRating,
        comment: userComment.trim()
      });

      setToast({ message: res.data.message || 'Review submitted successfully!', type: 'success' });

      // Refresh reviews list and recipe
      const [reviewsRes, recipeRes] = await Promise.all([
        reviewAPI.getRecipeReviews(id),
        recipeAPI.getRecipeById(id)
      ]);
      setReviews(reviewsRes.data.reviews);
      setRecipe(recipeRes.data.recipe);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to submit review.',
        type: 'error'
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewAPI.deleteReview(reviewId);
      setToast({ message: 'Your review was deleted.', type: 'info' });
      const [reviewsRes, recipeRes] = await Promise.all([
        reviewAPI.getRecipeReviews(id),
        recipeAPI.getRecipeById(id)
      ]);
      setReviews(reviewsRes.data.reviews);
      setRecipe(recipeRes.data.recipe);
      setUserComment('');
    } catch (err) {
      setToast({ message: 'Failed to delete review.', type: 'error' });
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await recipeAPI.deleteRecipe(id);
      navigate('/my-recipes');
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete recipe.',
        type: 'error'
      });
      setShowDeleteModal(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Recipe link copied to clipboard!', type: 'success' });
    }
  };

  if (loading) {
    return (
      <div className="home-loading-box" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p>Loading recipe from MongoDB...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Recipe Not Found</h2>
        <p>This recipe might have been deleted or the link is incorrect.</p>
        <Link to="/recipes" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back to All Recipes
        </Link>
      </div>
    );
  }

  const isOwner = user && recipe.author && (user._id === recipe.author._id || user._id === recipe.author);
  const favorited = isFavorite(recipe._id);

  return (
    <div className="recipe-details-page container">
      {toast.message && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        </div>
      )}

      {/* Back button & Action Toolbar */}
      <div className="details-top-bar">
        <Link to="/recipes" className="back-link">
          <ArrowLeft size={18} /> <span>All Recipes</span>
        </Link>

        <div className="details-top-actions">
          <button onClick={handleShare} className="icon-action-btn" title="Share recipe link">
            <Share2 size={18} />
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`icon-action-btn heart-btn ${favorited ? 'active' : ''}`}
            title={favorited ? 'In Favourites' : 'Add to Favourites'}
          >
            <Heart size={20} fill={favorited ? '#E74C3C' : 'transparent'} color={favorited ? '#E74C3C' : 'currentColor'} />
          </button>

          {isOwner && (
            <div className="owner-actions">
              <Link to={`/edit-recipe/${recipe._id}`} className="btn btn-secondary btn-sm">
                <Edit size={16} /> <span>Edit</span>
              </Link>
              <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm">
                <Trash2 size={16} /> <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Header Banner */}
      <div className="recipe-hero-banner card">
        <div className="recipe-banner-image-box">
          <img
            src={formatImageUrl(recipe.image)}
            alt={recipe.title}
            className="details-main-img"
          />
          <div className="details-image-badges">
            <Link to={`/recipes?category=${encodeURIComponent(recipe.category)}`} className="badge category-pill">
              {recipe.category}
            </Link>
            {recipe.isVegetarian && (
              <span className="badge veg-pill">
                <Leaf size={14} /> Vegetarian
              </span>
            )}
          </div>
        </div>

        <div className="recipe-banner-content">
          <div className="recipe-header-rating">
            <RatingStars
              rating={recipe.averageRating || 0}
              size={20}
              showValue={true}
              count={recipe.ratingsCount || reviews.length}
            />
            <span className="badge badge-brown">{recipe.difficulty} Difficulty</span>
          </div>

          <h1 className="recipe-main-title">{recipe.title}</h1>
          <p className="recipe-lead-description">{recipe.description}</p>

          {/* Quick Metrics Bar */}
          <div className="recipe-metrics-grid">
            <div className="metric-card">
              <Clock size={20} className="metric-icon" />
              <div>
                <span className="metric-label">Prep Time</span>
                <span className="metric-value">{recipe.preparationTime} mins</span>
              </div>
            </div>

            <div className="metric-card">
              <Flame size={20} className="metric-icon" />
              <div>
                <span className="metric-label">Cook Time</span>
                <span className="metric-value">{recipe.cookingTime} mins</span>
              </div>
            </div>

            <div className="metric-card">
              <Clock size={20} className="metric-icon" />
              <div>
                <span className="metric-label">Total Time</span>
                <span className="metric-value">{recipe.totalTime || (recipe.preparationTime + recipe.cookingTime)} mins</span>
              </div>
            </div>

            <div className="metric-card">
              <Users size={20} className="metric-icon" />
              <div>
                <span className="metric-label">Servings</span>
                <span className="metric-value">{recipe.servings} People</span>
              </div>
            </div>
          </div>

          {/* Author Badge */}
          <div className="recipe-author-badge">
            <img
              src={formatImageUrl(recipe.author?.profileImage)}
              alt={recipe.author?.name}
              className="author-avatar-lg"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="author-meta">
              <span className="by-label">Recipe Crafted By:</span>
              <h4 className="author-display-name">{recipe.author?.name || 'Chef Foodie'}</h4>
              <p className="author-bio-snippet">{recipe.author?.bio || 'Culinary enthusiast sharing recipes on FOODIE.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recipe Content Layout */}
      <div className="recipe-content-layout">
        {/* Ingredients Column */}
        <div className="ingredients-column card">
          <div className="column-header">
            <h3>Ingredients</h3>
            <span className="badge badge-orange">{recipe.ingredients.length} items</span>
          </div>
          <p className="column-hint">Tap ingredients as you prepare them:</p>

          <ul className="ingredients-checklist">
            {recipe.ingredients.map((ing, idx) => (
              <li
                key={idx}
                className={`ingredient-item ${checkedIngredients[idx] ? 'checked' : ''}`}
                onClick={() => toggleIngredientCheck(idx)}
              >
                <div className={`checkbox-custom ${checkedIngredients[idx] ? 'active' : ''}`}>
                  {checkedIngredients[idx] && <CheckCircle2 size={16} color="#FFFFFF" />}
                </div>
                <span className="ingredient-text">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cooking Steps Column */}
        <div className="instructions-column card">
          <div className="column-header">
            <h3>Step-by-Step Cooking Instructions</h3>
            <span className="badge badge-brown">{recipe.instructions.length} steps</span>
          </div>

          <div className="instructions-timeline">
            {recipe.instructions.map((step, idx) => (
              <div
                key={idx}
                className={`instruction-step ${completedSteps[idx] ? 'completed' : ''}`}
                onClick={() => toggleStepCheck(idx)}
              >
                <div className="step-counter-box">
                  <span>{idx + 1}</span>
                </div>
                <div className="step-body">
                  <p className="step-text">{step}</p>
                  <span className="step-status">
                    {completedSteps[idx] ? '✓ Step Completed' : 'Click when done'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings and Reviews Section */}
      <section className="reviews-section card">
        <div className="reviews-header">
          <div>
            <h2>Ratings & Reviews</h2>
            <p>Read what the food community thinks or share your own cooking experience.</p>
          </div>
          <div className="reviews-average-box">
            <span className="big-rating-number">{recipe.averageRating ? recipe.averageRating.toFixed(1) : '5.0'}</span>
            <div>
              <RatingStars rating={recipe.averageRating || 5} size={18} />
              <span className="total-reviews-count">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
            </div>
          </div>
        </div>

        {/* Add/Edit Review Form */}
        <div className="write-review-box">
          <h4>{isAuthenticated ? 'Leave a Review & Rating' : 'Log in to Leave a Review'}</h4>
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="rating-select-group">
                <label className="form-label">Your Rating:</label>
                <RatingStars
                  rating={userRating}
                  max={5}
                  interactive={true}
                  onChange={(val) => setUserRating(val)}
                  size={26}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Cooking Experience & Feedback:</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="How did this recipe turn out? Did you make any flavorful twists or adjustments?"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <p className="login-to-review-text">
              <Link to="/login" className="login-link">Sign in</Link> or{' '}
              <Link to="/register" className="login-link">create an account</Link> to rate this dish and leave a review.
            </p>
          )}
        </div>

        {/* Review List */}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((rev) => {
              const isMyReview = user && rev.user && rev.user._id === user._id;
              return (
                <div key={rev._id} className="review-item">
                  <img
                    src={formatImageUrl(rev.user?.profileImage)}
                    alt={rev.user?.name}
                    className="review-avatar"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="review-content">
                    <div className="review-author-row">
                      <h5 className="review-author-name">{rev.user?.name || 'Fellow Foodie'}</h5>
                      <RatingStars rating={rev.rating} size={14} />
                      <span className="review-date">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {isMyReview && (
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="delete-review-btn"
                          title="Delete my review"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="review-comment-text">{rev.comment}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-reviews-text">No reviews yet for this recipe. Be the first to try it and rate it!</p>
          )}
        </div>
      </section>

      {/* Delete Recipe Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop fade-in" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#D32F2F' }}>Delete Recipe?</h3>
            <p className="modal-desc">
              Are you sure you want to permanently delete <strong>{recipe.title}</strong>? This action cannot be undone and will delete it from MongoDB.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteRecipe}
              >
                Yes, Delete Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailsPage;
