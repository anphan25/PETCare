import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import bookingsReducer from './slices/bookingsSlice';
import favoritesReducer from './slices/favoritesSlice';
import wishlistReducer from './slices/wishlistSlice';
import mascotReducer from './slices/mascotSlice';

// Middleware to persist certain slices to localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();

  // Persist cart
  if (action.type.startsWith('cart/')) {
    try {
      window.localStorage.setItem('petcare-cart', JSON.stringify(state.cart.items));
    } catch { /* ignore */ }
  }

  // Persist bookings
  if (action.type.startsWith('bookings/')) {
    try {
      window.localStorage.setItem('petcare-bookings', JSON.stringify(state.bookings.items));
    } catch { /* ignore */ }
  }

  // Persist favorites
  if (action.type.startsWith('favorites/')) {
    try {
      window.localStorage.setItem('petcare-favorites', JSON.stringify(state.favorites.items));
    } catch { /* ignore */ }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    bookings: bookingsReducer,
    favorites: favoritesReducer,
    wishlist: wishlistReducer,
    mascot: mascotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in auth (Supabase user objects)
        ignoredPaths: ['auth.user'],
        ignoredActions: ['auth/setUser'],
      },
    }).concat(localStorageMiddleware),
});

export default store;
