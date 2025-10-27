import React from 'react';
// FIX: Add ColumnType to imports to support creating columns of different types.
import { BoardData, Task, User, Group as GroupType, Column, ColumnType } from '../types';
import Group from './Group';
import { PlusIcon } from './icons';

interface BoardProps {
    allUsers: User[];
    boardData: BoardData;
    setBoardData: React.Dispatch<React.SetStateAction<BoardData>>;
    onSelectTask: (task: Task) => void;
    onUpdateTask: (updatedTask: Task) => void;
    // FIX: Add onColumnUpdate prop to allow updating column definitions from child components.
    onColumnUpdate: (updatedColumn: Column) => void;
}

// FIX: Add onColumnUpdate to props destructuring.
const Board: React.FC<BoardProps> = ({ allUsers, boardData, setBoardData, onSelectTask, onUpdateTask, onColumnUpdate }) => {

  const handleAddTask = (groupId: string, title: string) => {
    const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        properties: {},
    };
    setBoardData(prev => ({
        ...prev,
        // FIX: Correctly spread the tasks array `g.tasks` instead of the group object `g` and add the new task.
        groups: prev.groups.map(g => g.id === groupId ? {...g, tasks: [...g.tasks, newTask]} : g)
    }));
  }
  
  const handleAddGroup = () => {
       const newGroup: GroupType = {
           id: `group-${Date.now()}`,
           title: 'New Group',
           tasks: [],
       };
       setBoardData(prev => ({ ...prev, groups: [...prev.groups, newGroup] }));
  }

  const handleUpdateGroup = (updatedGroup: GroupType) => {
      setBoardData(prev => ({
          ...prev,
          groups: prev.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
      }));
  }
  
  // FIX: Update handleAddColumn to accept a column type and title, allowing for creation of various column types.
  const handleAddColumn = (type: ColumnType, title: string) => {
      const newColumn: Column = {
          id: `col-${Date.now()}`,
          title,
          type: type,
      };
      setBoardData(prev => ({...prev, columns: [...prev.columns, newColumn]}));
  }

  const handleDeleteGroup = (groupId: string) => {
    setBoardData(prev => ({
        ...prev,
        groups: prev.groups.filter(g => g.id !== groupId)
    }));
  }

  const handleDeleteColumn = (columnId: string) => {
    setBoardData(prev => ({
        ...prev,
        columns: prev.columns.filter(c => c.id !== columnId),
        // Also remove the property from all tasks
        groups: prev.groups.map(group => ({
            ...group,
            tasks: group.tasks.map(task => {
                const newProperties = {...task.properties};
                delete newProperties[columnId];
                return {...task, properties: newProperties};
            })
        }))
    }));
  }

  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[--board-bg] custom-scrollbar">
      <div className="space-y-8">
        {boardData.groups.map(group => (
          <Group
            key={group.id}
            group={group}
            columns={boardData.columns}
            allUsers={allUsers}
            onUpdateGroup={handleUpdateGroup}
            onUpdateTask={onUpdateTask}
            onSelectTask={onSelectTask}
            onAddTask={handleAddTask}
            onAddColumn={handleAddColumn}
            onDeleteGroup={handleDeleteGroup}
            onDeleteColumn={handleDeleteColumn}
            // FIX: Pass onColumnUpdate down to the Group component.
            onColumnUpdate={onColumnUpdate}
          />
        ))}
        <div className="w-full">
             <button 
                onClick={handleAddGroup}
                className="w-full bg-transparent p-3 rounded-xl text-sm font-medium text-[--secondary-text] hover:bg-[--hover-bg] flex items-center justify-center gap-2 border-2 border-dashed border-[--border-color] hover:border-[--accent-color]/50"
            >
                <PlusIcon className="w-4 h-4" />
                Add new group
            </button>
        </div>
      </div>
    </main>
  );
};

export default Board;