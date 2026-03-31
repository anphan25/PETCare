import { create } from 'zustand';
import { supabase } from '../supabaseClient';

interface WishlistState {
  wishlistIds: Set<string>;
  isLoading: boolean;
  fetchWishlist: (userId: string) => Promise<void>;
  toggleWishlist: (userId: string, productId: string) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: new Set(),
  isLoading: false,

  fetchWishlist: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', userId);
      if (error) throw error;
      set({ wishlistIds: new Set(data.map((r: { product_id: string }) => r.product_id)) });
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (userId: string, productId: string) => {
    const current = get().wishlistIds;
    const isWishlisted = current.has(productId);

    // Optimistic update
    const next = new Set(current);
    if (isWishlisted) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    set({ wishlistIds: next });

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
    } catch (err) {
      // Rollback on failure
      console.error('Error toggling wishlist:', err);
      set({ wishlistIds: current });
    }
  },

  clearWishlist: () => set({ wishlistIds: new Set() }),
}));
