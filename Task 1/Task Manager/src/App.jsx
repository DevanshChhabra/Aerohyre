import React from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';

export default function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <TaskList />
      </div>
    </TaskProvider>
  );
}

