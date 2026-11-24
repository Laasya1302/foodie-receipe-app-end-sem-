import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { formatImageUrl } from '../services/api';
import RatingStars from './RatingStars';
import {
  Clock,
  Users,
  Flame,
  Heart,
  ChefHat,
  Leaf
} from 'lucide-react';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [heartPulsing, setHeartPulsing] = useState(false);
  const navigate = useNavigate();

  if (!recipe) return null;

  const favorited = isFavorite(recipe._id);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartPulsing(true);
    setTimeout(() => setHeartPulsing(false), 500);

    const result = await toggleFavorite(recipe);
    if (result.requireAuth) {
      navigate('/login');
    }
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe._id, result.isFavorite);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'badge-green';
      case 'Hard':
        return 'badge-orange';
      default:
        return 'badge-brown';
    }
  };

  return (
    <div className="recipe-card card">
      {/* Media & Badges */}
      <div className="card-media-wrapper">
        <Link to={`/recipes/${recipe._id}`} className="card-image-link">
          <img
            src={formatImageUrl(recipe.image)}
            alt={recipe.title}
            className="card-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Favorite Heart Button */}
        <button
          className={`favorite-card-btn ${favorited ? 'active' : ''} ${heartPulsing ? 'pulse' : ''}`}
          onClick={handleHeartClick}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          title={favorited ? 'In Favourites' : 'Add to Favourites'}
        >
          <Heart
            size={20}
            fill={favorited ? '#E74C3C' : 'rgba(0, 0, 0, 0.3)'}
            stroke={favorited ? '#E74C3C' : '#FFFFFF'}
            strokeWidth={2}
          />
        </button>

        {/* Category & Veg Badges */}
        <div className="card-floating-badges">
          <span className="badge category-pill">{recipe.category}</span>
          {recipe.isVegetarian && (
            <span className="badge veg-pill" title="Vegetarian">
              <Leaf size={12} /> Veg
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card-body">
        {/* Rating and Reviews */}
        <div className="card-rating-row">
          <RatingStars
            rating={recipe.averageRating || 0}
            size={15}
            showValue={true}
            count={recipe.ratingsCount || 0}
          />
          <span className={`badge ${getDifficultyColor(recipe.difficulty)} diff-badge`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="card-title">
          <Link to={`/recipes/${recipe._id}`} title={recipe.title}>
            {recipe.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="card-description">
          {recipe.description}
        </p>

        {/* Metadata: Time and Servings */}
        <div className="card-meta-row">
          <div className="meta-item">
            <Clock size={15} className="meta-icon" />
            <span>{recipe.totalTime || (recipe.preparationTime + recipe.cookingTime) || 30} mins</span>
          </div>
          <div className="meta-item">
            <Users size={15} className="meta-icon" />
            <span>{recipe.servings || 2} servings</span>
          </div>
        </div>

        {/* Card Footer: Author Info & CTA */}
        <div className="card-footer-row">
          <div className="card-author">
            <img
              src={formatImageUrl(recipe.author?.profileImage)}
              alt={recipe.author?.name || 'Chef'}
              className="author-avatar"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <span className="author-name">{recipe.author?.name || 'Chef Foodie'}</span>
          </div>

          <Link to={`/recipes/${recipe._id}`} className="view-recipe-link">
            View Recipe →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
