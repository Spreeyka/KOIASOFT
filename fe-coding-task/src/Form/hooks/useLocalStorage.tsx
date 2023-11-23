import { useState, useEffect } from "react";

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const storedValue = localStorage.getItem(key) || String(initialValue);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};

export { useLocalStorage };
