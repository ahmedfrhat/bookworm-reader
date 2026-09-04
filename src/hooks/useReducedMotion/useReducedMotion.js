import { useEffect, useState } from 'react';

export default function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(function watchReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = function updatePreference() {
      setReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return function removeReducedMotionListener() {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  return reducedMotion;
}
