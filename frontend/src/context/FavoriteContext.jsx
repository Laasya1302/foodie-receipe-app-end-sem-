import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoriteAPI } from '../services/api';
import { useAuth } from './AuthContext';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch favourites directly from MongoDB when user is authenticated
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const res = await favoriteAPI.getFavorites();
      if (res.data && res.data.recipes) {
        setFavorites(res.data.recipes);
        const ids = new Set(res.data.recipes.map((r) => r._id));
        setFavoriteIds(ids);
      }
    } catch (err) {
      console.error('Error fetching favorites from MongoDB:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if a recipe is favorited
  const isFavorite = useCallback(
    (recipeId) => {
      if (!recipeId) return false;
      return favoriteIds.has(recipeId.toString());
    },
    [favoriteIds]
  );

  // Toggle favorite with optimistic UI update and MongoDB persistence
  const toggleFavorite = async (recipe) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true, message: 'Please login to save favorite recipes.' };
    }

    const recipeId = typeof recipe === 'object' ? recipe._id : recipe;
    const currentlyFav = isFavorite(recipeId);

    // Optimistic state update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (currentlyFav) {
        next.delete(recipeId.toString());
      } else {
        next.add(recipeId.toString());
      }
      return next;
    });

    if (currentlyFav) {
      setFavorites((prev) => prev.filter((r) => r._id.toString() !== recipeId.toString()));
    } else if (typeof recipe === 'object') {
      setFavorites((prev) => [recipe, ...prev]);
    }

    try {
      if (currentlyFav) {
        // Call MongoDB DELETE API
        await favoriteAPI.removeFavorite(recipeId);
        return { success: true, isFavorite: false, message: 'Removed from favourites' };
      } else {
        // Call MongoDB POST API
        await favoriteAPI.addFavorite(recipeId);
        // Refresh full populated list if needed
        fetchFavorites();
        return { success: true, isFavorite: true, message: 'Added to favourites!' };
      }
    } catch (err) {
      // Revert optimistic update on server error
      fetchFavorites();
      console.error('Error saving favourite to MongoDB:', err.message);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update favourite in database'
      };
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        favoriteIds,
        loading,
        isFavorite,
        toggleFavorite,
        fetchFavorites
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
export default FavoriteContext;
