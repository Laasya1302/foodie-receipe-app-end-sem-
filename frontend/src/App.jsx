import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoriteProvider } from './context/FavoriteContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// 18 Pages
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AllRecipesPage from './pages/AllRecipesPage';
import CategoriesPage from './pages/CategoriesPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import FavoriteRecipesPage from './pages/FavoriteRecipesPage';
import AddRecipePage from './pages/AddRecipePage';
import MyRecipesPage from './pages/MyRecipesPage';
import EditRecipePage from './pages/EditRecipePage';
import SearchRecipesPage from './pages/SearchRecipesPage';
import UserProfilePage from './pages/UserProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ReviewsPage from './pages/ReviewsPage';
import SettingsPage from './pages/SettingsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';

// Scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 404 Not Found Page
const NotFoundPage = () => (
  <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
    <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: 12 }}>404</h1>
    <h2 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: 16 }}>Recipe Page Not Found</h2>
    <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto 28px' }}>
      The page or recipe you are looking for may have been moved or removed from our MongoDB database.
    </p>
    <a href="/" className="btn btn-primary btn-lg">Back to FOODIE Home</a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <Router>
          <ScrollToTop />
          <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* 1. Splash / Welcome Page */}
                <Route path="/welcome" element={<SplashPage />} />
                <Route path="/splash" element={<SplashPage />} />

                {/* 2. Login Page */}
                <Route path="/login" element={<LoginPage />} />

                {/* 3. Register Page */}
                <Route path="/register" element={<RegisterPage />} />

                {/* 4. Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* 5. All Recipes Page */}
                <Route path="/recipes" element={<AllRecipesPage />} />

                {/* 6. Categories Page */}
                <Route path="/categories" element={<CategoriesPage />} />

                {/* 7. Recipe Details Page */}
                <Route path="/recipes/:id" element={<RecipeDetailsPage />} />

                {/* 8. Favourite Recipes Page (Protected) */}
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoriteRecipesPage />
                    </ProtectedRoute>
                  }
                />

                {/* 9. Add Recipe Page (Protected) */}
                <Route
                  path="/add-recipe"
                  element={
                    <ProtectedRoute>
                      <AddRecipePage />
                    </ProtectedRoute>
                  }
                />

                {/* 10. My Recipes Page (Protected) */}
                <Route
                  path="/my-recipes"
                  element={
                    <ProtectedRoute>
                      <MyRecipesPage />
                    </ProtectedRoute>
                  }
                />

                {/* 11. Edit Recipe Page (Protected) */}
                <Route
                  path="/edit-recipe/:id"
                  element={
                    <ProtectedRoute>
                      <EditRecipePage />
                    </ProtectedRoute>
                  }
                />

                {/* 12. Search Recipes Page */}
                <Route path="/search" element={<SearchRecipesPage />} />

                {/* 13. User Profile Page (Protected) */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 14. Edit Profile Page (Protected) */}
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute>
                      <EditProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 15. Reviews and Ratings Page */}
                <Route path="/reviews" element={<ReviewsPage />} />

                {/* 16. Settings Page (Protected) */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 17. About Us Page */}
                <Route path="/about" element={<AboutUsPage />} />

                {/* 18. Contact Page */}
                <Route path="/contact" element={<ContactPage />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </FavoriteProvider>
    </AuthProvider>
  );
}

export default App;
