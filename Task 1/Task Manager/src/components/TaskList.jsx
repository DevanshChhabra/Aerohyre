import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { calculateUrgency } from '../utils/urgency';
import Pagination from './Pagination';

const TASKS_PER_PAGE = 5;

export default function TaskList() {
  const { state } = useTaskContext();
  const { tasks, filteredPriority } = state;

  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tasks.filter(
    task => filteredPriority === 'all' || task.priority === filteredPriority
  );

  const sorted = [...filtered].sort(
    (a, b) => calculateUrgency(a) - calculateUrgency(b)
  );

  const totalPages = Math.ceil(sorted.length / TASKS_PER_PAGE);
  const paginatedTasks = sorted.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  return (
    <>
      <div className="task-list">
        {paginatedTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
