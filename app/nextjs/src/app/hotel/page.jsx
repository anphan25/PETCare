'use client';
import ProtectedPage from '@/components/ProtectedPage';
import HotelBooking from '@/components/pages/HotelBooking';
import { useBookings } from '@/hooks/useReduxStore';

export default function HotelPage() {
  const { addBooking } = useBookings();
  return <ProtectedPage><HotelBooking onBook={addBooking} /></ProtectedPage>;
}
