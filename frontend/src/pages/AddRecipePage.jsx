import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../services/api';
import Toast from '../components/Toast';
import {
  Plus,
  Trash2,
  Upload,
  Image,
  Clock,
  Users,
  ChefHat,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './AddRecipePage.css';

const CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Desserts',
  'Vegetarian',
  'Non-Vegetarian',
  'Fast Food',
  'Drinks',
  'Traditional Food'
];

const AddRecipePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [preparationTime, setPreparationTime] = useState(15);
  const [cookingTime, setCookingTime] = useState(25);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('Medium');
  const [isVegetarian, setIsVegetarian] = useState(false);

  // Image upload handling: file upload via Multer OR direct URL
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'

  // Dynamic Ingredients List
  const [ingredients, setIngredients] = useState(['', '', '']);

  // Dynamic Instructions Steps
  const [instructions, setInstructions] = useState(['', '', '']);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        setToast({ message: 'Only JPG, JPEG, PNG, or WEBP images are supported.', type: 'error' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setToast({ message: 'Image size must be under 5MB.', type: 'error' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  // Add / remove ingredients
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Add / remove instructions
  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstructionField = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstructionField = (index) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const totalTime = (Number(preparationTime) || 0) + (Number(cookingTime) || 0);

  // Form submit to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setToast({ message: 'Please enter a recipe title.', type: 'error' });
      return;
    }

    if (!description.trim()) {
      setToast({ message: 'Please write a short description.', type: 'error' });
      return;
    }

    if (uploadMode === 'file' && !imageFile && !imagePreview) {
      setToast({ message: 'Please upload a recipe photo.', type: 'error' });
      return;
    }

    if (uploadMode === 'url' && !imageUrl.trim()) {
      setToast({ message: 'Please provide an image URL.', type: 'error' });
      return;
    }

    const filteredIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    if (filteredIngredients.length === 0) {
      setToast({ message: 'Please specify at least one ingredient.', type: 'error' });
      return;
    }

    const filteredInstructions = instructions.map((s) => s.trim()).filter(Boolean);
    if (filteredInstructions.length === 0) {
      setToast({ message: 'Please provide at least one cooking instruction step.', type: 'error' });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('preparationTime', preparationTime);
      formData.append('cookingTime', cookingTime);
      formData.append('servings', servings);
      formData.append('difficulty', difficulty);
      formData.append('isVegetarian', isVegetarian || category === 'Vegetarian');

      // Append ingredients and instructions as JSON
      formData.append('ingredients', JSON.stringify(filteredIngredients));
      formData.append('instructions', JSON.stringify(filteredInstructions));

      if (uploadMode === 'file' && imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }

      // Send to backend REST API & MongoDB
      const res = await recipeAPI.createRecipe(formData);

      setToast({
        message: 'Recipe published successfully! Redirecting to recipe...',
        type: 'success'
      });

      // Redirect directly to the newly published recipe details page
      setTimeout(() => {
        if (res.data?.recipe?._id) {
          navigate(`/recipes/${res.data.recipe._id}`);
        } else {
          navigate('/recipes');
        }
      }, 1200);
    } catch (err) {
      console.error('Publish error:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to publish recipe to MongoDB. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-page container">
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
      <div className="add-recipe-header">
        <div className="inline-badge">
          <Sparkles size={15} /> Dynamic MongoDB Recipe Creator
        </div>
        <h1 className="page-heading">Add Your Own Recipe</h1>
        <p className="page-subheading">
          Share your culinary creations with the world! Fill in the recipe details below and hit "Publish Recipe" to permanently store your dish in MongoDB Atlas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="add-recipe-form-card card">
        {/* Section 1: Basic Information */}
        <div className="form-section">
          <h3 className="section-title-sm">1. Recipe Overview</h3>

          <div className="form-group">
            <label className="form-label">
              Recipe Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Creamy Tuscan Garlic Chicken or Homemade Gulab Jamun"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Short Description <span className="req">*</span>
            </label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Tell us what makes this dish so delicious, its aroma, texture, and why you love it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                Food Category <span className="req">*</span>
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Difficulty Level <span className="req">*</span>
              </label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              >
                <option value="Easy">Easy (Beginner friendly)</option>
                <option value="Medium">Medium (Everyday cooking)</option>
                <option value="Hard">Hard (Advanced gourmet)</option>
              </select>
            </div>
          </div>

          <div className="form-checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isVegetarian || category === 'Vegetarian'}
                onChange={(e) => setIsVegetarian(e.target.checked)}
              />
              <span>Mark this recipe as 100% Vegetarian 🌱</span>
            </label>
          </div>
        </div>

        {/* Section 2: Recipe Photo Upload */}
        <div className="form-section">
          <div className="section-title-row">
            <h3 className="section-title-sm">2. Recipe Photography</h3>
            <div className="upload-toggle-btns">
              <button
                type="button"
                className={`toggle-mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
                onClick={() => setUploadMode('file')}
              >
                Upload File (Multer)
              </button>
              <button
                type="button"
                className={`toggle-mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
                onClick={() => setUploadMode('url')}
              >
                Image URL Link
              </button>
            </div>
          </div>

          {uploadMode === 'file' ? (
            <div className="image-dropzone">
              <input
                type="file"
                id="recipe-image-input"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="file-hidden-input"
              />
              <label htmlFor="recipe-image-input" className="dropzone-label">
                {imagePreview ? (
                  <div className="preview-container">
                    <img src={imagePreview} alt="Recipe Preview" className="uploaded-preview-img" />
                    <span className="change-img-text">Click to choose a different photo</span>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <Upload size={36} className="dropzone-icon" />
                    <p className="dropzone-main-text">Click to browse or drop food picture here</p>
                    <p className="dropzone-sub-text">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Image Web URL (HTTPS)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
              />
              {imageUrl && (
                <div className="preview-container" style={{ marginTop: 14 }}>
                  <img src={imageUrl} alt="Preview from URL" className="uploaded-preview-img" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Timings & Servings */}
        <div className="form-section">
          <h3 className="section-title-sm">3. Timings & Servings</h3>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Prep Time (mins)</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={preparationTime}
                onChange={(e) => setPreparationTime(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cooking Time (mins)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={cookingTime}
                onChange={(e) => setCookingTime(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Servings (People)</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="total-time-badge">
            <Clock size={16} />
            <span>Total Cooking Time: <strong>{totalTime} minutes</strong></span>
          </div>
        </div>

        {/* Section 4: Ingredients List (Dynamic) */}
        <div className="form-section">
          <div className="section-title-row">
            <h3 className="section-title-sm">4. Ingredients</h3>
            <span className="badge badge-orange">{ingredients.filter((i) => i.trim()).length} Added</span>
          </div>
          <p className="section-help-text">
            List each ingredient with quantity (e.g. "2 cups Basmati Rice", "1 tsp Turmeric Powder", "250g Paneer"):
          </p>

          <div className="dynamic-list">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="dynamic-row">
                <span className="row-number-bullet">•</span>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Ingredient ${idx + 1}`}
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  required={idx === 0}
                />
                <button
                  type="button"
                  onClick={() => removeIngredientField(idx)}
                  className="remove-row-btn"
                  title="Remove ingredient"
                  disabled={ingredients.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addIngredientField}
            className="btn btn-secondary btn-sm add-row-btn"
          >
            <Plus size={16} />
            <span>Add Another Ingredient</span>
          </button>
        </div>

        {/* Section 5: Step-by-Step Instructions (Dynamic) */}
        <div className="form-section">
          <div className="section-title-row">
            <h3 className="section-title-sm">5. Step-by-Step Instructions</h3>
            <span className="badge badge-brown">{instructions.filter((s) => s.trim()).length} Steps</span>
          </div>
          <p className="section-help-text">
            Describe the preparation and cooking method step by step in clear, sequential instructions:
          </p>

          <div className="dynamic-list">
            {instructions.map((step, idx) => (
              <div key={idx} className="dynamic-row step-row">
                <span className="step-number-badge">{idx + 1}</span>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder={`Step ${idx + 1}: e.g. Heat ghee in a deep pan and sauté whole spices until fragrant...`}
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  required={idx === 0}
                />
                <button
                  type="button"
                  onClick={() => removeInstructionField(idx)}
                  className="remove-row-btn"
                  title="Remove step"
                  disabled={instructions.length <= 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addInstructionField}
            className="btn btn-secondary btn-sm add-row-btn"
          >
            <Plus size={16} />
            <span>Add Another Instruction Step</span>
          </button>
        </div>

        {/* Submit Actions */}
        <div className="form-submit-bar">
          <button
            type="submit"
            className="btn btn-primary btn-lg publish-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-sm"></div>
                <span>Saving to MongoDB Atlas...</span>
              </>
            ) : (
              <>
                <ChefHat size={20} />
                <span>Publish Recipe</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipePage;
