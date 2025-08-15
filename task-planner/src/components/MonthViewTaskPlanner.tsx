import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Search, X, Calendar, Filter } from 'lucide-react';
import './MonthViewTaskPlanner.css';

// Types
interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  category: TaskCategory;
}

type TaskCategory = 'To Do' | 'In Progress' | 'Review' | 'Completed';
type TimeFilter = 'all' | '1week' | '2weeks' | '3weeks';

// Date utility functions
const formatDate = (date: Date, format: string) => {
  const longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  if (format === 'd') return date.getDate().toString();
  if (format === 'MMMM yyyy') return `${longMonths[date.getMonth()]} ${date.getFullYear()}`;
  return date.toDateString();
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const eachDayOfInterval = ({ start, end }: { start: Date; end: Date }) => {
  const days = [];
  const current = new Date(start);
  
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isWithinInterval = (date: Date, { start, end }: { start: Date; end: Date }) => {
  return date >= start && date <= end;
};

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const getCategoryColor = (category: TaskCategory) => {
  const colors = {
    'To Do': 'task-todo',
    'In Progress': 'task-progress', 
    'Review': 'task-review',
    'Completed': 'task-completed'
  };
  return colors[category];
};

const getDaysBetween = (start: Date, end: Date) => {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

// Task Modal Component
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category: TaskCategory) => void;
  initialName?: string;
  initialCategory?: TaskCategory;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialName = '', initialCategory = 'To Do' }) => {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState<TaskCategory>(initialCategory);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setCategory(initialCategory);
    }
  }, [isOpen, initialName, initialCategory]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name.trim(), category);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Task Details</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter task name"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="form-select"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-cancel"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Save Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Filter Panel Component
interface FilterPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilters: TaskCategory[];
  onCategoryFilterChange: (categories: TaskCategory[]) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilters,
  onCategoryFilterChange,
  timeFilter,
  onTimeFilterChange,
}) => {
  const categories: TaskCategory[] = ['To Do', 'In Progress', 'Review', 'Completed'];

  const handleCategoryChange = (category: TaskCategory, checked: boolean) => {
    if (checked) {
      onCategoryFilterChange([...categoryFilters, category]);
    } else {
      onCategoryFilterChange(categoryFilters.filter(c => c !== category));
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <Filter size={20} />
        <h3>Filters</h3>
      </div>
      
      {/* Search */}
      <div className="filter-section">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="filter-section">
        <h4>Categories</h4>
        <div className="category-filters">
          {categories.map(category => (
            <label key={category} className="checkbox-label">
              <input
                type="checkbox"
                checked={categoryFilters.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="checkbox-input"
              />
              <span className={`category-dot ${getCategoryColor(category)}`}></span>
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Time Filters */}
      <div className="filter-section">
        <h4>Time Range</h4>
        <div className="time-filters">
          {[
            { value: 'all', label: 'All tasks' },
            { value: '1week', label: 'Tasks within 1 week' },
            { value: '2weeks', label: 'Tasks within 2 weeks' },
            { value: '3weeks', label: 'Tasks within 3 weeks' }
          ].map(({ value, label }) => (
            <label key={value} className="radio-label">
              <input
                type="radio"
                name="timeFilter"
                value={value}
                checked={timeFilter === value}
                onChange={(e) => onTimeFilterChange(e.target.value as TimeFilter)}
                className="radio-input"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Calendar Day Component
interface CalendarDayProps {
  date: Date;
  tasks: Task[];
  onDayMouseDown: (date: Date) => void;
  onDayMouseEnter: (date: Date) => void;
  onDayMouseUp: () => void;
  onTaskMouseDown: (task: Task, e: React.MouseEvent) => void;
  onTaskResizeStart: (task: Task, edge: 'start' | 'end', e: React.MouseEvent) => void;
  isSelecting: boolean;
  isInSelection: boolean;
  isToday: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  tasks,
  onDayMouseDown,
  onDayMouseEnter,
  onDayMouseUp,
  onTaskMouseDown,
  onTaskResizeStart,
  isInSelection,
  isToday
}) => {
  return (
    <div
      className={`calendar-day ${isInSelection ? 'day-selected' : ''} ${isToday ? 'day-today' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        onDayMouseDown(date);
      }}
      onMouseEnter={() => onDayMouseEnter(date)}
      onMouseUp={onDayMouseUp}
    >
      <div className="day-number">
        {formatDate(date, 'd')}
      </div>
      
      <div className="tasks-container">
        {tasks.map(task => {
          const isFirstDay = isSameDay(task.startDate, date);
          const isLastDay = isSameDay(task.endDate, date);
          const taskDays = getDaysBetween(task.startDate, task.endDate);
          
          return (
            <div
              key={task.id}
              className={`task-item ${getCategoryColor(task.category)} ${isFirstDay ? 'task-first' : ''} ${isLastDay ? 'task-last' : ''}`}
              onMouseDown={(e) => {
                e.stopPropagation();
                onTaskMouseDown(task, e);
              }}
              title={`${task.name} (${taskDays} day${taskDays > 1 ? 's' : ''})`}
            >
              {isFirstDay && (
                <div
                  className="resize-handle resize-start"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onTaskResizeStart(task, 'start', e);
                  }}
                />
              )}
              
              <div className="task-content">
                {isFirstDay ? task.name : ''}
                {taskDays > 1 && isFirstDay && (
                  <span className="task-duration">({taskDays}d)</span>
                )}
              </div>
              
              {isLastDay && (
                <div
                  className="resize-handle resize-end"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onTaskResizeStart(task, 'end', e);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Calendar Component
const MonthViewTaskPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: generateId(),
      name: "Project Planning",
      startDate: new Date(2025, 7, 18),
      endDate: new Date(2025, 7, 20),
      category: 'In Progress'
    },
    {
      id: generateId(),
      name: "Code Review",
      startDate: new Date(2025, 7, 22),
      endDate: new Date(2025, 7, 22),
      category: 'Review'
    }
  ]);
  const [currentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  
  // Drag state
  const [dragState, setDragState] = useState<{
    task: Task | null;
    mode: 'move' | 'resize-start' | 'resize-end' | null;
    startDate?: Date;
  }>({
    task: null,
    mode: null
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<TaskCategory[]>(['To Do', 'In Progress', 'Review', 'Completed']);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Get calendar days for current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get first day of week for the month (including previous month days)
  const firstDayOfWeek = new Date(monthStart);
  firstDayOfWeek.setDate(monthStart.getDate() - monthStart.getDay());
  
  // Get last day of week for the month (including next month days)
  const lastDayOfWeek = new Date(monthEnd);
  lastDayOfWeek.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({ start: firstDayOfWeek, end: lastDayOfWeek });

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (!categoryFilters.includes(task.category)) {
        return false;
      }

      // Time filter
      if (timeFilter !== 'all') {
        const today = startOfDay(new Date());
        const weeks = parseInt(timeFilter.replace('week', '').replace('s', ''));
        const endDate = addDays(today, weeks * 7);
        
        if (!isWithinInterval(task.startDate, { start: today, end: endDate })) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, searchTerm, categoryFilters, timeFilter]);

  // Get tasks for specific day
  const getTasksForDay = useCallback((date: Date) => {
    return filteredTasks.filter(task => 
      isWithinInterval(date, { start: task.startDate, end: task.endDate })
    );
  }, [filteredTasks]);

  // Handle day selection start
  const handleDayMouseDown = useCallback((date: Date) => {
    if (dragState.task) return;
    
    setIsSelecting(true);
    setSelectionStart(date);
    setSelectionEnd(date);
    setSelectedDays([date]);
  }, [dragState.task]);

  // Handle day selection extend
  const handleDayMouseEnter = useCallback((date: Date) => {
    if (!isSelecting || !selectionStart) return;

    const start = selectionStart < date ? selectionStart : date;
    const end = selectionStart < date ? date : selectionStart;
    
    setSelectionEnd(date);
    const days = eachDayOfInterval({ start, end });
    setSelectedDays(days);
  }, [isSelecting, selectionStart]);

  // Handle selection end
  const handleDayMouseUp = useCallback(() => {
    if (isSelecting && selectedDays.length > 0) {
      setIsModalOpen(true);
    }
    setIsSelecting(false);
  }, [isSelecting, selectedDays]);

  // Handle task creation
  const handleTaskCreate = useCallback((name: string, category: TaskCategory) => {
    if (selectedDays.length === 0) return;

    const sortedDays = [...selectedDays].sort((a, b) => a.getTime() - b.getTime());
    const newTask: Task = {
      id: generateId(),
      name,
      category,
      startDate: sortedDays[0],
      endDate: sortedDays[sortedDays.length - 1]
    };

    setTasks(prev => [...prev, newTask]);
    setSelectedDays([]);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [selectedDays]);

  // Handle task drag start
  const handleTaskMouseDown = useCallback((task: Task, e: React.MouseEvent) => {
    e.preventDefault();
    setDragState({
      task,
      mode: 'move',
      startDate: task.startDate
    });
  }, []);

  // Handle task resize start
  const handleTaskResizeStart = useCallback((task: Task, edge: 'start' | 'end', e: React.MouseEvent) => {
    e.preventDefault();
    setDragState({
      task,
      mode: edge === 'start' ? 'resize-start' : 'resize-end',
      startDate: task.startDate
    });
  }, []);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.task || !dragState.mode) return;

    const target = e.target as HTMLElement;
    const dayElement = target.closest('[data-date]');
    if (!dayElement) return;

    const dateStr = dayElement.getAttribute('data-date');
    if (!dateStr) return;

    const targetDate = new Date(dateStr);
    const { task, mode } = dragState;

    if (mode === 'move') {
      const taskDuration = getDaysBetween(task.startDate, task.endDate) - 1;
      const newStartDate = targetDate;
      const newEndDate = addDays(newStartDate, taskDuration);

      setTasks(prev => prev.map(t => 
        t.id === task.id 
          ? { ...t, startDate: newStartDate, endDate: newEndDate }
          : t
      ));
    } else if (mode === 'resize-start') {
      const newStartDate = targetDate;
      if (newStartDate <= task.endDate) {
        setTasks(prev => prev.map(t => 
          t.id === task.id 
            ? { ...t, startDate: newStartDate }
            : t
        ));
      }
    } else if (mode === 'resize-end') {
      const newEndDate = targetDate;
      if (newEndDate >= task.startDate) {
        setTasks(prev => prev.map(t => 
          t.id === task.id 
            ? { ...t, endDate: newEndDate }
            : t
        ));
      }
    }
  }, [dragState]);

  // Handle mouse up for dragging
  const handleMouseUp = useCallback(() => {
    setDragState({ task: null, mode: null });
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (dragState.task) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMouseMove(e as any);
      };
      
      const handleGlobalMouseUp = () => {
        handleMouseUp();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState.task, handleMouseMove, handleMouseUp]);

  return (
    <div className="task-planner">
      <div className="planner-layout">
        {/* Filter Panel */}
        <div className="sidebar">
          <FilterPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilters={categoryFilters}
            onCategoryFilterChange={setCategoryFilters}
            timeFilter={timeFilter}
            onTimeFilterChange={setTimeFilter}
          />
        </div>

        {/* Calendar */}
        <div className="main-content">
          <div className="calendar-container">
            <div className="calendar-header">
              <Calendar size={24} className="calendar-icon" />
              <h1>{formatDate(currentDate, 'MMMM yyyy')}</h1>
            </div>

            {/* Days of week header */}
            <div className="weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div 
              className="calendar-grid"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {calendarDays.map(date => {
                const isInSelection = selectedDays.some(d => isSameDay(d, date));
                const isToday = isSameDay(date, new Date());
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const dayTasks = getTasksForDay(date);

                return (
                  <div 
                    key={date.toISOString()} 
                    data-date={date.toISOString()}
                    className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''}`}
                  >
                    <CalendarDay
                      date={date}
                      tasks={dayTasks}
                      onDayMouseDown={handleDayMouseDown}
                      onDayMouseEnter={handleDayMouseEnter}
                      onDayMouseUp={handleDayMouseUp}
                      onTaskMouseDown={handleTaskMouseDown}
                      onTaskResizeStart={handleTaskResizeStart}
                      isSelecting={isSelecting}
                      isInSelection={isInSelection}
                      isToday={isToday}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDays([]);
          setSelectionStart(null);
          setSelectionEnd(null);
        }}
        onSave={handleTaskCreate}
      />
    </div>
  );
};

export default MonthViewTaskPlanner;