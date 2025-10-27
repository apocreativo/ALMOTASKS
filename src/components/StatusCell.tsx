import React, { useState, useRef, useEffect } from 'react';
import { Status } from '../types';
import { STATUS_COLORS } from '../constants';

interface StatusCellProps {
  value: Status | undefined;
  onChange: (newStatus: Status | null) => void;
}

const StatusCell: React.FC<StatusCellProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (status: Status | null) => {
    onChange(status);
    setIsOpen(false);
  };
  
  const bgColor = value ? STATUS_COLORS[value] : 'bg-gray-300';
  const displayText = value || 'Set Status';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-1.5 px-3 text-white text-sm font-semibold rounded-md flex items-center justify-center transition-all duration-200 hover:brightness-110 ${bgColor}`}
      >
        {displayText}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-[--card-bg] rounded-md shadow-lg border border-[--border-color]">
          {Object.values(Status).map(status => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className={`w-full text-left px-3 py-2 text-sm text-[--primary-text] hover:bg-[--hover-bg] flex items-center gap-2`}
            >
              <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`}></span>
              {/* FIX: Removed `|| 'Clear'` as it was a bug; status from enum is never falsy. */}
              {status}
            </button>
          ))}
          <button
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-3 py-2 text-sm text-[--primary-text] hover:bg-[--hover-bg] flex items-center gap-2`}
            >
              <span className={`w-3 h-3 rounded-full bg-gray-400`}></span>
              Clear
            </button>
        </div>
      )}
    </div>
  );
};

export default StatusCell;