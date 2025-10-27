import React, { useState } from 'react';
import UsersView from '../settings/UsersView';
import { User } from '../../types';

interface SettingsViewProps {
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User;
    allUsers: User[];
    setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, setIsDarkMode, currentUser, allUsers, setAllUsers }) => {
    const [activeTab, setActiveTab] = useState('Appearance');

    const AppearanceSettings = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
                <label htmlFor="theme-toggle" className="text-[--primary-text]">
                    Theme
                    <p className="text-sm text-[--secondary-text]">Select your preferred color scheme.</p>
                </label>
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsDarkMode(false)} className={`px-4 py-2 rounded-md text-sm ${!isDarkMode ? 'bg-[--accent-color] text-white' : 'bg-[--input-bg]'}`}>Light</button>
                    <button onClick={() => setIsDarkMode(true)} className={`px-4 py-2 rounded-md text-sm ${isDarkMode ? 'bg-[--accent-color] text-white' : 'bg-[--input-bg]'}`}>Dark</button>
                </div>
            </div>
        </div>
    );
    
    return (
        <main className="flex-1 p-8 bg-[--board-bg]">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="flex gap-8">
                <aside className="w-1/4">
                    <nav className="space-y-1">
                        <button 
                            onClick={() => setActiveTab('Appearance')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'Appearance' ? 'bg-[--hover-bg]' : ''}`}>
                            Appearance
                        </button>
                         <button 
                            onClick={() => setActiveTab('Users')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'Users' ? 'bg-[--hover-bg]' : ''}`}>
                            Users
                        </button>
                    </nav>
                </aside>
                <div className="flex-1">
                    <div className="bg-[--card-bg] rounded-lg border border-[--border-color] p-8">
                       {activeTab === 'Appearance' && <AppearanceSettings />}
                       {activeTab === 'Users' && <UsersView currentUser={currentUser} allUsers={allUsers} setAllUsers={setAllUsers} />}
                    </div>
                </div>
            </div>
        </div>
        </main>
    );
};

export default SettingsView;