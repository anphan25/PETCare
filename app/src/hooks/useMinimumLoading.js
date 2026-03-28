import { useState, useEffect } from 'react';

/**
 * Hook to ensure the loading screen displays for a minimum duration.
 * @param {boolean} isApiLoading - Actual loading state from API
 * @param {number} minDelay - Minimum duration (milliseconds), defaults to 1500ms
 * @returns {boolean} - Final loading state for UI rendering
 */
export function useMinimumLoading(isApiLoading, minDelay = 1500) {
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);

  useEffect(() => {
    // Start countdown as soon as the component is mounted
    const timer = setTimeout(() => {
      setIsMinTimePassed(true);
    }, minDelay);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, [minDelay]);

  // Loading continues if: API is still running OR minimum time has not passed
  return isApiLoading || !isMinTimePassed;
}