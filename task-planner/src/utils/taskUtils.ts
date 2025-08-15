import type { TaskCategory } from '../types/index';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getCategoryColor = (category: TaskCategory) => {
  const colors = {
    'To Do': 'bg-blue-500',
    'In Progress': 'bg-yellow-500', 
    'Review': 'bg-orange-500',
    'Completed': 'bg-green-500'
  };
  return colors[category];
};

export const getDaysBetween = (start: Date, end: Date) => {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};