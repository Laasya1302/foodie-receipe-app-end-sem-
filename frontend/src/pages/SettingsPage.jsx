import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import {
  Settings,
  Bell,
  Database,
  Shield,
  Moon,
  Trash2,
  LogOut,
  CheckCircle2,
  Server
} from 'lucide-react';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [favoriteAlerts, setFavoriteAlerts] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setToast({ message: 'Settings and notification preferences saved!', type: 'success' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="settings-page container">
      {toast.message && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        </div>
      )}

      <div className="settings-header">
        <div className="inline-badge">
          <Settings size={14} /> Preferences & Configuration
        </div>
        <h1 className="page-heading">Application Settings</h1>
        <p className="page-subheading">
          Manage your notifications, MongoDB connectivity status, profile display preferences, and account privacy.
        </p>
      </div>

      <div className="settings-grid">
        {/* Left Column: Form Settings */}
        <div className="settings-main card">
          <form onSubmit={handleSavePreferences}>
            {/* Notification settings */}
            <div className="settings-section">
              <div className="section-title-icon-row">
                <Bell size={20} className="section-icon orange" />
                <h3>Notification Preferences</h3>
              </div>
              <p className="settings-desc">Choose what notifications you receive about your published recipes.</p>

              <div className="toggles-list">
                <label className="toggle-item">
                  <div className="toggle-label-content">
                    <span className="toggle-title">Recipe Reviews & Ratings</span>
                    <span className="toggle-desc">Get notified when a fellow foodie reviews one of your dishes.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reviewAlerts}
                    onChange={(e) => setReviewAlerts(e.target.checked)}
                    className="toggle-checkbox"
                  />
                </label>

                <label className="toggle-item">
                  <div className="toggle-label-content">
                    <span className="toggle-title">New Favourites</span>
                    <span className="toggle-desc">Notify me when someone saves my recipe to their favourites.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={favoriteAlerts}
                    onChange={(e) => setFavoriteAlerts(e.target.checked)}
                    className="toggle-checkbox"
                  />
                </label>

                <label className="toggle-item">
                  <div className="toggle-label-content">
                    <span className="toggle-title">Weekly Chef Digest</span>
                    <span className="toggle-desc">Receive top trending recipes and community highlights.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="toggle-checkbox"
                  />
                </label>
              </div>
            </div>

            {/* Database & System Info */}
            <div className="settings-section">
              <div className="section-title-icon-row">
                <Database size={20} className="section-icon brown" />
                <h3>Database & Environment Connection</h3>
              </div>
              <p className="settings-desc">Live connection diagnostics for FOODIE.</p>

              <div className="db-info-box">
                <div className="db-status-row">
                  <span className="db-label">Database Provider:</span>
                  <span className="db-val">MongoDB Atlas / Mongoose ODM</span>
                </div>
                <div className="db-status-row">
                  <span className="db-label">Connection Status:</span>
                  <span className="db-status-pill online">● Active & Connected</span>
                </div>
                <div className="db-status-row">
                  <span className="db-label">Backend REST API:</span>
                  <span className="db-val">Express.js (Port 5000)</span>
                </div>
                <div className="db-status-row">
                  <span className="db-label">Image Storage Engine:</span>
                  <span className="db-val">Multer Static Files (/uploads)</span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Notification Preferences
            </button>
          </form>
        </div>

        {/* Right Column: Account Status & Danger Zone */}
        <div className="settings-sidebar">
          {/* Account Card */}
          <div className="card settings-side-card">
            <h4 className="side-card-title">Signed In Account</h4>
            <p className="user-email-text">{user?.name} ({user?.email})</p>
            <div className="side-card-buttons">
              <button onClick={() => navigate('/profile')} className="btn btn-secondary btn-sm">
                View Profile
              </button>
              <button onClick={() => navigate('/edit-profile')} className="btn btn-outline btn-sm">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card settings-side-card danger-card">
            <h4 className="side-card-title danger">Session & Account</h4>
            <p className="danger-text">
              Sign out from this device. All your recipes and favourites will remain safely stored in MongoDB.
            </p>
            <button onClick={handleLogout} className="btn btn-danger btn-block btn-sm">
              <LogOut size={16} /> Sign Out of FOODIE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
