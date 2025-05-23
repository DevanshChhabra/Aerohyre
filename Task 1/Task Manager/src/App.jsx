import React from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';
import FilterDropdown from './components/FilterDropdown';

export default function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <h1>Task Manager Dashboard</h1>
        <FilterDropdown />
        <TaskList />
      </div>
    </TaskProvider>
  );
}

