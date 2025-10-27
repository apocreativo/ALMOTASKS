import React, { useState } from 'react';
import { SparklesIcon } from './icons';
import { MOCK_USERS } from '../constants';

interface LoginPageProps {
  onLogin: (email: string, password?: string) => string | null;
  onSignUp: (name: string, email: string, password: string) => string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignUp }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      if (!email || !password) {
        setError("Please enter your email and password.");
        return;
      }
      const loginError = onLogin(email, password);
      if (loginError) {
        setError(loginError);
      }
    } else {
      if (!name || !email || !password) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      const signUpError = onSignUp(name, email, password);
      if (signUpError) {
        setError(signUpError);
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  const handleAdminLogin = () => {
    const adminUser = MOCK_USERS[0];
    if (adminUser) {
        onLogin(adminUser.email, adminUser.password);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 bg-[--card-bg] rounded-lg shadow-xl w-full max-w-sm">
        <div 
          onDoubleClick={handleAdminLogin}
          className="flex items-center justify-center gap-2 mb-4 cursor-pointer"
          title="Double-click for admin access"
        >
          <SparklesIcon className="w-10 h-10 text-[--accent-color]" />
          <h1 className="text-3xl font-bold text-[--primary-text]">Almo</h1>
        </div>
        <p className="text-[--secondary-text] mb-8 text-center">
          The ultimate project management tool, powered by AI.
        </p>
        
        <form onSubmit={handleAuthAction} className="space-y-4">
          {!isLoginView && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[--input-bg] text-[--primary-text] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[--input-bg] text-[--primary-text] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
          />
           <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[--input-bg] text-[--primary-text] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
          />
          {!isLoginView && (
             <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[--input-bg] text-[--primary-text] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[--accent-color]"
            />
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[--accent-color] text-white font-bold py-3 px-4 rounded-lg hover:bg-[--accent-color-hover] transition-all"
          >
            {isLoginView ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={toggleView} className="text-sm text-[--secondary-text] hover:text-[--primary-text]">
            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;