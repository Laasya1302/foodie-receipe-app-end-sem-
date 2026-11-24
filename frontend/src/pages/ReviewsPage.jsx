import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewAPI, formatImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';
import {
  Star,
  MessageSquare,
  Trash2,
  Edit3,
  Check,
  X,
  ExternalLink,
  Users
} from 'lucide-react';
import './ReviewsPage.css';

const ReviewsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'mine'
  const [toast, setToast] = useState({ message: '', type: '' });

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterMode === 'mine' && user) {
        params.userOnly = true;
      }
      const res = await reviewAPI.getAllReviews(params);
      if (res.data && res.data.reviews) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterMode, user]);

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (reviewId) => {
    if (!editComment.trim()) {
      setToast({ message: 'Comment cannot be blank.', type: 'error' });
      return;
    }
    try {
      setUpdating(true);
      await reviewAPI.updateReview(reviewId, {
        rating: editRating,
        comment: editComment.trim()
      });
      setToast({ message: 'Review updated successfully in MongoDB!', type: 'success' });
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      setToast({ message: 'Failed to update review.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewAPI.deleteReview(reviewId);
      setToast({ message: 'Review removed from MongoDB.', type: 'info' });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      setToast({ message: 'Failed to delete review.', type: 'error' });
    }
  };

  return (
    <div className="reviews-page container">
      {toast.message && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        </div>
      )}

      {/* Header */}
      <div className="reviews-page-header">
        <div>
          <div className="inline-badge">
            <Star size={14} color="#F5A623" fill="#F5A623" /> Community Taste & Critique
          </div>
          <h1 className="page-heading">Reviews and Ratings</h1>
          <p className="page-subheading">
            Honest critiques, cooking recommendations, and ratings from food enthusiasts across our MongoDB database.
          </p>
        </div>

        {isAuthenticated && (
          <div className="reviews-filter-toggle">
            <button
              className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Community Reviews
            </button>
            <button
              className={`filter-btn ${filterMode === 'mine' ? 'active' : ''}`}
              onClick={() => setFilterMode('mine')}
            >
              My Reviews
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="home-loading-box">
          <div className="spinner"></div>
          <p>Loading community reviews from MongoDB...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="reviews-grid-stream">
          {reviews.map((rev) => {
            const isMyReview = user && rev.user && rev.user._id === user._id;
            const isEditing = editingId === rev._id;

            return (
              <div key={rev._id} className="review-card-item card">
                {/* Associated Recipe Banner */}
                {rev.recipe && (
                  <div className="review-recipe-strip">
                    <img
                      src={formatImageUrl(rev.recipe.image)}
                      alt={rev.recipe.title}
                      className="strip-recipe-thumb"
                    />
                    <div className="strip-info">
                      <span className="strip-cat-pill">{rev.recipe.category}</span>
                      <h4 className="strip-title">
                        <Link to={`/recipes/${rev.recipe._id}`}>
                          {rev.recipe.title} <ExternalLink size={13} />
                        </Link>
                      </h4>
                    </div>
                  </div>
                )}

                <div className="review-body-main">
                  {/* Author Row */}
                  <div className="rev-author-bar">
                    <div className="rev-author-info">
                      <img
                        src={formatImageUrl(rev.user?.profileImage)}
                        alt={rev.user?.name}
                        className="rev-user-avatar"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div>
                        <h5 className="rev-user-name">{rev.user?.name || 'Chef Foodie'}</h5>
                        <span className="rev-date">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="rev-stars-box">
                      {isEditing ? (
                        <RatingStars
                          rating={editRating}
                          interactive={true}
                          onChange={(r) => setEditRating(r)}
                          size={20}
                        />
                      ) : (
                        <RatingStars rating={rev.rating} size={16} showValue={true} />
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  {isEditing ? (
                    <div className="review-edit-form">
                      <textarea
                        className="form-textarea"
                        rows="3"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <div className="edit-btn-actions">
                        <button
                          onClick={cancelEdit}
                          className="btn btn-secondary btn-sm"
                        >
                          <X size={15} /> Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(rev._id)}
                          className="btn btn-primary btn-sm"
                          disabled={updating}
                        >
                          <Check size={15} /> {updating ? 'Saving...' : 'Save Update'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="rev-comment-text">"{rev.comment}"</p>
                  )}

                  {/* Action Bar (Edit / Delete if author) */}
                  {isMyReview && !isEditing && (
                    <div className="rev-actions-bar">
                      <button onClick={() => startEdit(rev)} className="rev-action-btn">
                        <Edit3 size={14} /> Edit Review
                      </button>
                      <button onClick={() => handleDelete(rev._id)} className="rev-action-btn delete">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-recipes-state card">
          <MessageSquare size={48} className="empty-icon" />
          <h3>No reviews found</h3>
          <p>
            {filterMode === 'mine'
              ? "You haven't written any reviews yet. Try browsing our recipes and leave your rating!"
              : 'Be the first foodie to test and review a recipe in our collection!'}
          </p>
          <Link to="/recipes" className="btn btn-primary">
            Explore Recipes & Leave Reviews
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
