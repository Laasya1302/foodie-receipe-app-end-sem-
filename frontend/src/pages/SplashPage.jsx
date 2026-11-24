import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Sparkles,
  Heart,
  ChefHat,
  Search,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import './SplashPage.css';

const SplashPage = () => {
  return (
    <div className="splash-page">
      {/* Hero Welcome Banner */}
      <section className="splash-hero">
        <div className="container splash-hero-container">
          <div className="splash-hero-badge fade-in">
            <Sparkles size={16} /> Welcome to FOODIE Recipe Platform
          </div>

          <h1 className="splash-title fade-in">
            Where Food Lovers Turn Every Meal Into A{' '}
            <span className="splash-title-highlight">Masterpiece</span>
          </h1>

          <p className="splash-subtitle fade-in">
            Discover thousands of community-crafted recipes, save your favourite dishes, publish your own secret creations to MongoDB in seconds, and connect with culinary enthusiasts worldwide.
          </p>

          <div className="splash-cta-row fade-in">
            <Link to="/" className="btn btn-primary btn-lg">
              <span>Enter Recipe Hub</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              <span>Create Free Account</span>
            </Link>
          </div>

          {/* Key Feature Stats Pills */}
          <div className="splash-stats-bar">
            <div className="splash-stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Cuisine Categories</span>
            </div>
            <div className="splash-stat-divider"></div>
            <div className="splash-stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">MongoDB Live Sync</span>
            </div>
            <div className="splash-stat-divider"></div>
            <div className="splash-stat-item">
              <span className="stat-number">Unlimited</span>
              <span className="stat-label">Recipe Publishing</span>
            </div>
            <div className="splash-stat-divider"></div>
            <div className="splash-stat-item">
              <span className="stat-number">4.9 ★</span>
              <span className="stat-label">Community Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="splash-features container">
        <div className="splash-section-header">
          <h2 className="section-title">Everything You Need To Cook Like A Pro</h2>
          <p className="section-subtitle">
            Crafted with passion, modern aesthetics, and powerful full-stack technology.
          </p>
        </div>

        <div className="splash-features-grid">
          <div className="feature-box card">
            <div className="feature-icon-box orange">
              <Utensils size={28} />
            </div>
            <h3>Explore & Discover</h3>
            <p>
              Dive into rich categories: Breakfast, Lunch, Dinner, Desserts, Fast Food, Traditional Food, and more. Filter by cooking time, difficulty, and dietary preferences.
            </p>
          </div>

          <div className="feature-box card">
            <div className="feature-icon-box brown">
              <ChefHat size={28} />
            </div>
            <h3>Publish Unlimited Recipes</h3>
            <p>
              Upload food photography, specify ingredients, preparation steps, timings, and instantly store your culinary creations in MongoDB Atlas with one click.
            </p>
          </div>

          <div className="feature-box card">
            <div className="feature-icon-box red">
              <Heart size={28} />
            </div>
            <h3>Save Your Favourites</h3>
            <p>
              Tap the heart icon on any recipe to save it permanently in your personal MongoDB favourites list. Access your saved dishes from any device anytime.
            </p>
          </div>

          <div className="feature-box card">
            <div className="feature-icon-box gold">
              <Award size={28} />
            </div>
            <h3>Community Ratings & Reviews</h3>
            <p>
              Rate dishes 1 to 5 stars, leave honest feedback, share cooking modifications, and help fellow foodies make perfect meals every time.
            </p>
          </div>
        </div>
      </section>

      {/* Culinary Visual Gallery */}
      <section className="splash-gallery-section container">
        <div className="splash-gallery-banner">
          <div className="gallery-text">
            <h2>Ready to start your culinary journey?</h2>
            <p>Join thousands of home cooks and chefs sharing delicious memories today.</p>
            <div className="banner-buttons">
              <Link to="/recipes" className="btn btn-primary">
                Browse All Recipes
              </Link>
              <Link to="/add-recipe" className="btn btn-secondary">
                Publish a Recipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SplashPage;
