import { createSlice } from '@reduxjs/toolkit';

// Load favorites from localStorage
const loadFavorites = () => {
  try {
    const data = window.localStorage.getItem('petcare-favorites');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavorites(),
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const itemId = action.payload;
      const index = state.items.indexOf(itemId);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(itemId);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.items;
export const selectIsFavorite = (itemId) => (state) =>
  state.favorites.items.includes(itemId);

export default favoritesSlice.reducer;
