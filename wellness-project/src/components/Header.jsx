import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Effect to prevent scrolling when the mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
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
          <h1 className="text-xl sm:text-2xl font-bold text-[#2C3E50]">Manas Dost</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/admin-login"
            className="bg-[#00A896] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-[#00897B] hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Admin Login
          </Link>
          <Link
            to="/login"
            className="bg-[#FF9F43] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-[#E88E33] hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Student Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9F43]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation (Full Screen) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-700 p-2 rounded-md">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <nav className="flex flex-col items-center space-y-8 text-center">
                <Link
                    to="/admin-login"
                    onClick={() => setIsOpen(false)}
                    className="w-64 bg-[#00A896] text-white text-xl font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-[#00897B] transition-all"
                >
                    Admin Login
                </Link>
                <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-64 bg-[#FF9F43] text-white text-xl font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-[#E88E33] transition-all"
                >
                    Student Login
                </Link>
                <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-[#2C3E50]/80 text-lg font-semibold hover:underline"
                >
                    Create an Account
                </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
