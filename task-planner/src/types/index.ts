export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  category: TaskCategory;
}

export type TaskCategory = 'To Do' | 'In Progress' | 'Review' | 'Completed';
export type TimeFilter = 'all' | '1week' | '2weeks' | '3weeks';