import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipeAPI, categoryAPI } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import CategoryCard from '../components/CategoryCard';
import {
  Search,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Heart,
  ChefHat,
  Flame,
  Award
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch latest recipes, popular recipes, and dynamic categories from MongoDB
        const [latestRes, popularRes, catRes] = await Promise.all([
          recipeAPI.getRecipes({ sort: 'newest', limit: 8 }),
          recipeAPI.getRecipes({ sort: 'popular', limit: 4 }),
          categoryAPI.getCategories()
        ]);

        if (latestRes.data && latestRes.data.recipes) {
          setLatestRecipes(latestRes.data.recipes);
        }

        if (popularRes.data && popularRes.data.recipes) {
          setPopularRecipes(popularRes.data.recipes);
        }

        if (catRes.data && catRes.data.categories) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Error fetching home page data from MongoDB:', err.message);
        setError('Could not connect to MongoDB server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/recipes');
    }
  };

  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <section className="home-hero">
        <div className="container home-hero-container">
          <div className="hero-content">
            <div className="hero-pill fade-in">
              <Sparkles size={16} /> <span>#1 Full-Stack Food Recipe App</span>
            </div>

            <h1 className="hero-headline fade-in">
              Cook With Passion, Savor Every{' '}
              <span className="hero-headline-highlight">Flavor</span>
            </h1>

            <p className="hero-description fade-in">
              Explore dynamic recipes straight from our MongoDB kitchen. Search by ingredients, filter by preparation time, save your favourites, or publish your own recipe to share with food lovers worldwide.
            </p>

            {/* Quick Hero Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hero-search-box fade-in">
              <Search size={20} className="search-box-icon" />
              <input
                type="text"
                placeholder="Search Biryani, Pasta, Chocolate Cake, Paneer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
              <button type="submit" className="btn btn-primary hero-search-btn">
                <span>Search</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Popular Keyword Chips */}
            <div className="hero-quick-chips">
              <span className="chips-label">Popular Searches:</span>
              {['Biryani', 'Chilli Chicken', 'Pizza', 'Pasta', 'Desserts'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(chip)}`)}
                  className="quick-chip-btn"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-card main-card">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
                alt="Delicious gourmet dish"
                className="hero-main-img"
              />
              <div className="hero-floating-badge top-right">
                <Flame size={18} color="#E26D24" />
                <div>
                  <span className="badge-caption">Hot & Trending</span>
                  <span className="badge-val">100% Chef Approved</span>
                </div>
              </div>
              <div className="hero-floating-badge bottom-left">
                <Heart size={18} color="#E74C3C" fill="#E74C3C" />
                <div>
                  <span className="badge-caption">Loved by</span>
                  <span className="badge-val">10,000+ Foodies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="home-section container">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Browse Food Categories</h2>
            <p className="section-subheading">
              Explore dynamic recipes across 10 authentic culinary styles and courses.
            </p>
          </div>
          <Link to="/categories" className="section-view-all">
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-grid-preview">
          {categories.slice(0, 5).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* ================= POPULAR / TOP RATED RECIPES ================= */}
      <section className="home-section popular-section container">
        <div className="section-header-row">
          <div>
            <div className="inline-badge">
              <TrendingUp size={16} /> Highly Rated
            </div>
            <h2 className="section-heading">Popular Recipes</h2>
            <p className="section-subheading">
              Community favourites with the highest star ratings and glowing reviews.
            </p>
          </div>
          <Link to="/recipes?sort=popular" className="section-view-all">
            See Top Ranked <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="home-loading-box">
            <div className="spinner"></div>
            <p>Loading recipes from MongoDB...</p>
          </div>
        ) : popularRecipes.length > 0 ? (
          <div className="recipes-grid">
            {popularRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="no-data-text">No recipes found. Seed or publish your first recipe!</p>
        )}
      </section>

      {/* ================= LATEST RECIPES ================= */}
      <section className="home-section latest-section container">
        <div className="section-header-row">
          <div>
            <div className="inline-badge new">
              <Clock size={16} /> Just Added
            </div>
            <h2 className="section-heading">Latest Published Recipes</h2>
            <p className="section-subheading">
              Freshly created recipes stored directly in MongoDB. Automatically updated whenever anyone publishes a recipe!
            </p>
          </div>
          <Link to="/recipes?sort=newest" className="section-view-all">
            Explore All Recipes <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="home-loading-box">
            <div className="spinner"></div>
            <p>Fetching latest dishes...</p>
          </div>
        ) : latestRecipes.length > 0 ? (
          <div className="recipes-grid">
            {latestRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="no-data-text">No recipes currently published.</p>
        )}
      </section>

      {/* ================= ADD YOUR OWN RECIPE BANNER ================= */}
      <section className="home-cta-section container">
        <div className="cta-banner-card">
          <div className="cta-content">
            <div className="cta-icon-pill">
              <ChefHat size={22} />
              <span>Share Your Culinary Magic</span>
            </div>
            <h2 className="cta-title">Do you have an unforgettable family recipe?</h2>
            <p className="cta-desc">
              Don’t keep your secret spices to yourself! Upload food photos, list your ingredients, add cooking instructions, and publish it instantly to MongoDB for the entire world to taste.
            </p>
            <div className="cta-actions">
              <Link to="/add-recipe" className="btn btn-primary btn-lg">
                <PlusCircle size={20} />
                <span>Publish Your Recipe Now</span>
              </Link>
              <Link to="/my-recipes" className="btn btn-secondary btn-lg">
                <span>View My Published Recipes</span>
              </Link>
            </div>
          </div>
          <div className="cta-visual">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=80"
              alt="Chef cooking in kitchen"
              className="cta-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
