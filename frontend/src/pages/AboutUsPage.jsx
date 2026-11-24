import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Heart,
  ChefHat,
  Database,
  Code2,
  ShieldCheck,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero-container">
          <div className="inline-badge">
            <Sparkles size={14} /> The Story of FOODIE
          </div>
          <h1 className="about-title">
            Crafting A World Where Every Home Cook Becomes An{' '}
            <span className="hero-headline-highlight">Executive Chef</span>
          </h1>
          <p className="about-subtitle">
            FOODIE was founded with a simple yet ambitious vision: to create a modern, full-stack culinary community where recipe discovery is effortless, photography is mouthwatering, and anyone can publish their secret family recipes to real MongoDB cloud storage.
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="container about-story-section">
        <div className="story-grid">
          <div className="story-content">
            <span className="sub-heading-pill">Our Philosophy</span>
            <h2>More Than Recipes — It’s A Community Kitchen</h2>
            <p>
              Food brings families together, transcends borders, and preserves heritage. Too many recipe sites today are cluttered with static, hardcoded pages, intrusive ads, and no real way to contribute.
            </p>
            <p>
              FOODIE changes that. Built from the ground up as a fully interactive full-stack application, every dish you publish is permanently preserved in MongoDB Atlas, indexed across categories, and made accessible to thousands of fellow cooks around the globe.
            </p>
            <div className="story-stats-row">
              <div className="story-stat">
                <h3>10+</h3>
                <p>Culinary Categories</p>
              </div>
              <div className="story-stat">
                <h3>100%</h3>
                <p>MongoDB Persistent</p>
              </div>
              <div className="story-stat">
                <h3>24/7</h3>
                <p>Real-Time Sync</p>
              </div>
            </div>
          </div>

          <div className="story-visual card">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80"
              alt="Culinary chef preparing dish"
              className="story-img"
            />
          </div>
        </div>
      </section>

      {/* Tech Stack Breakdown */}
      <section className="container about-tech-section">
        <div className="text-center section-header-box">
          <span className="sub-heading-pill">Engineering Excellence</span>
          <h2>The Full-Stack Architecture Behind FOODIE</h2>
          <p className="tech-desc">
            Engineered with modern, production-grade technologies for blazing speed, reliability, and security.
          </p>
        </div>

        <div className="tech-cards-grid">
          <div className="tech-card card">
            <div className="tech-icon-circle orange">
              <Code2 size={24} />
            </div>
            <h4>Modern React Frontend</h4>
            <p>
              Built with React, React Router DOM, dynamic Axios services, context APIs for auth and favourites, and beautiful responsive CSS3.
            </p>
          </div>

          <div className="tech-card card">
            <div className="tech-icon-circle brown">
              <Utensils size={24} />
            </div>
            <h4>Node.js & Express REST API</h4>
            <p>
              Modular architecture with dedicated controllers, routes, Helmet security, CORS, and robust error handling middleware.
            </p>
          </div>

          <div className="tech-card card">
            <div className="tech-icon-circle green">
              <Database size={24} />
            </div>
            <h4>MongoDB Atlas & Mongoose</h4>
            <p>
              Real MongoDB collections for Users, Recipes, Favourites, and Reviews with strict Mongoose validation schemas and automatic indexing.
            </p>
          </div>

          <div className="tech-card card">
            <div className="tech-icon-circle gold">
              <ShieldCheck size={24} />
            </div>
            <h4>JWT & Secure Multer Uploads</h4>
            <p>
              Bcryptjs password hashing, JWT stateless authentication, and Multer file upload engine for JPG/PNG recipe photography.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container about-cta-banner">
        <div className="about-cta-card card">
          <h2>Ready To Share Your Culinary Secrets?</h2>
          <p>Join our thriving foodie community and publish your first recipe today.</p>
          <div className="about-cta-btns">
            <Link to="/recipes" className="btn btn-secondary btn-lg">
              <Compass size={18} /> Browse Recipes
            </Link>
            <Link to="/add-recipe" className="btn btn-primary btn-lg">
              <ChefHat size={18} /> Publish a Recipe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
