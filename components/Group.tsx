import React, { useState, useRef, useEffect } from 'react';
import { Group as GroupType, Column, Task, User, ColumnType } from '../types';
import TaskRow from './TaskRow';
import { PlusIcon, TrashIcon } from './icons';

interface GroupProps {
  group: GroupType;
  columns: Column[];
  allUsers: User[];
  onUpdateGroup: (updatedGroup: GroupType) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onSelectTask: (task: Task) => void;
  onAddTask: (groupId: string, title: string) => void;
  onAddColumn: (type: ColumnType, title: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  // FIX: Add onColumnUpdate prop to allow updating column definitions.
  onColumnUpdate: (updatedColumn: Column) => void;
}

// FIX: Add onColumnUpdate to props destructuring.
const Group: React.FC<GroupProps> = ({ 
    group, columns, allUsers, onUpdateGroup, onUpdateTask, onSelectTask, onAddTask, onAddColumn, onDeleteGroup, onDeleteColumn, onColumnUpdate
}) => {
  const [newTitle, setNewTitle] = useState(group.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const addColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addColumnRef.current && !addColumnRef.current.contains(event.target as Node)) {
        setIsAddingColumn(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if(newTitle.trim() && newTitle.trim() !== group.title) {
        onUpdateGroup({ ...group, title: newTitle.trim() });
    } else {
        setNewTitle(group.title);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
      e.preventDefault();
      if(newTaskTitle.trim()){
          onAddTask(group.id, newTaskTitle.trim());
          setNewTaskTitle('');
      }
  }

  const handleAddColumn = (type: ColumnType) => {
      const title = type.charAt(0).toUpperCase() + type.slice(1); // e.g., 'Progress'
      onAddColumn(type, title);
      setIsAddingColumn(false);
  }
  
  const isDeletable = (col: Column) => !['assignee', 'status', 'priority', 'date'].includes(col.type);

  return (
    <div className="bg-[--card-bg] rounded-xl border border-[--border-color] overflow-hidden">
        <div className="p-3 border-b border-[--border-color] flex justify-between items-center">
        {isEditingTitle ? (
            <input 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={e => e.key === 'Enter' && handleTitleBlur()}
                autoFocus
                className="text-lg font-semibold bg-transparent focus:outline-none focus:ring-1 focus:ring-[--accent-color] rounded-md px-1"
            />
        ) : (
            <h3 
                className="text-lg font-semibold px-1 cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
            >
                {group.title}
            </h3>
        )}
         <button onClick={() => onDeleteGroup(group.id)} className="text-[--secondary-text] hover:text-red-500 p-1 rounded-md hover:bg-[--hover-bg]">
            <TrashIcon className="w-4 h-4" />
        </button>
        </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-xs text-left text-[--secondary-text] uppercase">
              <th className="font-medium p-3 w-1/3 min-w-[300px]">Task</th>
              {columns.map(col => (
                <th key={col.id} className="font-medium p-3 w-[160px] group relative">
                  <div className="flex items-center gap-2">
                    <span>{col.title}</span>
                    {isDeletable(col) && (
                      <button onClick={() => onDeleteColumn(col.id)} className="opacity-0 group-hover:opacity-100 text-[--secondary-text] hover:text-red-500">
                        <TrashIcon className="w-3 h-3"/>
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="font-medium p-1 w-[60px] relative">
                <div ref={addColumnRef}>
                    <button onClick={() => setIsAddingColumn(!isAddingColumn)} className="mx-auto flex items-center justify-center w-6 h-6 rounded-full hover:bg-[--hover-bg]">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                    {isAddingColumn && (
                        <div className="absolute top-full right-0 mt-2 w-40 bg-[--card-bg] border border-[--border-color] rounded-lg shadow-xl z-20">
                            <button onClick={() => handleAddColumn('text')} className="w-full text-left text-sm px-3 py-2 hover:bg-[--hover-bg]">Text</button>
                            <button onClick={() => handleAddColumn('progress')} className="w-full text-left text-sm px-3 py-2 hover:bg-[--hover-bg]">Progress</button>
                            <button onClick={() => handleAddColumn('checkbox')} className="w-full text-left text-sm px-3 py-2 hover:bg-[--hover-bg]">Checkbox</button>
                            <button onClick={() => handleAddColumn('dropdown')} className="w-full text-left text-sm px-3 py-2 hover:bg-[--hover-bg]">Dropdown</button>
                        </div>
                    )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {group.tasks.map(task => (
              <TaskRow 
                  key={task.id}
                  task={task}
                  columns={columns}
                  allUsers={allUsers}
                  onUpdate={onUpdateTask}
                  onSelect={() => onSelectTask(task)}
                  // FIX: Pass onColumnUpdate down to TaskRow.
                  onColumnUpdate={onColumnUpdate}
              />
            ))}
            <tr className="border-t border-[--border-color]">
                <td className="p-2 pl-3">
                   <form onSubmit={handleAddTask} className="flex">
                      <button type="submit" className="p-1 text-[--secondary-text] hover:text-[--primary-text]">
                          <PlusIcon className="w-4 h-4"/>
                      </button>
                      <input 
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Add a task..."
                          className="bg-transparent w-full text-sm focus:outline-none placeholder:text-[--secondary-text]/60 px-2"
                      />
                   </form>
                </td>
                <td colSpan={columns.length + 1}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Group;