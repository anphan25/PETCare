'use client';
import ProtectedPage from '@/components/ProtectedPage';
import OrderHistory from '@/components/pages/OrderHistory';

export default function OrdersPage() {
  return <ProtectedPage><OrderHistory /></ProtectedPage>;
}
