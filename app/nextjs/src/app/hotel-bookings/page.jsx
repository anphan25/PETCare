'use client';
import ProtectedPage from '@/components/ProtectedPage';
import HotelBookingHistory from '@/components/pages/HotelBookingHistory';

export default function HotelBookingsPage() {
  return <ProtectedPage><HotelBookingHistory /></ProtectedPage>;
}
