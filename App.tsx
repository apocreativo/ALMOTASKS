import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import { User, BoardData } from './types';
import { MOCK_BOARD_DATA, MOCK_USERS } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [boardData, setBoardData] = useState<BoardData>(() => {
    const savedBoard = localStorage.getItem('boardData');
    return savedBoard ? JSON.parse(savedBoard) : MOCK_BOARD_DATA;
  });
  const [allUsers, setAllUsers] = useState<User[]>(() => {
     const savedUsers = localStorage.getItem('allUsers');
    return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
  });
  
  // Persist user session
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Persist board data and users
  useEffect(() => {
    localStorage.setItem('boardData', JSON.stringify(boardData));
  }, [boardData]);

  useEffect(() => {
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
  }, [allUsers]);

  const handleLogin = (email: string, password?: string): string | null => {
    const user = allUsers.find(u => u.email === email);
    // In a real app, you'd check the password hash
    if (user && password === user.password) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return null;
    }
    return 'Invalid email or password.';
  };

  const handleSignUp = (name: string, email: string, password: string): string | null => {
    if (allUsers.some(u => u.email === email)) {
      return 'User with this email already exists.';
    }
    const newUser: User = { 
        id: `user-${Date.now()}`, 
        name, 
        email, 
        password,
        avatarUrl: `https://i.pravatar.cc/150?u=${email}` 
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return null;
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
  }

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setAllUsers(updatedUsers);

    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <DashboardLayout 
      user={currentUser} 
      allUsers={allUsers}
      setAllUsers={setAllUsers}
      boardData={boardData}
      setBoardData={setBoardData}
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
    />
  );
};

export default App;