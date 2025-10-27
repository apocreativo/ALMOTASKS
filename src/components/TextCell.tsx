import React, { useState } from 'react';

interface TextCellProps {
  value: string | undefined;
  onChange: (newValue: string) => void;
}

const TextCell: React.FC<TextCellProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value || '');

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() !== (value || '')) {
      onChange(text.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(value || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full bg-[--input-bg] text-[--primary-text] px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="w-full py-1.5 px-3 text-[--secondary-text] text-sm rounded-md cursor-pointer min-h-[32px] flex items-center group-hover:bg-black/10 dark:group-hover:bg-white/10"
    >
      {value || <span className="text-[--secondary-text]/50">-</span>}
    </div>
  );
};

export default TextCell;