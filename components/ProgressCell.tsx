import React, { useState, useEffect } from 'react';

interface ProgressCellProps {
  value: number | undefined;
  onChange: (newValue: number) => void;
}

const ProgressCell: React.FC<ProgressCellProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(value || 0);

  useEffect(() => {
    setProgress(value || 0);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    let newProgress = parseInt(String(progress), 10);
    if (isNaN(newProgress) || newProgress < 0) newProgress = 0;
    if (newProgress > 100) newProgress = 100;
    
    setProgress(newProgress);
    if (newProgress !== value) {
      onChange(newProgress);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setProgress(value || 0);
      setIsEditing(false);
    }
  };

  const getProgressColor = (p: number) => {
    if (p < 25) return 'bg-red-500';
    if (p < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  if (isEditing) {
    return (
      <div className="flex items-center w-full">
        <input
          type="number"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-16 bg-[--input-bg] text-[--primary-text] px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
        />
        <span className="ml-1 text-sm text-[--secondary-text]">%</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="w-full py-1.5 px-2 rounded-md cursor-pointer h-[32px] flex items-center group-hover:bg-black/10 dark:group-hover:bg-white/10"
    >
      <div className="w-full bg-[--input-bg] rounded-full h-2 relative">
        <div 
          className={`h-2 rounded-full ${getProgressColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-[--secondary-text] w-8 text-right font-mono">{progress}%</span>
    </div>
  );
};

export default ProgressCell;