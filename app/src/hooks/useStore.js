import { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch { /* ignore */ }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export function useCart() {
  const [cart, setCart] = useLocalStorage('petcare-cart', []);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [setCart]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, [setCart]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  }, [setCart, removeFromCart]);

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice };
}

export function useBookings() {
  const [bookings, setBookings] = useLocalStorage('petcare-bookings', []);

  const addBooking = useCallback((booking) => {
    setBookings(prev => [...prev, { ...booking, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
  }, [setBookings]);

  const removeBooking = useCallback((bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  }, [setBookings]);

  return { bookings, addBooking, removeBooking };
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('petcare-favorites', []);

  const toggleFavorite = useCallback((itemId) => {
    setFavorites(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  }, [setFavorites]);

  const isFavorite = useCallback((itemId) => favorites.includes(itemId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
