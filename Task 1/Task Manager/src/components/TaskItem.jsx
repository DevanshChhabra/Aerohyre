import React from 'react';
import './TaskItem.css';

export default function TaskItem({ task }) {
  const now = new Date();
  const deadline = new Date(task.deadline);
  const isOverdue = deadline.getTime() < now.getTime();

  return (
    <div className={`task-item ${isOverdue ? 'overdue' : ''}`}>
      <h3>{task.title}</h3>
      <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
      <p>Priority: {task.priority}</p>
    </div>
  );
}
