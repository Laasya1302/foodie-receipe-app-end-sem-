import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import RecipeCard from '../components/RecipeCard';
import { Heart, Compass, PlusCircle, Sparkles } from 'lucide-react';
import './FavoriteRecipesPage.css';

const FavoriteRecipesPage = () => {
  const { favorites, loading, fetchFavorites } = useFavorites();

  useEffect(() => {
    // Refresh from MongoDB on page entry
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <div className="favorites-page container">
      {/* Header */}
      <div className="favorites-header">
        <div>
          <div className="inline-badge">
            <Heart size={14} color="#E74C3C" fill="#E74C3C" /> Synced with MongoDB Database
          </div>
          <h1 className="page-heading">My Favourite Recipes</h1>
          <p className="page-subheading">
            Your personal culinary collection. Every dish added here is linked to your account in MongoDB Atlas and available across all your devices.
          </p>
        </div>

        <Link to="/recipes" className="btn btn-secondary btn-sm">
          <Compass size={16} />
          <span>Explore More Recipes</span>
        </Link>
      </div>

      {loading ? (
        <div className="home-loading-box">
          <div className="spinner"></div>
          <p>Loading your saved favourites from MongoDB...</p>
        </div>
      ) : favorites.length > 0 ? (
        <div className="favorites-content">
          <p className="favorites-count-label">
            You have <strong>{favorites.length}</strong> saved {favorites.length === 1 ? 'recipe' : 'recipes'} in your favourites collection.
          </p>
          <div className="recipes-grid">
            {favorites.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-favorites-card card">
          <div className="empty-heart-icon-wrapper">
            <Heart size={44} color="#E74C3C" />
          </div>
          <h3>Your Favourites Collection is Empty</h3>
          <p>
            Whenever you discover a recipe that makes your mouth water, tap the heart icon on its card to save it here permanently in MongoDB.
          </p>
          <div className="empty-favorites-actions">
            <Link to="/recipes" className="btn btn-primary">
              <Compass size={18} />
              <span>Browse All Recipes</span>
            </Link>
            <Link to="/add-recipe" className="btn btn-secondary">
              <PlusCircle size={18} />
              <span>Add Your Own Recipe</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteRecipesPage;
