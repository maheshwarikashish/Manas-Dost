import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './services/api'; // Corrected import
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentPanel from './pages/StudentPanel';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Use the 'api' instance and the correct endpoint
                const response = await api.get('/auth'); 
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                // If the error is a 401 (unauthorized), the user isn't logged in
                // which is an expected state, so we don't need to treat it as a critical error.
                setUser(null);
            }
        };

        // Only fetch user if a token exists
        if (localStorage.getItem('token')) {
            fetchUser();
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                {/* Landing Page is the default route */}
                <Route path="/" element={<LandingPage />} />

                {/* Login and Signup pages are accessible only if the user is NOT logged in */}
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/student-panel" /> : <LoginPage setUser={setUser} />}
                />
                <Route 
                    path="/signup" 
                    element={user ? <Navigate to="/student-panel" /> : <SignupPage />}
                />

                {/* Student Panel is a protected route */}
                <Route 
                    path="/student-panel" 
                    element={user ? <StudentPanel user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                />

                {/* Add a catch-all or a 404 page if desired */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
