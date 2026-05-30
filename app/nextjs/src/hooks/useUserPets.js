'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from './useReduxStore';
import { defaultPets } from '@/data/products';

export function useUserPets() {
  const { user } = useAuthStore();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPets(defaultPets);
      setIsLoading(false);
      return;
    }

    const fetchPets = async () => {
      try {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id);
        if (error) throw error;
        setPets(data && data.length > 0 ? data : defaultPets);
      } catch (err) {
        console.error('Error fetching pets:', err.message);
        setPets(defaultPets);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [user]);

  return { pets, isLoading };
}
