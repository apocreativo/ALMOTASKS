import React from 'react';
import { HomeIcon, FolderIcon, CheckBadgeIcon, CogIcon, LogoutIcon, SparklesIcon } from './icons';
import { User } from '../types';

interface SidebarProps {
  user: User;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
  onViewProfile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView, onLogout, onViewProfile }) => {
  const navItems = [
    { name: 'Dashboard', icon: HomeIcon },
    { name: 'Projects', icon: FolderIcon },
    { name: 'My Tasks', icon: CheckBadgeIcon },
  ];

  const bottomNavItems = [
    { name: 'Settings', icon: CogIcon, action: () => setActiveView('Settings') },
    { name: 'Log out', icon: LogoutIcon, action: onLogout },
  ]

  return (
    <aside className="w-64 bg-[--sidebar-bg] border-r border-[--border-color] flex flex-col flex-shrink-0">
        <div className="h-[65px] flex items-center justify-center border-b border-[--border-color] gap-2">
            <SparklesIcon className="w-8 h-8 text-[--accent-color]" />
            <h1 className="text-2xl font-bold">Almo</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(item => (
                <button
                    key={item.name}
                    onClick={() => setActiveView(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeView === item.name
                        ? 'bg-[--accent-color]/10 text-[--accent-color]'
                        : 'text-[--secondary-text] hover:bg-[--hover-bg] hover:text-[--primary-text]'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                </button>
            ))}
        </nav>
        
        <div className="px-4 py-4 border-t border-[--border-color] space-y-2">
           {bottomNavItems.map(item => (
                <button
                    key={item.name}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[--secondary-text] hover:bg-[--hover-bg] hover:text-[--primary-text] transition-colors"
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                </button>
            ))}
        </div>
         <div className="px-4 py-4 border-t border-[--border-color]">
            <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <button onClick={onViewProfile} className="text-xs text-[--secondary-text] hover:underline">View profile</button>
                </div>
            </div>
        </div>
    </aside>
  );
};

export default Sidebar;