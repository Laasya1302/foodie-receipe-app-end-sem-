import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Brand & Bio */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <div className="logo-icon-wrapper small">
              <Utensils size={20} className="logo-icon" />
            </div>
            <span className="logo-text">
              FOOD<span className="logo-highlight">IE</span>
            </span>
          </Link>
          <p className="footer-bio">
            FOODIE is a vibrant culinary community where passionate home chefs, food lovers, and curious cooks share, discover, and celebrate mouthwatering food recipes from around the globe.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Explore Recipes</h4>
          <ul className="footer-links">
            <li><Link to="/recipes">All Recipes</Link></li>
            <li><Link to="/categories">Browse Categories</Link></li>
            <li><Link to="/search">Search Recipes</Link></li>
            <li><Link to="/recipes?sort=popular">Popular Dishes</Link></li>
            <li><Link to="/recipes?sort=fastest">Quick & 30-Min Meals</Link></li>
            <li><Link to="/recipes?isVegetarian=true">Vegetarian Specials</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4 className="footer-heading">Top Categories</h4>
          <ul className="footer-links">
            <li><Link to="/recipes?category=Breakfast">Breakfast Specials</Link></li>
            <li><Link to="/recipes?category=Lunch">Wholesome Lunch</Link></li>
            <li><Link to="/recipes?category=Dinner">Family Dinners</Link></li>
            <li><Link to="/recipes?category=Desserts">Sweet Treats</Link></li>
            <li><Link to="/recipes?category=Traditional%20Food">Traditional Cuisine</Link></li>
            <li><Link to="/recipes?category=Fast%20Food">Street & Fast Food</Link></li>
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div className="footer-col newsletter-col">
          <h4 className="footer-heading">Culinary Newsletter</h4>
          <p className="newsletter-desc">
            Subscribe to get weekly chef-curated recipes, secret cooking tips, and fresh foodie trends in your inbox!
          </p>
          {subscribed ? (
            <div className="newsletter-success">
              <CheckCircle size={18} />
              <span>Thank you! You are now subscribed.</span>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          )}

          <div className="footer-contact-info">
            <p><Mail size={14} /> support@foodie.com</p>
            <p><MapPin size={14} /> 104 Culinary Boulevard, Gourmet City</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>© {new Date().getFullYear()} FOODIE App. Built with passion for great food & community.</p>
          <div className="footer-legal-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Support</Link>
            <Link to="/settings">App Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
