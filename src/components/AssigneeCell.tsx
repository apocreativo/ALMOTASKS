import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { UserCircleIcon, PlusIcon } from './icons';

interface AssigneeCellProps {
  value: User | undefined;
  allUsers: User[];
  onChange: (newUser: User | null) => void;
}

const AssigneeCell: React.FC<AssigneeCellProps> = ({ value, allUsers, onChange }) => {
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

  const handleSelect = (user: User | null) => {
    onChange(user);
    setIsOpen(false);
  };
  
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-1.5 px-3 bg-transparent rounded-md flex items-center justify-center transition-all duration-200 group-hover:bg-black/10 dark:group-hover:bg-white/10 min-h-[36px]"
      >
        {value ? (
            <div className="flex items-center gap-2">
                <img src={value.avatarUrl} alt={value.name} className="w-5 h-5 rounded-full" />
                <span className="text-sm text-[--secondary-text] group-hover:text-[--primary-text] truncate">{value.name}</span>
            </div>
        ) : (
            <div className="flex items-center justify-center text-[--secondary-text] group-hover:text-[--primary-text]">
                 <PlusIcon className="w-4 h-4" />
            </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-[--card-bg] rounded-md shadow-lg border border-[--border-color] max-h-60 overflow-y-auto custom-scrollbar">
          {allUsers.map(user => (
            <button
              key={user.id}
              onClick={() => handleSelect(user)}
              className="w-full text-left px-3 py-2 text-sm text-[--primary-text] hover:bg-[--hover-bg] flex items-center gap-2"
            >
              <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
              {user.name}
            </button>
          ))}
           <button
              onClick={() => handleSelect(null)}
              className="w-full text-left px-3 py-2 text-sm text-[--secondary-text] hover:bg-[--hover-bg] flex items-center gap-2"
            >
              <UserCircleIcon className="w-6 h-6 text-gray-400" />
              Unassign
            </button>
        </div>
      )}
    </div>
  );
};

export default AssigneeCell;