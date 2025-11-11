import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentPanel from './pages/StudentPanel';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        // Implement logout logic here
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<SignupPage />} />
                <Route 
                    path="/student-panel" 
                    element={user ? <StudentPanel user={user} setUser={setUser} handleLogout={handleLogout} /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
