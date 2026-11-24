import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI, formatImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import {
  User,
  Mail,
  Lock,
  Upload,
  ArrowLeft,
  Save,
  CheckCircle2,
  Camera
} from 'lucide-react';
import './EditProfilePage.css';

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(formatImageUrl(user?.profileImage));

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setProfileImage(user.profileImage || '');
      setImagePreview(formatImageUrl(user.profileImage));
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        setToast({ message: 'Please select a valid image file (JPG, PNG, WEBP).', type: 'error' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (!currentPassword) {
        setToast({ message: 'Current password is required to update your password.', type: 'error' });
        return;
      }
      if (newPassword.length < 6) {
        setToast({ message: 'New password must be at least 6 characters.', type: 'error' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setToast({ message: 'New passwords do not match.', type: 'error' });
        return;
      }
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('bio', bio.trim());

      if (imageFile) {
        formData.append('profileImage', imageFile);
      } else if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      if (newPassword) {
        formData.append('currentPassword', currentPassword);
        formData.append('newPassword', newPassword);
      }

      const res = await userAPI.updateProfile(formData);
      if (res.data && res.data.user) {
        updateUser(res.data.user);
      }

      setToast({ message: 'Profile updated successfully in MongoDB!', type: 'success' });
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      console.error('Update profile error:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to update profile.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page container">
      {toast.message && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        </div>
      )}

      <div className="details-top-bar">
        <Link to="/profile" className="back-link">
          <ArrowLeft size={18} /> <span>Back to Profile</span>
        </Link>
      </div>

      <div className="edit-profile-header">
        <h1 className="page-heading">Edit Profile & Account Settings</h1>
        <p className="page-subheading">
          Update your public chef profile, bio, display picture, or change your account password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form card">
        {/* Avatar Upload Box */}
        <div className="avatar-edit-section">
          <div className="avatar-preview-wrapper">
            <img
              src={imagePreview}
              alt={name}
              className="avatar-large-preview"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <label htmlFor="avatar-upload-input" className="avatar-upload-badge" title="Change photo">
              <Camera size={16} />
            </label>
            <input
              type="file"
              id="avatar-upload-input"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <div>
            <h4 className="avatar-upload-title">Profile Picture</h4>
            <p className="avatar-upload-desc">JPG, PNG, or WEBP. Max 5MB file upload via Multer.</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="form-section">
          <h3 className="section-title-sm">Chef Profile Information</h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Chef Bio</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Tell other foodies about your cooking background, favorite cuisines, and signature recipes..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>

        {/* Change Password */}
        <div className="form-section">
          <h3 className="section-title-sm">Security & Password (Optional)</h3>
          <p className="section-help-text">Leave blank if you do not wish to change your password.</p>

          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-submit-bar">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            {!loading && <Save size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
