import React, { useState, useRef } from 'react';
import { User } from '../types';
import { CloseIcon } from './icons';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      avatarUrl: avatarUrl,
    };
    onUpdateUser(updatedUser);
    onClose();
  };
  
  const handleChangeAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-[--card-bg] rounded-xl shadow-2xl p-8 w-full max-w-md" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 text-[--secondary-text] hover:bg-[--hover-bg] rounded-full">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <button onClick={handleChangeAvatarClick} className="relative group">
                <img 
                    src={avatarUrl} 
                    alt={name} 
                    className="w-24 h-24 rounded-full mb-4 border-4 border-[--accent-color]/50 group-hover:opacity-75 transition-opacity object-cover" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Change</span>
                </div>
            </button>
        </div>
        
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-[--secondary-text]">Full Name</label>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full bg-[--input-bg] text-[--primary-text] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
                />
            </div>
             <div>
                <label className="text-sm font-medium text-[--secondary-text]">Email Address</label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full bg-[--input-bg] text-[--primary-text] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
                />
            </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[--border-color] flex items-center gap-3">
            <button onClick={onClose} className="w-full bg-[--hover-bg] text-[--primary-text] font-bold py-2.5 px-4 rounded-lg hover:bg-[--border-color] transition-all">
                Cancel
            </button>
            <button onClick={handleSave} className="w-full bg-[--accent-color] text-white font-bold py-2.5 px-4 rounded-lg hover:bg-[--accent-color-hover] transition-all">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;