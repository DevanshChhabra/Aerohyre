import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function FilterDropdown() {
  const { dispatch } = useTaskContext();
  const [filter, setFilter] = useState('all');

  const debouncedFilter = useDebounce(filter, 300);

  useEffect(() => {
    dispatch({ type: 'SET_FILTER', payload: debouncedFilter });
  }, [debouncedFilter, dispatch]);

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <select onChange={handleChange} value={filter}>
      <option value="all">All Priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  );
}
