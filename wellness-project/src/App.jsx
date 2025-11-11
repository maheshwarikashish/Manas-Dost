import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; // Reverted to use default axios
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentPanel from './pages/StudentPanel';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Reverted to the original API endpoint
                const response = await axios.get('/api/user', { 
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                }); 
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                setUser(null);
            }
        };

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
                <Route path="/" element={<LandingPage />} />
                <Route 
                    path="/login" 
                    element={user ? <Navigate to="/student-panel" /> : <LoginPage setUser={setUser} />}
                />
                <Route 
                    path="/signup" 
                    element={user ? <Navigate to="/student-panel" /> : <SignupPage />}
                />
                <Route 
                    path="/student-panel" 
                    element={user ? <StudentPanel user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
