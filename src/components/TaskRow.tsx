import React, { useState } from 'react';
import { Task, Column, User, ColumnType } from '../types';
import StatusCell from './StatusCell';
import PriorityCell from './PriorityCell';
import AssigneeCell from './AssigneeCell';
import DueDateCell from './DueDateCell';
import TextCell from './TextCell';
import CheckboxCell from './CheckboxCell';
import ProgressCell from './ProgressCell';
import DropdownCell from './DropdownCell';
import { CircleIcon } from './icons';

interface TaskRowProps {
  task: Task;
  columns: Column[];
  allUsers: User[];
  onUpdate: (updatedTask: Task) => void;
  onSelect: () => void;
  children?: React.ReactNode;
  onColumnUpdate: (updatedColumn: Column) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, columns, allUsers, onUpdate, onSelect, onColumnUpdate, children }) => {
    const [title, setTitle] = useState(task.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const handlePropertyChange = (columnId: string, value: any) => {
        const updatedTask = {
            ...task,
            properties: {
                ...task.properties,
                [columnId]: value,
            },
        };
        onUpdate(updatedTask);
    };

    const handleTitleBlur = () => {
        setIsEditingTitle(false);
        if(title.trim() && title.trim() !== task.title) {
            onUpdate({ ...task, title: title.trim() });
        } else {
            setTitle(task.title);
        }
    }

    const renderCell = (column: Column) => {
        const value = task.properties[column.id];
        switch(column.type as ColumnType) {
            case 'status':
                return <StatusCell value={value} onChange={(newVal) => handlePropertyChange(column.id, newVal)} />;
            case 'priority':
                return <PriorityCell value={value} onChange={(newVal) => handlePropertyChange(column.id, newVal)} />;
            case 'assignee':
                return <AssigneeCell value={value} allUsers={allUsers} onChange={(newVal) => handlePropertyChange(column.id, newVal)} />;
            case 'date':
                return <DueDateCell value={value} onChange={(newVal) => handlePropertyChange(column.id, newVal)} />;
            case 'checkbox':
                return <CheckboxCell value={value} onChange={(newVal) => handlePropertyChange(column.id, newVal)} />;
            case 'progress':
                return <ProgressCell value={value} onChange={(newVal) => handlePropertyChange(column.id, newVal)} />;
            case 'dropdown':
                return <DropdownCell value={value} column={column} onValueChange={(newVal) => handlePropertyChange(column.id, newVal)} onColumnUpdate={onColumnUpdate} />;
            case 'text':
            default:
                return <TextCell value={value} onChange={(newVal) => handlePropertyChange(column.id, newVal)} />;
        }
    }

  return (
    <tr className="border-b border-[--border-color] last:border-b-0 hover:bg-[--hover-bg] group">
      <td className="p-3 w-1/3 min-w-[300px]">
          <div className="flex items-center gap-3">
            <button className="text-[--secondary-text] hover:text-[--accent-color]">
                <CircleIcon className="w-5 h-5" />
            </button>
            {isEditingTitle ? (
                 <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={e => e.key === 'Enter' && handleTitleBlur()}
                    autoFocus
                    className="w-full text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-[--accent-color] rounded-md"
                />
            ) : (
                <span onClick={() => onSelect()} className="text-sm font-medium cursor-pointer flex-1 truncate" onDoubleClick={() => setIsEditingTitle(true)}>
                    {task.title}
                </span>
            )}
          </div>
      </td>
      {columns.map(col => (
        <td key={col.id} className="p-1.5 w-[160px]">
            {renderCell(col)}
        </td>
      ))}
      {children}
      <td className="p-1 w-[60px] text-center">
          <button onClick={() => onSelect()} className="text-xs font-semibold text-[--secondary-text] opacity-0 group-hover:opacity-100 transition-opacity bg-[--hover-bg] px-2 py-1 rounded-md">
              OPEN
          </button>
      </td>
    </tr>
  );
};

export default TaskRow;