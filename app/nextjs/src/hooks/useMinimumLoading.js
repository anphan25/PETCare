'use client';

import { useState, useEffect } from 'react';

export function useMinimumLoading(isApiLoading, minDelay = 1500) {
  const [isMinTimePassed, setIsMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMinTimePassed(true), minDelay);
    return () => clearTimeout(timer);
  }, [minDelay]);

  return isApiLoading || !isMinTimePassed;
}
