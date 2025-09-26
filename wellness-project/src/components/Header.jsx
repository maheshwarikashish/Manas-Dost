import React from 'react';

const Header = ({ showPage }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w.w3.org/2000/svg"
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
          <h1 className="text-2xl font-bold">Manas Dost</h1>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => showPage('login')}
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Student Login
          </button>
          {/* --- MODIFIED: Changed from an <a> tag to a <button> --- */}
          <button
            onClick={() => showPage('admin-login')}
            className="bg-gray-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Admin Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;