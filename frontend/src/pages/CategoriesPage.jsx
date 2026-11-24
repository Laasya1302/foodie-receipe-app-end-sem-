import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import {
  Grid,
  Sparkles,
  ArrowRight,
  Utensils
} from 'lucide-react';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getCategories();
        if (res.data && res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories-page container">
      {/* Header */}
      <div className="categories-header text-center">
        <div className="inline-badge">
          <Grid size={15} /> 10 Curated Culinary Realms
        </div>
        <h1 className="categories-title">Explore Recipe Categories</h1>
        <p className="categories-subtitle">
          Every published recipe in MongoDB is dynamically indexed into its culinary category. Click any category below to discover authentic dishes and culinary inspiration.
        </p>
      </div>

      {/* Grid of All 10 Categories */}
      {loading ? (
        <div className="home-loading-box">
          <div className="spinner"></div>
          <p>Loading culinary categories...</p>
        </div>
      ) : (
        <div className="all-categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-item-wrapper">
              <CategoryCard category={category} />
              <div className="category-meta-info">
                <p className="cat-desc-text">{category.description}</p>
                <Link
                  to={`/recipes?category=${encodeURIComponent(category.name)}`}
                  className="browse-cat-link"
                >
                  <span>Browse {category.name} Recipes</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
