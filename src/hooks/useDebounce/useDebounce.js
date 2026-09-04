import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    function debounceValue() {
      const timer = window.setTimeout(function updateDebouncedValue() {
        setDebouncedValue(value);
      }, delay);

      return function clearDebounceTimer() {
        window.clearTimeout(timer);
      };
    },
    [delay, value],
  );

  return debouncedValue;
}
