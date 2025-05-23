import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { calculateUrgency } from '../utils/urgency';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  filteredPriority: 'all'
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_FILTER':
      return { ...state, filteredPriority: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Simulate fetching tasks
    const fetchTasks = async () => {
      const mockTasks = [
        { id: 1, title: 'Submit report', deadline: '2025-05-21T23:59:59Z', priority: 'high' },
        { id: 2, title: 'Code review', deadline: '2025-05-25T12:00:00Z', priority: 'low' },
        { id: 3, title: 'Prepare slides', deadline: '2025-05-24T09:00:00Z', priority: 'medium' },
        { id: 4, title: 'Team meeting', deadline: '2025-05-29T09:00:00', priority: 'high' },
        { id: 5, title: 'Write documentation', deadline: '2025-05-30T10:00:00', priority: 'medium' },
        { id: 6, title: 'Design review', deadline: '2025-05-31T11:30:00', priority: 'low' },
        { id: 7, title: 'Fix bugs', deadline: '2025-06-01T14:45:00', priority: 'high' },
        { id: 8, title: 'Create test cases', deadline: '2025-06-02T16:00:00', priority: 'medium' },
        { id: 9, title: 'Sync with client', deadline: '2025-06-03T10:30:00', priority: 'low' },
        { id: 10, title: 'Deploy update', deadline: '2025-06-04T17:00:00', priority: 'high' },
      ];
      dispatch({ type: 'SET_TASKS', payload: mockTasks });
    };
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}
