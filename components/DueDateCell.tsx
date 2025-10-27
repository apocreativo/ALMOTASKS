import React, { useRef } from 'react';
import { CalendarIcon } from './icons';

interface DueDateCellProps {
  value: string | undefined;
  onChange: (newDueDate: string | null) => void;
}

const DueDateCell: React.FC<DueDateCellProps> = ({ value, onChange }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value || null);
  };
  
  const displayText = value 
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '+ Add Date';

  return (
    <div 
        className="relative w-full cursor-pointer"
        onClick={handleContainerClick}
    >
      <div
        className={`w-full py-1.5 px-3 bg-transparent text-sm font-medium rounded-md flex items-center justify-center transition-all duration-200 group-hover:bg-black/10 dark:group-hover:bg-white/10`}
      >
        <CalendarIcon className="w-4 h-4 mr-2 text-[--secondary-text]" />
        <span className="text-[--secondary-text] group-hover:text-[--primary-text]">{displayText}</span>
      </div>
       <input 
        type="date"
        ref={dateInputRef}
        value={value || ''}
        onChange={handleDateChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

export default DueDateCell;