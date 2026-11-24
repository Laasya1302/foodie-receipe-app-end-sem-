import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI, formatImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';
import {
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
  Clock,
  Users,
  Eye,
  AlertCircle
} from 'lucide-react';
import './MyRecipesPage.css';

const MyRecipesPage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchMyRecipes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await recipeAPI.getRecipes({ author: user._id });
      if (res.data && res.data.recipes) {
        setRecipes(res.data.recipes);
      }
    } catch (err) {
      console.error('Error fetching my recipes:', err);
      setToast({ message: 'Failed to load your recipes from MongoDB.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await recipeAPI.deleteRecipe(deleteTarget._id);
      setToast({ message: `"${deleteTarget.title}" was removed successfully.`, type: 'success' });
      setRecipes((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete recipe.',
        type: 'error'
      });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="my-recipes-page container">
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
      <div className="my-recipes-header">
        <div>
          <div className="inline-badge">
            <BookOpen size={14} /> Author Dashboard
          </div>
          <h1 className="page-heading">My Published Recipes</h1>
          <p className="page-subheading">
            Manage your personal recipes stored in MongoDB. You can update ingredients, edit steps, or delete dishes anytime.
          </p>
        </div>

        <Link to="/add-recipe" className="btn btn-primary add-new-btn">
          <PlusCircle size={18} />
          <span>Add Another Recipe</span>
        </Link>
      </div>

      {loading ? (
        <div className="home-loading-box">
          <div className="spinner"></div>
          <p>Loading your culinary creations from MongoDB...</p>
        </div>
      ) : recipes.length > 0 ? (
        <div className="my-recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="my-recipe-item card">
              <div className="my-recipe-thumb-box">
                <img
                  src={formatImageUrl(recipe.image)}
                  alt={recipe.title}
                  className="my-recipe-img"
                />
                <span className="badge category-badge-floating">{recipe.category}</span>
              </div>

              <div className="my-recipe-body">
                <div className="my-recipe-rating-row">
                  <RatingStars
                    rating={recipe.averageRating || 0}
                    size={14}
                    showValue={true}
                    count={recipe.ratingsCount || 0}
                  />
                  <span className="badge badge-brown">{recipe.difficulty}</span>
                </div>

                <h3 className="my-recipe-title">
                  <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
                </h3>

                <p className="my-recipe-desc">{recipe.description}</p>

                <div className="my-recipe-meta">
                  <span><Clock size={14} /> {recipe.totalTime || (recipe.preparationTime + recipe.cookingTime)} mins</span>
                  <span><Users size={14} /> {recipe.servings} servings</span>
                </div>

                <div className="my-recipe-actions">
                  <Link to={`/recipes/${recipe._id}`} className="btn btn-secondary btn-sm" title="View live page">
                    <Eye size={15} /> <span>View</span>
                  </Link>
                  <Link to={`/edit-recipe/${recipe._id}`} className="btn btn-outline btn-sm" title="Edit recipe">
                    <Edit size={15} /> <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(recipe)}
                    className="btn btn-danger btn-sm"
                    title="Delete recipe"
                  >
                    <Trash2 size={15} /> <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-recipes-state card">
          <BookOpen size={48} className="empty-icon" />
          <h3>You haven't published any recipes yet</h3>
          <p>
            Share your favorite homemade dish with our worldwide foodie community! It only takes 2 minutes to publish your first recipe to MongoDB.
          </p>
          <Link to="/add-recipe" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Publish Your First Recipe</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-backdrop fade-in" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#D32F2F' }}>Confirm Recipe Deletion</h3>
            <p className="modal-desc">
              Are you sure you want to permanently delete <strong>{deleteTarget.title}</strong>? This action will remove the recipe and all its reviews from MongoDB Atlas.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleDeleteConfirm}
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

export default MyRecipesPage;
