import { useCallback, useState } from 'react';

function getStoredValue(key, fallbackValue) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export default function useLocalStorage(key, fallbackValue) {
  const [value, setValue] = useState(function getInitialValue() {
    return getStoredValue(key, fallbackValue);
  });

  const setStoredValue = useCallback(
    function setStoredValue(nextValue) {
      setValue(function updateValue(currentValue) {
        const resolvedValue =
          typeof nextValue === 'function' ? nextValue(currentValue) : nextValue;

        try {
          window.localStorage.setItem(key, JSON.stringify(resolvedValue));
        } catch {
          // Storage can be unavailable in private browsing or restricted environments.
        }

        return resolvedValue;
      });
    },
    [key],
  );

  return [value, setStoredValue];
}
