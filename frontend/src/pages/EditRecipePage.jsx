import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeAPI, formatImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import {
  Plus,
  Trash2,
  Upload,
  Clock,
  ChefHat,
  ArrowLeft,
  Save,
  CheckCircle2
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

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [preparationTime, setPreparationTime] = useState(15);
  const [cookingTime, setCookingTime] = useState(25);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState('Medium');
  const [isVegetarian, setIsVegetarian] = useState(false);

  // Image handling
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState('file');

  // Dynamic Lists
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setInitialLoading(true);
        const res = await recipeAPI.getRecipeById(id);
        if (res.data && res.data.recipe) {
          const r = res.data.recipe;

          // Check if current user is owner
          if (user && r.author && r.author._id !== user._id && r.author !== user._id) {
            setToast({ message: 'You can only edit recipes that you authored.', type: 'error' });
            setTimeout(() => navigate('/recipes'), 1500);
            return;
          }

          setTitle(r.title);
          setDescription(r.description);
          setCategory(r.category);
          setPreparationTime(r.preparationTime);
          setCookingTime(r.cookingTime);
          setServings(r.servings);
          setDifficulty(r.difficulty);
          setIsVegetarian(r.isVegetarian || false);
          setCurrentImage(r.image);
          setImagePreview(formatImageUrl(r.image));
          setIngredients(r.ingredients && r.ingredients.length > 0 ? r.ingredients : ['']);
          setInstructions(r.instructions && r.instructions.length > 0 ? r.instructions : ['']);
        }
      } catch (err) {
        console.error('Error fetching recipe for editing:', err);
        setToast({ message: 'Recipe could not be loaded.', type: 'error' });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        setToast({ message: 'Only JPG, JPEG, PNG, or WEBP images are supported.', type: 'error' });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => setIngredients([...ingredients, '']);
  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstructionField = () => setInstructions([...instructions, '']);
  const removeInstructionField = (index) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredIngredients = ingredients.map((i) => i.trim()).filter(Boolean);
    const filteredInstructions = instructions.map((s) => s.trim()).filter(Boolean);

    if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      setToast({ message: 'Please provide at least one ingredient and one instruction step.', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('preparationTime', preparationTime);
      formData.append('cookingTime', cookingTime);
      formData.append('servings', servings);
      formData.append('difficulty', difficulty);
      formData.append('isVegetarian', isVegetarian || category === 'Vegetarian');
      formData.append('ingredients', JSON.stringify(filteredIngredients));
      formData.append('instructions', JSON.stringify(filteredInstructions));

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrl.trim()) {
        formData.append('imageUrl', imageUrl.trim());
      }

      await recipeAPI.updateRecipe(id, formData);
      setToast({ message: 'Recipe updated successfully in MongoDB!', type: 'success' });
      setTimeout(() => {
        navigate(`/recipes/${id}`);
      }, 1000);
    } catch (err) {
      console.error('Update error:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to update recipe in MongoDB.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="home-loading-box" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p>Loading recipe data from MongoDB...</p>
      </div>
    );
  }

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

      <div className="details-top-bar">
        <Link to={`/recipes/${id}`} className="back-link">
          <ArrowLeft size={18} /> <span>Cancel & Return to Recipe</span>
        </Link>
      </div>

      <div className="add-recipe-header">
        <h1 className="page-heading">Edit Recipe: {title}</h1>
        <p className="page-subheading">
          Modify recipe details, ingredients, cooking steps or photo. Changes are saved permanently in MongoDB.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="add-recipe-form-card card">
        {/* Section 1: Overview */}
        <div className="form-section">
          <h3 className="section-title-sm">1. Recipe Overview</h3>
          <div className="form-group">
            <label className="form-label">Recipe Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Food Category</label>
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
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
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
              <span>Vegetarian Recipe 🌱</span>
            </label>
          </div>
        </div>

        {/* Section 2: Photo */}
        <div className="form-section">
          <div className="section-title-row">
            <h3 className="section-title-sm">2. Update Photo (Optional)</h3>
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
                id="edit-recipe-image-input"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="file-hidden-input"
              />
              <label htmlFor="edit-recipe-image-input" className="dropzone-label">
                <div className="preview-container">
                  <img src={imagePreview} alt="Recipe Preview" className="uploaded-preview-img" />
                  <span className="change-img-text">Click to choose a replacement photo</span>
                </div>
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
            </div>
          )}
        </div>

        {/* Section 3: Timings */}
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
              <label className="form-label">Cook Time (mins)</label>
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
              <label className="form-label">Servings</label>
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
        </div>

        {/* Section 4: Ingredients */}
        <div className="form-section">
          <div className="section-title-row">
            <h3 className="section-title-sm">4. Ingredients</h3>
            <span className="badge badge-orange">{ingredients.length} Items</span>
          </div>

          <div className="dynamic-list">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="dynamic-row">
                <span className="row-number-bullet">•</span>
                <input
                  type="text"
                  className="form-input"
                  value={ing}
                  onChange={(e) => handleIngredientChange(idx, e.target.value)}
                  required={idx === 0}
                />
                <button
                  type="button"
                  onClick={() => removeIngredientField(idx)}
                  className="remove-row-btn"
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
            <span>Add Ingredient</span>
          </button>
        </div>

        {/* Section 5: Steps */}
        <div className="form-section">
          <div className="section-title-row">
            <h3 className="section-title-sm">5. Cooking Instructions</h3>
            <span className="badge badge-brown">{instructions.length} Steps</span>
          </div>

          <div className="dynamic-list">
            {instructions.map((step, idx) => (
              <div key={idx} className="dynamic-row step-row">
                <span className="step-number-badge">{idx + 1}</span>
                <textarea
                  className="form-textarea"
                  rows="2"
                  value={step}
                  onChange={(e) => handleInstructionChange(idx, e.target.value)}
                  required={idx === 0}
                />
                <button
                  type="button"
                  onClick={() => removeInstructionField(idx)}
                  className="remove-row-btn"
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
            <span>Add Cooking Step</span>
          </button>
        </div>

        {/* Submit */}
        <div className="form-submit-bar">
          <button
            type="submit"
            className="btn btn-primary btn-lg publish-btn"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="spinner-sm"></div>
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipePage;
