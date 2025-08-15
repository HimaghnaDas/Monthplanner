export const formatDate = (date: Date, format: string) => {
  const longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  if (format === 'd') return date.getDate().toString();
  if (format === 'MMMM yyyy') return `${longMonths[date.getMonth()]} ${date.getFullYear()}`;
  return date.toDateString();
};

export const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const eachDayOfInterval = ({ start, end }: { start: Date; end: Date }) => {
  const days = [];
  const current = new Date(start);
  
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
};

export const isSameDay = (date1: Date, date2: Date) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isWithinInterval = (date: Date, { start, end }: { start: Date; end: Date }) => {
  return date >= start && date <= end;
};

export const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};