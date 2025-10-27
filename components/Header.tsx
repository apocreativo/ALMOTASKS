import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { SearchIcon, BellIcon, ChevronDownIcon, CheckCircleIcon } from './icons';

interface HeaderProps {
    user: User;
    boardName: string;
    activeView: string;
    onLogout: () => void;
    onViewProfile: () => void;
}

const MOCK_NOTIFICATIONS = [
    { id: 1, text: "Maria Garcia assigned you to 'Implement user authentication'", read: false, user: { name: 'Maria Garcia', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' } },
    { id: 2, text: "The due date for 'Develop landing page' is tomorrow", read: false, user: { name: 'System Alert', avatarUrl: 'https://i.pravatar.cc/150?u=system' } },
    { id: 3, text: "Alex Johnson completed the task 'Design login flow'", read: false, user: { name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=user-1' } },
];


const Header: React.FC<HeaderProps> = ({ user, boardName, activeView, onLogout, onViewProfile }) => {
  const title = activeView === 'Projects' ? boardName : activeView;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [hasUnread, setHasUnread] = useState(notifications.some(n => !n.read));
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    onViewProfile();
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
  }
  
  const handleBellClick = () => {
      setIsNotificationsOpen(!isNotificationsOpen);
      if(hasUnread) {
          setHasUnread(false);
      }
  }
  
  const handleClearNotifications = () => {
      setNotifications([]);
      setIsNotificationsOpen(false);
  }

  return (
    <header className="bg-[--header-bg] h-[65px] border-b border-[--border-color] flex-shrink-0 flex items-center justify-between px-6">
        <div>
            <h2 className="text-xl font-bold text-[--primary-text]">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--secondary-text]" />
                <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="bg-[--background] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[--accent-color] w-64 placeholder:text-[--secondary-text]/70"
                />
            </div>
            <div className="relative" ref={notificationsRef}>
                <button onClick={handleBellClick} className="relative text-[--secondary-text] hover:text-[--primary-text]">
                    <BellIcon className="w-6 h-6"/>
                    {hasUnread && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[--header-bg]"></span>}
                </button>
                 {isNotificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-[--card-bg] border border-[--border-color] rounded-lg shadow-xl z-20 overflow-hidden">
                        <div className="p-3 border-b border-[--border-color]">
                            <h4 className="font-semibold text-sm">Notifications</h4>
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                           {notifications.length > 0 ? notifications.map(notif => (
                               <div key={notif.id} className="p-3 flex gap-3 items-start hover:bg-[--hover-bg]">
                                   <img src={notif.user.avatarUrl} alt={notif.user.name} className="w-8 h-8 rounded-full mt-1"/>
                                   <p className="text-sm text-[--secondary-text] flex-1">{notif.text}</p>
                               </div>
                           )) : (
                               <p className="p-6 text-center text-sm text-[--secondary-text]">No new notifications.</p>
                           )}
                        </div>
                         {notifications.length > 0 && (
                            <div className="p-2 border-t border-[--border-color]">
                                <button onClick={handleClearNotifications} className="w-full text-center text-sm text-[--accent-color] font-medium hover:bg-[--hover-bg] rounded py-1.5">
                                    Clear All
                                </button>
                            </div>
                         )}
                    </div>
                )}
            </div>

            <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                    <button>
                        <ChevronDownIcon className={`w-4 h-4 text-[--secondary-text] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}/>
                    </button>
                </div>
                {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[--card-bg] border border-[--border-color] rounded-lg shadow-xl z-20 overflow-hidden">
                        <button onClick={handleProfileClick} className="w-full text-left text-sm px-4 py-2 hover:bg-[--hover-bg] text-[--primary-text]">View Profile</button>
                        <button onClick={handleLogoutClick} className="w-full text-left text-sm px-4 py-2 hover:bg-[--hover-bg] text-red-500">Log Out</button>
                    </div>
                )}
            </div>
        </div>
    </header>
  );
};

export default Header;