import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../supabaseClient';

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', userId);
      if (error) throw error;
      return data.map((r) => r.product_id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async ({ userId, productId, isWishlisted }, { rejectWithValue }) => {
    try {
      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: userId, product_id: productId });
        if (error) throw error;
      }
      return { productId, isWishlisted };
    } catch (err) {
      return rejectWithValue({ productId, isWishlisted, error: err.message });
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    ids: [],   // Array of product IDs (easier to serialize than Set)
    isLoading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.ids = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ids = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // toggleWishlistItem — optimistic update
      .addCase(toggleWishlistItem.pending, (state, action) => {
        const { productId, isWishlisted } = action.meta.arg;
        if (isWishlisted) {
          state.ids = state.ids.filter((id) => id !== productId);
        } else {
          state.ids.push(productId);
        }
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        // Rollback optimistic update
        const { productId, isWishlisted } = action.payload;
        if (isWishlisted) {
          // Was wishlisted, removal failed — add it back
          state.ids.push(productId);
        } else {
          // Was not wishlisted, add failed — remove it
          state.ids = state.ids.filter((id) => id !== productId);
        }
        state.error = action.payload.error;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistIds = (state) => state.wishlist.ids;
export const selectWishlistLoading = (state) => state.wishlist.isLoading;
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.ids.includes(productId);

export default wishlistSlice.reducer;
