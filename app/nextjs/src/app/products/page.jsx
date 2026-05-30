'use client';
import ProtectedPage from '@/components/ProtectedPage';
import Products from '@/components/pages/Products';
import { useCart } from '@/hooks/useReduxStore';

export default function ProductsPage() {
  const { addToCart } = useCart();
  return <ProtectedPage><Products onAddToCart={addToCart} /></ProtectedPage>;
}
