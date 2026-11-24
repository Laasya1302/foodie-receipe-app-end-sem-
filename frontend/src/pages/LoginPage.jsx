import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import {
  Utensils,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ChefHat,
  CheckCircle2
} from 'lucide-react';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please enter both email and password.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      setToast({ message: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 700);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login helper (Chef Rahul demo user created in seed)
  const handleDemoLogin = async () => {
    setEmail('chef@foodie.com');
    setPassword('password123');
    try {
      setLoading(true);
      await login('chef@foodie.com', 'password123');
      setToast({ message: 'Logged in as Demo Chef Rahul!', type: 'success' });
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 700);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Demo login failed. Please ensure backend is running.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSuccess(false);
        setForgotEmail('');
      }, 3000);
    }
  };

  return (
    <div className="auth-page-container">
      {toast.message && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        </div>
      )}

      <div className="auth-card card fade-in">
        <div className="auth-header">
          <div className="auth-logo-icon">
            <Utensils size={28} />
          </div>
          <h1 className="auth-title">Welcome Back to FOODIE</h1>
          <p className="auth-subtitle">
            Sign in to access your favourite recipes, meal ideas, and published dishes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Password</label>
              <button
                type="button"
                className="forgot-link-btn"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? 'Signing In...' : 'Login to FOODIE'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Demo Account Shortcut */}
        <div className="demo-login-box">
          <p className="demo-text">Want to test immediately without typing?</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm demo-btn"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <ChefHat size={16} />
            <span>One-Click Login as Chef Rahul</span>
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-switch-link">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop fade-in" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h3>Reset Your Password</h3>
            <p className="modal-desc">
              Enter your registered email address and we will send you password reset instructions.
            </p>
            {forgotSuccess ? (
              <div className="modal-success-alert">
                <CheckCircle2 size={20} color="#27AE60" />
                <span>Instructions sent! Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
