import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Board from './Board';
import MyTasksView from './placeholders/MyTasksView';
import SettingsView from './placeholders/SettingsView';
import DashboardView from './placeholders/DashboardView';
import { BoardData, Task, User, Column } from '../types';
import TaskDetailsModal from './TaskDetailsModal';
import ProfileModal from './ProfileModal';

interface DashboardLayoutProps {
  user: User;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  boardData: BoardData;
  setBoardData: React.Dispatch<React.SetStateAction<BoardData>>;
  onLogout: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, allUsers, setAllUsers, boardData, setBoardData, onLogout, onUpdateUser }) => {
  const [activeView, setActiveView] = useState('Projects');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleUpdateTask = (updatedTask: Task) => {
    setBoardData(prevData => {
        const newGroups = prevData.groups.map(group => ({
            ...group,
            tasks: group.tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
        }));
        return { ...prevData, groups: newGroups };
    });
  };

  const handleColumnUpdate = (updatedColumn: Column) => {
    setBoardData(prevData => ({
      ...prevData,
      columns: prevData.columns.map(c => c.id === updatedColumn.id ? updatedColumn : c),
    }));
  };

  const renderActiveView = () => {
    switch(activeView) {
      case 'Projects':
        return <Board 
          allUsers={allUsers}
          boardData={boardData}
          setBoardData={setBoardData}
          onSelectTask={setSelectedTask}
          onUpdateTask={handleUpdateTask}
          onColumnUpdate={handleColumnUpdate}
        />;
      case 'My Tasks':
        return <MyTasksView
          boardData={boardData}
          currentUser={user}
          allUsers={allUsers}
          onUpdateTask={handleUpdateTask}
          onSelectTask={setSelectedTask}
          onColumnUpdate={handleColumnUpdate}
        />
      case 'Dashboard':
        return <DashboardView boardData={boardData} allUsers={allUsers} />;
      case 'Settings':
        return <SettingsView 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentUser={user}
          allUsers={allUsers}
          setAllUsers={setAllUsers}
        />;
      default:
        return <Board 
          allUsers={allUsers}
          boardData={boardData}
          setBoardData={setBoardData}
          onSelectTask={setSelectedTask}
          onUpdateTask={handleUpdateTask}
          onColumnUpdate={handleColumnUpdate}
        />;
    }
  }

  return (
    <div className="flex h-screen bg-[--background] text-[--primary-text]">
      <Sidebar 
        user={user}
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={onLogout}
        onViewProfile={() => setIsProfileModalOpen(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          boardName={boardData.name} 
          activeView={activeView} 
          onLogout={onLogout}
          onViewProfile={() => setIsProfileModalOpen(true)}
        />
        {renderActiveView()}
      </div>
      {selectedTask && (
        <TaskDetailsModal
            task={selectedTask}
            columns={boardData.columns}
            allUsers={allUsers}
            onClose={() => setSelectedTask(null)}
            onUpdateTask={handleUpdateTask}
            onColumnUpdate={handleColumnUpdate}
            boardData={boardData}
        />
      )}
      {isProfileModalOpen && (
        <ProfileModal 
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdateUser={onUpdateUser}
        />
      )}
    </div>
  );
};

export default DashboardLayout;