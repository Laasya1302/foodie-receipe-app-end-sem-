import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recipeAPI, categoryAPI } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import './SearchRecipesPage.css';

const SearchRecipesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [diet, setDiet] = useState(searchParams.get('diet') || 'All');
  const [maxTime, setMaxTime] = useState(searchParams.get('maxTime') || '');

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchedOnce, setSearchedOnce] = useState(false);

  // Load category list
  useEffect(() => {
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

  // Fetch filtered recipes from MongoDB
  const executeSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (diet === 'veg') params.isVegetarian = true;
      if (diet === 'non-veg') params.isVegetarian = false;
      if (maxTime) params.maxCookTime = Number(maxTime);

      const res = await recipeAPI.getRecipes(params);
      if (res.data && res.data.recipes) {
        setRecipes(res.data.recipes);
      }
      setSearchedOnce(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [selectedCategory, difficulty, diet, maxTime]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchTerm.trim()) newParams.set('q', searchTerm.trim());
    if (selectedCategory !== 'All') newParams.set('category', selectedCategory);
    if (difficulty !== 'All') newParams.set('difficulty', difficulty);
    if (diet !== 'All') newParams.set('diet', diet);
    if (maxTime) newParams.set('maxTime', maxTime);
    setSearchParams(newParams);
    executeSearch();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setDifficulty('All');
    setDiet('All');
    setMaxTime('');
    setSearchParams({});
  };

  return (
    <div className="search-page container">
      {/* Header */}
      <div className="search-header text-center">
        <div className="inline-badge">
          <Search size={14} /> Full-Text MongoDB Search Engine
        </div>
        <h1 className="page-heading">Search Recipes & Ingredients</h1>
        <p className="page-subheading">
          Looking for a specific dish, spice, or category? Search by recipe title, listed ingredients, or culinary course.
        </p>

        {/* Big Search Input */}
        <form onSubmit={handleSearchSubmit} className="big-search-box card">
          <Search size={22} className="big-search-icon" />
          <input
            type="text"
            className="big-search-input"
            placeholder="Search by recipe name (e.g. Biryani), ingredient (e.g. Chicken, Cheese, Saffron), or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search input"
            >
              <X size={18} />
            </button>
          )}
          <button type="submit" className="btn btn-primary big-search-btn">
            Search
          </button>
        </form>
      </div>

      {/* Filter Sidebar & Results Grid */}
      <div className="search-layout">
        {/* Filters Panel */}
        <aside className="search-filter-panel card">
          <div className="panel-title-row">
            <div className="panel-heading">
              <Filter size={18} />
              <h4>Filter Search</h4>
            </div>
            <button onClick={handleClearSearch} className="reset-link-btn" title="Reset all filters">
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-group-title">Food Category</label>
            <div className="radio-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'All'}
                  onChange={() => setSelectedCategory('All')}
                />
                <span>All Categories</span>
              </label>
              {categories.map((c) => (
                <label key={c.id} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === c.name}
                    onChange={() => setSelectedCategory(c.name)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dietary Filter */}
          <div className="filter-group">
            <label className="filter-group-title">Diet Preference</label>
            <div className="radio-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="diet"
                  checked={diet === 'All'}
                  onChange={() => setDiet('All')}
                />
                <span>All Diets</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="diet"
                  checked={diet === 'veg'}
                  onChange={() => setDiet('veg')}
                />
                <span>Vegetarian Only 🌱</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="diet"
                  checked={diet === 'non-veg'}
                  onChange={() => setDiet('non-veg')}
                />
                <span>Non-Vegetarian 🍗</span>
              </label>
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="filter-group">
            <label className="filter-group-title">Difficulty Level</label>
            <div className="radio-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="diff"
                  checked={difficulty === 'All'}
                  onChange={() => setDifficulty('All')}
                />
                <span>All Levels</span>
              </label>
              {['Easy', 'Medium', 'Hard'].map((d) => (
                <label key={d} className="filter-option">
                  <input
                    type="radio"
                    name="diff"
                    checked={difficulty === d}
                    onChange={() => setDifficulty(d)}
                  />
                  <span>{d}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Cooking Time Filter */}
          <div className="filter-group">
            <label className="filter-group-title">Max Cook Time</label>
            <div className="radio-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="time"
                  checked={maxTime === ''}
                  onChange={() => setMaxTime('')}
                />
                <span>Any Duration</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="time"
                  checked={maxTime === '15'}
                  onChange={() => setMaxTime('15')}
                />
                <span>Quick (Under 15 mins)</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="time"
                  checked={maxTime === '30'}
                  onChange={() => setMaxTime('30')}
                />
                <span>Under 30 mins</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="time"
                  checked={maxTime === '60'}
                  onChange={() => setMaxTime('60')}
                />
                <span>Under 60 mins</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Results Stream */}
        <main className="search-results-main">
          <div className="search-status-bar">
            <p className="search-status-text">
              Found <strong>{recipes.length}</strong> matching {recipes.length === 1 ? 'recipe' : 'recipes'} in MongoDB
              {searchTerm && <span> for "<strong>{searchTerm}</strong>"</span>}
            </p>
          </div>

          {loading ? (
            <div className="home-loading-box">
              <div className="spinner"></div>
              <p>Searching MongoDB recipes and ingredients...</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="recipes-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="empty-recipes-state card">
              <Search size={48} className="empty-icon" />
              <h3>No matching recipes found in MongoDB</h3>
              <p>
                We couldn't find any recipes matching your query "{searchTerm}". Try different keywords or reset your filters.
              </p>
              <div className="empty-actions">
                <button onClick={handleClearSearch} className="btn btn-secondary">
                  Clear Search & Filters
                </button>
                <Link to="/add-recipe" className="btn btn-primary">
                  Publish "{searchTerm}" Yourself
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchRecipesPage;
