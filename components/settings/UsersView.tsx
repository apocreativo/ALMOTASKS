import React from 'react';
import { User } from '../../types';
import { TrashIcon } from '../icons';

interface UsersViewProps {
    currentUser: User;
    allUsers: User[];
    setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UsersView: React.FC<UsersViewProps> = ({ currentUser, allUsers, setAllUsers }) => {

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
            setAllUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">User Management</h2>
            <p className="text-[--secondary-text] mb-6">Manage members of your workspace.</p>
            <div className="space-y-3">
                {allUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-[--hover-bg] rounded-lg">
                        <div className="flex items-center gap-4">
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-medium">{user.name} {user.id === currentUser.id && <span className="text-xs text-[--accent-color] ml-1">(You)</span>}</p>
                                <p className="text-sm text-[--secondary-text]">{user.email}</p>
                            </div>
                        </div>
                        <div>
                            {user.id !== currentUser.id ? (
                                <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-2 text-[--secondary-text] hover:text-red-500 hover:bg-red-500/10 rounded-full"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            ) : (
                                <span className="text-sm font-medium text-[--secondary-text] px-2">Admin</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersView;