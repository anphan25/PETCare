'use client';
import ProtectedPage from '@/components/ProtectedPage';
import Wishlist from '@/components/pages/Wishlist';
import { useCart } from '@/hooks/useReduxStore';

export default function WishlistPage() {
  const { addToCart } = useCart();
  return <ProtectedPage><Wishlist onAddToCart={addToCart} /></ProtectedPage>;
}
