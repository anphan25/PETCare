'use client';
import ProtectedPage from '@/components/ProtectedPage';
import Checkout from '@/components/pages/Checkout';

export default function CheckoutPage() {
  return <ProtectedPage><Checkout /></ProtectedPage>;
}
