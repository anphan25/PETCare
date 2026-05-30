'use client';
import ProtectedPage from '@/components/ProtectedPage';
import SpaBooking from '@/components/pages/SpaBooking';
import { useBookings } from '@/hooks/useReduxStore';

export default function SpaPage() {
  const { addBooking } = useBookings();
  return <ProtectedPage><SpaBooking onBook={addBooking} /></ProtectedPage>;
}
