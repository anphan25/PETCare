/**
 * Redux-backed hooks — same API as before but import paths updated for Next.js.
 */
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

// ── Auth ─────────────────────────────────────────────────────────────────────
import { setUser, setProfile, setLoading, logout, selectUser, selectProfile, selectIsLoading } from '@/store/slices/authSlice';

export function useAuthStore() {
  const dispatch = useDispatch();
  return {
    user: useSelector(selectUser),
    profile: useSelector(selectProfile),
    isLoading: useSelector(selectIsLoading),
    setUser: useCallback((val) => dispatch(setUser(val)), [dispatch]),
    setProfile: useCallback((val) => dispatch(setProfile(val)), [dispatch]),
    setLoading: useCallback((val) => dispatch(setLoading(val)), [dispatch]),
    logout: useCallback(() => dispatch(logout()), [dispatch]),
  };
}

// ── Cart ──────────────────────────────────────────────────────────────────────
import { addToCart as addToCartAction, removeFromCart as removeAction, updateQuantity as updateQtyAction, clearCart as clearCartAction, selectCart, selectTotalItems, selectTotalPrice } from '@/store/slices/cartSlice';

export function useCart() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  return {
    cart,
    totalItems,
    totalPrice,
    addToCart: useCallback((product) => dispatch(addToCartAction(product)), [dispatch]),
    removeFromCart: useCallback((productId) => dispatch(removeAction(productId)), [dispatch]),
    updateQuantity: useCallback((productId, quantity) => dispatch(updateQtyAction({ productId, quantity })), [dispatch]),
    clearCart: useCallback(() => dispatch(clearCartAction()), [dispatch]),
  };
}

// ── Bookings ──────────────────────────────────────────────────────────────────
import { addBooking as addBookingAction, removeBooking as removeBookingAction, selectBookings } from '@/store/slices/bookingsSlice';

export function useBookings() {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  return {
    bookings,
    addBooking: useCallback((booking) => dispatch(addBookingAction(booking)), [dispatch]),
    removeBooking: useCallback((bookingId) => dispatch(removeBookingAction(bookingId)), [dispatch]),
  };
}

// ── Favorites ─────────────────────────────────────────────────────────────────
import { toggleFavorite as toggleFavAction, selectFavorites } from '@/store/slices/favoritesSlice';

export function useFavorites() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  return {
    favorites,
    toggleFavorite: useCallback((itemId) => dispatch(toggleFavAction(itemId)), [dispatch]),
    isFavorite: useCallback((itemId) => favorites.includes(itemId), [favorites]),
  };
}

// ── Wishlist ──────────────────────────────────────────────────────────────────
import { fetchWishlist as fetchWishlistThunk, toggleWishlistItem, clearWishlist as clearWishlistAction, selectWishlistIds, selectWishlistLoading } from '@/store/slices/wishlistSlice';

export function useWishlistStore() {
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectWishlistIds);
  const isLoading = useSelector(selectWishlistLoading);
  const wishlistIdsSet = new Set(wishlistIds);
  return {
    wishlistIds: wishlistIdsSet,
    isLoading,
    fetchWishlist: useCallback((userId) => dispatch(fetchWishlistThunk(userId)), [dispatch]),
    toggleWishlist: useCallback(
      (userId, productId) => {
        const isWishlisted = wishlistIds.includes(productId);
        dispatch(toggleWishlistItem({ userId, productId, isWishlisted }));
      },
      [dispatch, wishlistIds]
    ),
    clearWishlist: useCallback(() => dispatch(clearWishlistAction()), [dispatch]),
  };
}

// ── Mascot ────────────────────────────────────────────────────────────────────
import { setWagging as setWaggingAction, triggerJump as triggerJumpThunk, selectIsWagging, selectIsJumping } from '@/store/slices/mascotSlice';

export function useMascotStore() {
  const dispatch = useDispatch();
  return {
    isWagging: useSelector(selectIsWagging),
    isJumping: useSelector(selectIsJumping),
    setWagging: useCallback((val) => dispatch(setWaggingAction(val)), [dispatch]),
    triggerJump: useCallback(() => dispatch(triggerJumpThunk()), [dispatch]),
  };
}
