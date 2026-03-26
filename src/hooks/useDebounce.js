import { useState, useEffect } from "react";

/**
 * Custom hook para hacer debounce de un valor
 * @param {any} value - El valor a hacer debounce
 * @param {number} delay - El tiempo de espera en milisegundos (default: 500ms)
 * @returns {any} - El valor con debounce aplicado
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: limpia el timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
