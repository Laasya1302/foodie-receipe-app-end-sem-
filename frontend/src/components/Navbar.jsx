import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoriteContext';
import { formatImageUrl } from '../services/api';
import {
  Utensils,
  Heart,
  PlusCircle,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Grid,
  Settings,
  BookOpen,
  Info,
  Mail,
  ChevronDown,
  Star
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenus}>
          <div className="logo-icon-wrapper">
            <Utensils size={24} className="logo-icon" />
          </div>
          <span className="logo-text">
            FOOD<span className="logo-highlight">IE</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/recipes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Compass size={17} />
            All Recipes
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Grid size={17} />
            Categories
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Search size={17} />
            Search
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/favorites" className={({ isActive }) => `nav-link fav-nav-link ${isActive ? 'active' : ''}`}>
              <Heart size={17} className="nav-heart-icon" />
              Favourites
              {favorites.length > 0 && <span className="nav-fav-badge">{favorites.length}</span>}
            </NavLink>
          )}
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        {/* Action Controls & User Account */}
        <div className="navbar-actions">
          {/* Add Recipe Action Button */}
          <Link to="/add-recipe" className="btn btn-primary btn-sm add-recipe-btn" onClick={closeMenus}>
            <PlusCircle size={18} />
            <span>Add Recipe</span>
          </Link>

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button
                className="user-profile-trigger"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User menu"
              >
                <img
                  src={formatImageUrl(user?.profileImage)}
                  alt={user?.name}
                  className="user-nav-avatar"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className="user-nav-name">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={15} />
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu fade-in">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user?.name}</p>
                    <p className="dropdown-user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={closeMenus}>
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/my-recipes" className="dropdown-item" onClick={closeMenus}>
                    <BookOpen size={16} /> My Recipes
                  </Link>
                  <Link to="/favorites" className="dropdown-item" onClick={closeMenus}>
                    <Heart size={16} /> Favourite Recipes ({favorites.length})
                  </Link>
                  <Link to="/reviews" className="dropdown-item" onClick={closeMenus}>
                    <Star size={16} /> Reviews & Ratings
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={closeMenus}>
                    <Settings size={16} /> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer fade-in">
          <div className="mobile-nav-links">
            <NavLink to="/" className="mobile-link" onClick={closeMenus}>
              Home
            </NavLink>
            <NavLink to="/recipes" className="mobile-link" onClick={closeMenus}>
              <Compass size={18} /> All Recipes
            </NavLink>
            <NavLink to="/categories" className="mobile-link" onClick={closeMenus}>
              <Grid size={18} /> Categories
            </NavLink>
            <NavLink to="/search" className="mobile-link" onClick={closeMenus}>
              <Search size={18} /> Search Recipes
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/favorites" className="mobile-link" onClick={closeMenus}>
                  <Heart size={18} /> Favourites ({favorites.length})
                </NavLink>
                <NavLink to="/my-recipes" className="mobile-link" onClick={closeMenus}>
                  <BookOpen size={18} /> My Recipes
                </NavLink>
                <NavLink to="/profile" className="mobile-link" onClick={closeMenus}>
                  <User size={18} /> My Profile
                </NavLink>
                <NavLink to="/reviews" className="mobile-link" onClick={closeMenus}>
                  <Star size={18} /> Reviews
                </NavLink>
                <NavLink to="/settings" className="mobile-link" onClick={closeMenus}>
                  <Settings size={18} /> Settings
                </NavLink>
                <button className="mobile-link logout-mobile" onClick={handleLogout}>
                  <LogOut size={18} /> Logout ({user?.name})
                </button>
              </>
            ) : (
              <div className="mobile-auth-cta">
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenus}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenus}>
                  Create Account
                </Link>
              </div>
            )}
            <NavLink to="/about" className="mobile-link" onClick={closeMenus}>
              <Info size={18} /> About Us
            </NavLink>
            <NavLink to="/contact" className="mobile-link" onClick={closeMenus}>
              <Mail size={18} /> Contact Us
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
