const PRIORITY_WEIGHTS = { high: 3, medium: 2, low: 1 };

export function calculateUrgency(task) {
  const deadline = new Date(task.deadline);
  const now = new Date();
  const daysToDeadline = (deadline - now) / (1000 * 60 * 60 * 24);
  const clampedDays = Math.max(0, daysToDeadline); //If a task is already overdue, daysToDeadline becomes negative
  return clampedDays / PRIORITY_WEIGHTS[task.priority];
}