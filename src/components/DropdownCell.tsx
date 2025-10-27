import React, { useState, useRef, useEffect } from 'react';
import { Column, DropdownOption } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface DropdownCellProps {
  value: DropdownOption | undefined;
  column: Column;
  onValueChange: (newOption: DropdownOption | null) => void;
  onColumnUpdate: (updatedColumn: Column) => void;
}

const COLORS = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'];

const DropdownCell: React.FC<DropdownCellProps> = ({ value, column, onValueChange, onColumnUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption | null) => {
    onValueChange(option);
    setIsOpen(false);
  };

  const handleAddOption = () => {
      if(!newOptionLabel.trim()) return;
      const newOption: DropdownOption = {
          id: `opt-${Date.now()}`,
          label: newOptionLabel.trim(),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
      const updatedColumn = { ...column, options: [...(column.options || []), newOption] };
      onColumnUpdate(updatedColumn);
      setNewOptionLabel('');
      setIsAdding(false);
  }

  const handleDeleteOption = (optionId: string) => {
    const updatedOptions = column.options?.filter(opt => opt.id !== optionId);
    const updatedColumn = { ...column, options: updatedOptions };
    onColumnUpdate(updatedColumn);
    // If the deleted option was the selected one, clear the value
    if(value?.id === optionId) {
        onValueChange(null);
    }
  }
  
  const bgColor = value ? value.color : 'bg-transparent';
  const displayText = value ? value.label : 'Select...';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-1.5 px-3 text-sm font-medium rounded-md flex items-center justify-center transition-all duration-200 group-hover:bg-black/10 dark:group-hover:bg-white/10 ${value ? 'text-white' : 'text-[--secondary-text]' } ${bgColor}`}
      >
        {displayText}
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-[--card-bg] rounded-md shadow-lg border border-[--border-color]">
          {column.options?.map(option => (
            <div key={option.id} className="flex items-center group/option">
                <button
                    onClick={() => handleSelect(option)}
                    className="flex-1 w-full text-left px-3 py-2 text-sm text-[--primary-text] hover:bg-[--hover-bg] flex items-center gap-2"
                >
                    <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                    {option.label}
                </button>
                <button onClick={() => handleDeleteOption(option.id)} className="p-1 mr-1 text-[--secondary-text] hover:text-red-500 opacity-0 group-hover/option:opacity-100">
                    <TrashIcon className="w-3 h-3"/>
                </button>
            </div>
          ))}
          {isAdding ? (
              <div className="p-2">
                  <input
                    type="text"
                    value={newOptionLabel}
                    onChange={e => setNewOptionLabel(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddOption()}
                    placeholder="New option name"
                    autoFocus
                    className="w-full bg-[--input-bg] text-[--primary-text] px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[--accent-color]"
                   />
              </div>
          ) : (
             <button onClick={() => setIsAdding(true)} className="w-full text-left px-3 py-2 text-sm text-[--secondary-text] hover:bg-[--hover-bg] flex items-center gap-2">
                <PlusIcon className="w-4 h-4"/> Add Option
             </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownCell;