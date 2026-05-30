'use client';
import ProtectedPage from '@/components/ProtectedPage';
import SpaBookingHistory from '@/components/pages/SpaBookingHistory';

export default function SpaBookingsPage() {
  return <ProtectedPage><SpaBookingHistory /></ProtectedPage>;
}
