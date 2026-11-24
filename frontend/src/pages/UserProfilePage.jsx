import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, formatImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Heart,
  Star,
  Edit,
  PlusCircle,
  ChefHat
} from 'lucide-react';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getProfile();
        if (res.data && res.data.user) {
          setProfileData(res.data.user);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const currentUser = profileData || authUser;

  if (loading) {
    return (
      <div className="home-loading-box" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p>Loading chef profile from MongoDB...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-page container">
      {/* Profile Header Hero Card */}
      <div className="profile-hero-card card">
        <div className="profile-banner-bg"></div>

        <div className="profile-hero-body">
          <div className="profile-avatar-wrapper">
            <img
              src={formatImageUrl(currentUser?.profileImage)}
              alt={currentUser?.name}
              className="profile-large-avatar"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          <div className="profile-meta-main">
            <div className="profile-name-row">
              <div>
                <h1 className="profile-display-name">{currentUser?.name}</h1>
                <p className="profile-email">
                  <Mail size={15} /> {currentUser?.email}
                </p>
              </div>

              <div className="profile-action-btns">
                <Link to="/edit-profile" className="btn btn-secondary btn-sm">
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </Link>
                <Link to="/add-recipe" className="btn btn-primary btn-sm">
                  <PlusCircle size={16} />
                  <span>Add Recipe</span>
                </Link>
              </div>
            </div>

            <p className="profile-bio-text">
              {currentUser?.bio || 'Passionate foodie and home chef exploring delicious culinary adventures on FOODIE.'}
            </p>

            <div className="profile-join-date">
              <Calendar size={14} /> Member since{' '}
              {currentUser?.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long'
                  })
                : '2026'}
            </div>
          </div>
        </div>

        {/* Profile Statistics Bar */}
        <div className="profile-stats-bar">
          <div className="profile-stat-box">
            <BookOpen size={20} className="stat-icon orange" />
            <div>
              <span className="profile-stat-num">{currentUser?.recipeCount ?? (currentUser?.recipes?.length || 0)}</span>
              <span className="profile-stat-lbl">Recipes Published</span>
            </div>
          </div>

          <div className="profile-stat-divider"></div>

          <div className="profile-stat-box">
            <Heart size={20} className="stat-icon red" />
            <div>
              <span className="profile-stat-num">{currentUser?.favoriteCount || 0}</span>
              <span className="profile-stat-lbl">Favourites Saved</span>
            </div>
          </div>

          <div className="profile-stat-divider"></div>

          <div className="profile-stat-box">
            <Star size={20} className="stat-icon gold" />
            <div>
              <span className="profile-stat-num">{currentUser?.reviewsCount || 0}</span>
              <span className="profile-stat-lbl">Reviews Given</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Published Recipes Section */}
      <section className="profile-recipes-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-heading">Recipes Published by {currentUser?.name?.split(' ')[0]}</h2>
            <p className="section-subheading">
              All dishes authored by you and permanently stored in MongoDB Atlas.
            </p>
          </div>
          <Link to="/my-recipes" className="section-view-all">
            Manage All in Dashboard →
          </Link>
        </div>

        {currentUser?.recipes && currentUser.recipes.length > 0 ? (
          <div className="recipes-grid">
            {currentUser.recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="empty-recipes-state card">
            <ChefHat size={44} className="empty-icon" />
            <h3>No published recipes yet</h3>
            <p>Ready to share your culinary skills? Publish your first recipe to MongoDB now.</p>
            <Link to="/add-recipe" className="btn btn-primary">
              <PlusCircle size={18} /> Publish a Recipe
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfilePage;
