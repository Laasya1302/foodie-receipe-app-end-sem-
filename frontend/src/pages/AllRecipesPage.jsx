import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recipeAPI, categoryAPI } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Filter,
  PlusCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import './AllRecipesPage.css';

const AllRecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const categoryParam = searchParams.get('category') || 'All';
  const sortParam = searchParams.get('sort') || 'newest';
  const difficultyParam = searchParams.get('difficulty') || 'All';
  const vegParam = searchParams.get('isVegetarian') || 'All';
  const searchParam = searchParams.get('q') || '';

  useEffect(() => {
    // Load categories list for filter pills
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.data && res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const params = {};
        if (categoryParam !== 'All') params.category = categoryParam;
        if (sortParam) params.sort = sortParam;
        if (difficultyParam !== 'All') params.difficulty = difficultyParam;
        if (vegParam === 'true') params.isVegetarian = true;
        if (vegParam === 'false') params.isVegetarian = false;
        if (searchParam) params.search = searchParam;

        const res = await recipeAPI.getRecipes(params);
        if (res.data && res.data.recipes) {
          setRecipes(res.data.recipes);
        }
      } catch (err) {
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [categoryParam, sortParam, difficultyParam, vegParam, searchParam]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="all-recipes-page container">
      {/* Header */}
      <div className="recipes-page-header">
        <div>
          <div className="inline-badge">
            <Sparkles size={15} /> Dynamic MongoDB Recipe Vault
          </div>
          <h1 className="page-heading">
            {categoryParam !== 'All' ? `${categoryParam} Recipes` : 'Explore All Recipes'}
          </h1>
          <p className="page-subheading">
            Browse authentic, mouthwatering dishes crafted by our food community and stored directly in MongoDB.
          </p>
        </div>

        <Link to="/add-recipe" className="btn btn-primary add-recipe-action">
          <PlusCircle size={18} />
          <span>Add New Recipe</span>
        </Link>
      </div>

      {/* Category Pills Bar */}
      <div className="category-chips-bar">
        <button
          className={`chip-pill ${categoryParam === 'All' ? 'active' : ''}`}
          onClick={() => updateParam('category', 'All')}
        >
          All Cuisines
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`chip-pill ${categoryParam === c.name ? 'active' : ''}`}
            onClick={() => updateParam('category', c.name)}
          >
            {c.name}
            {c.recipeCount > 0 && <span className="chip-count">({c.recipeCount})</span>}
          </button>
        ))}
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="recipes-toolbar card">
        <div className="toolbar-left">
          {/* Difficulty filter */}
          <div className="filter-select-wrapper">
            <label className="toolbar-label">Difficulty:</label>
            <select
              value={difficultyParam}
              onChange={(e) => updateParam('difficulty', e.target.value)}
              className="toolbar-select"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Dietary preference filter */}
          <div className="filter-select-wrapper">
            <label className="toolbar-label">Diet:</label>
            <select
              value={vegParam}
              onChange={(e) => updateParam('isVegetarian', e.target.value)}
              className="toolbar-select"
            >
              <option value="All">All Diets</option>
              <option value="true">Vegetarian Only</option>
              <option value="false">Non-Vegetarian Only</option>
            </select>
          </div>
        </div>

        <div className="toolbar-right">
          {/* Sort options */}
          <div className="filter-select-wrapper">
            <label className="toolbar-label">Sort By:</label>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="toolbar-select"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Top Rated & Popular</option>
              <option value="fastest">Quickest Cook Time</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (A - Z)</option>
            </select>
          </div>

          {(categoryParam !== 'All' || difficultyParam !== 'All' || vegParam !== 'All' || sortParam !== 'newest') && (
            <button
              onClick={resetFilters}
              className="btn btn-secondary btn-sm reset-filter-btn"
              title="Reset all filters"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="results-summary-row">
        <p className="results-count-text">
          Showing <strong>{recipes.length}</strong> {recipes.length === 1 ? 'recipe' : 'recipes'} from MongoDB
          {categoryParam !== 'All' && <span> in <strong>{categoryParam}</strong></span>}
        </p>
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <div className="home-loading-box">
          <div className="spinner"></div>
          <p>Fetching matching recipes from MongoDB...</p>
        </div>
      ) : recipes.length > 0 ? (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="empty-recipes-state card">
          <Filter size={48} className="empty-icon" />
          <h3>No matching recipes found</h3>
          <p>
            We couldn't find any recipes matching your chosen filters. Try adjusting your category or difficulty selection.
          </p>
          <div className="empty-actions">
            <button onClick={resetFilters} className="btn btn-secondary">
              Reset Filters
            </button>
            <Link to="/add-recipe" className="btn btn-primary">
              Be the First to Add This Recipe
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRecipesPage;
