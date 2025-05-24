import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../components/TaskList';
import FilterDropdown from '../components/FilterDropdown';
import { TaskContext } from '../context/TaskContext';  
import { calculateUrgency } from '../utils/urgency';  

const mockTasks = [
  { id: 1, title: 'Submit report', deadline: '2025-05-21T23:59:59Z', priority: 'high' },
  { id: 2, title: 'Code review', deadline: '2025-05-25T12:00:00Z', priority: 'low' },
  { id: 3, title: 'Prepare slides', deadline: '2025-05-24T09:00:00Z', priority: 'medium' }
];

// Custom provider to mock context
function CustomProvider({ children, overrideState }) {
  const initialState = overrideState || {
    tasks: mockTasks,
    filteredPriority: 'all',
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

  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

test('filters tasks by priority', async () => {
  render(
    <CustomProvider>
      <FilterDropdown />
      <TaskList />
    </CustomProvider>
  );

  // All tasks initially visible
  expect(screen.getByText('Submit report')).toBeInTheDocument();
  expect(screen.getByText('Code review')).toBeInTheDocument();
  expect(screen.getByText('Prepare slides')).toBeInTheDocument();

  await userEvent.selectOptions(screen.getByRole('combobox'), 'high');

  // Only submit report (high priority) should be visible
  expect(screen.getByText('Submit report')).toBeInTheDocument();
  expect(screen.queryByText('Code review')).toBeNull();
  expect(screen.queryByText('Prepare slides')).toBeNull();
});

test('sorts tasks by urgency score (ascending)', () => {
  render(
    <CustomProvider>
      <TaskList />
    </CustomProvider>
  );


  const expectedOrder = [...mockTasks]
    .sort((a, b) => calculateUrgency(a) - calculateUrgency(b))
    .map(t => t.title);

  const renderedTitles = screen.getAllByRole('heading', { level: 3 }).map(el => el.textContent);

  expect(renderedTitles).toEqual(expectedOrder);
});

test('highlights overdue task in red', () => {
  const pastTask = {
    id: 4,
    title: 'Missed Deadline',
    deadline: '2020-01-01T00:00:00Z',
    priority: 'medium'
  };

  render(
    <CustomProvider overrideState={{ tasks: [pastTask], filteredPriority: 'all' }}>
      <TaskList />
    </CustomProvider>
  );

  const taskDiv = screen.getByText('Missed Deadline').closest('div');
  expect(taskDiv).toHaveClass('overdue');
});
