'use client';
import ProtectedPage from '@/components/ProtectedPage';
import Profile from '@/components/pages/Profile';

export default function ProfilePage() {
  return <ProtectedPage><Profile /></ProtectedPage>;
}
