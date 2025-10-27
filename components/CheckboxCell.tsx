import React from 'react';
import { CheckCircleIcon, CircleIcon } from './icons';

interface CheckboxCellProps {
  value: boolean | undefined;
  onChange: (newValue: boolean) => void;
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({ value, onChange }) => {
  const isChecked = value || false;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <button
        onClick={() => onChange(!isChecked)}
        className="text-[--secondary-text] hover:text-[--accent-color]"
      >
        {isChecked ? (
          <CheckCircleIcon className="w-6 h-6 text-[--accent-color]" />
        ) : (
          <CircleIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default CheckboxCell;
