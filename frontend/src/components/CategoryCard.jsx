import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowRight } from 'lucide-react';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link
      to={`/recipes?category=${encodeURIComponent(category.name)}`}
      className="category-card card"
    >
      <div className="cat-image-wrapper">
        <img
          src={category.image}
          alt={category.name}
          className="cat-image"
          loading="lazy"
        />
        <div className="cat-overlay"></div>
      </div>
      <div className="cat-content">
        <div className="cat-icon-badge">
          <Utensils size={18} />
        </div>
        <h3 className="cat-name">{category.name}</h3>
        <p className="cat-recipe-count">
          {category.recipeCount !== undefined
            ? `${category.recipeCount} ${category.recipeCount === 1 ? 'Recipe' : 'Recipes'}`
            : 'Explore'}
        </p>
        <span className="cat-explore-btn">
          Explore <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
