import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuthStore } from '../stores/useAuthStore';
import { defaultPets } from '../data/products';

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
        
        if (data && data.length > 0) {
          setPets(data);
        } else {
          // Fallback to default pets for demo if user has no pets in DB
          setPets(defaultPets);
        }
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
