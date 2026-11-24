import React, { useState } from 'react';
import Toast from '../components/Toast';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import './ContactPage.css';

const FAQS = [
  {
    q: 'How do I add and publish my own recipes on FOODIE?',
    a: 'Simply click "Add Recipe" in the top navigation bar or homepage banner. Fill in the recipe name, description, category, timings, ingredients, and step-by-step instructions. You can upload your own food photography or use an image link. When you click "Publish Recipe", it is immediately saved in MongoDB and visible across the app!'
  },
  {
    q: 'Are recipes permanently stored in MongoDB?',
    a: 'Yes! Every user account, published recipe, review, and favorite is permanently stored in MongoDB Atlas via Mongoose ODM schemas. Your data will never disappear upon restarting the server.'
  },
  {
    q: 'Can I edit or delete my recipe after publishing?',
    a: 'Yes, as the recipe creator you have full CRUD control. Visit your recipe page or go to "My Recipes" in the user dropdown to edit ingredients, adjust steps, update the photo, or delete the recipe.'
  },
  {
    q: 'How do Favourite Recipes work?',
    a: 'Click the heart icon on any recipe card or details page. When logged in, this sends a POST request to our MongoDB database linking the recipe to your user ID. You can view all saved recipes in the "Favourites" page anytime.'
  },
  {
    q: 'Can other foodies rate and review my dishes?',
    a: 'Yes! Every logged-in foodie can rate your recipe from 1 to 5 stars and write feedback. The app automatically recalculates the average rating and review counter in MongoDB.'
  }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [toast, setToast] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({ message: 'Please fill in your name, email, and message.', type: 'error' });
      return;
    }

    setLoading(true);
    // Simulate real network submission with feedback
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setToast({
        message: 'Your message has been sent to our culinary team! We will reply within 24 hours.',
        type: 'success'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="contact-page container">
      {toast.message && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        </div>
      )}

      {/* Header */}
      <div className="contact-header text-center">
        <div className="inline-badge">
          <Mail size={14} /> Connect With FOODIE
        </div>
        <h1 className="page-heading">We’d Love To Hear From You</h1>
        <p className="page-subheading">
          Have a recipe question, culinary suggestion, feedback, or need help with your MongoDB account? Send us a message and our food team will get back to you!
        </p>
      </div>

      {/* Two-Column Contact Form & Cards */}
      <div className="contact-grid">
        {/* Left: Contact Form */}
        <div className="contact-form-card card">
          <h3>Send Us A Message</h3>
          <p className="form-sub-text">Fill in the form below and we will get back to you promptly.</p>

          {submitted ? (
            <div className="contact-success-state">
              <CheckCircle2 size={48} color="#27AE60" className="success-icon" />
              <h4>Message Sent Successfully!</h4>
              <p>
                Thank you for reaching out. One of our community chefs will review your inquiry and respond to your email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn btn-secondary btn-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-actual-form">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Chef Julia"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="form-input"
                  placeholder="e.g. Recipe inquiry, recipe feature request, or culinary feedback"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea
                  name="message"
                  className="form-textarea"
                  rows="5"
                  placeholder="Tell us what's on your mind or how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={loading}
              >
                {loading ? 'Sending Message...' : 'Send Message'}
                {!loading && <Send size={18} />}
              </button>
            </form>
          )}
        </div>

        {/* Right: Contact Information Cards */}
        <div className="contact-info-column">
          <div className="contact-info-card card">
            <div className="contact-info-icon orange">
              <Mail size={22} />
            </div>
            <div>
              <h4>Email Support</h4>
              <p>Direct inquiries to our team:</p>
              <a href="mailto:support@foodie.com" className="contact-link">support@foodie.com</a>
            </div>
          </div>

          <div className="contact-info-card card">
            <div className="contact-info-icon brown">
              <MapPin size={22} />
            </div>
            <div>
              <h4>Culinary Headquarters</h4>
              <p>104 Culinary Boulevard, Gourmet City, GC 40012</p>
              <span className="contact-sub-info">Open for foodie visits</span>
            </div>
          </div>

          <div className="contact-info-card card">
            <div className="contact-info-icon green">
              <Clock size={22} />
            </div>
            <div>
              <h4>Support Hours</h4>
              <p>Monday – Saturday: 9:00 AM – 7:00 PM</p>
              <span className="contact-sub-info">MongoDB server active 24/7/365</span>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <section className="faq-section">
        <div className="faq-header text-center">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about using FOODIE, publishing recipes, and MongoDB data sync.</p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="faq-item card">
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} color="#E26D24" /> : <ChevronDown size={20} />}
                </button>
                {isOpen && (
                  <div className="faq-answer-box fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
