import { format, isToday, isYesterday } from 'date-fns';

interface DateDividerProps {
  date: string;
}

const DateDivider = ({ date }: DateDividerProps) => {
  const messageDate = new Date(date);
  
  let displayDate = '';
  
  if (isToday(messageDate)) {
    displayDate = 'Today';
  } else if (isYesterday(messageDate)) {
    displayDate = 'Yesterday';
  } else {
    displayDate = format(messageDate, 'MMMM d, yyyy');
  }
  
  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
        {displayDate}
      </div>
    </div>
  );
};

export default DateDivider;
