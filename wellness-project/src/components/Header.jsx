import React from 'react';
// ADDED: Import the Link component from React Router
import { Link } from 'react-router-dom';

// MODIFIED: The 'showPage' prop is no longer needed
const Header = () => {
  return (
    <header className="bg-[#FFF9F0]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2C3E50]">Manas Dost</h1>
        </div>
        <div className="space-x-4">
          {/* --- MODIFIED: Replaced <button> with <Link> and onClick with 'to' --- */}
          <Link
            to="/admin-login"
            className="bg-[#00A896] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-[#00897B] hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Admin Login
          </Link>
          {/* --- MODIFIED: Replaced <button> with <Link> and onClick with 'to' --- */}
          <Link
            to="/login"
            className="bg-[#FF9F43] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-[#E88E33] hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Student Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
