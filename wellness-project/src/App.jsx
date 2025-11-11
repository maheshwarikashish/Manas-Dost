import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import api from "./services/api";

// Import all your page components
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentPanel from "./pages/StudentPanel";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend
);

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth');
                    if (res.data.role === 'admin') {
                        setIsAdmin(true);
                    } else {
                        setCurrentUser(res.data);
                    }
                } catch (err) {
                    localStorage.removeItem('token');
                    console.error("Token validation failed", err);
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);
    
    const handleLogin = async (id, password) => {
        try {
            const res = await api.post('/auth/login', { studentId: id, password });
            localStorage.setItem('token', res.data.token);
            const userRes = await api.get('/auth');
            setCurrentUser(userRes.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.msg || "Login failed." };
        }
    };

    const handleAdminLogin = async (id, password) => {
        try {
            const res = await api.post('/auth/admin-login', { adminId: id, password });
            localStorage.setItem('token', res.data.token);
            setIsAdmin(true);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.msg || "Login failed." };
        }
    };
    
    const handleSignup = async (name, id, password) => {
        try {
            const body = { name, studentId: id, password };
            await api.post('/auth/register', body);
            return { success: true, message: 'Registration successful! Please log in.' }; 
        } catch (err) {
            return { success: false, message: err.response?.data?.msg || "Registration failed." };
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setIsAdmin(false);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={
                    currentUser ? <Navigate to="/student-panel/home" /> :
                    isAdmin ? <Navigate to="/admin-dashboard" /> :
                    <LandingPage />
                } />
                <Route path="/login" element={currentUser ? <Navigate to="/student-panel/home" /> : <LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={currentUser ? <Navigate to="/student-panel/home" /> : <SignupPage onSignup={handleSignup} />} />
                <Route path="/admin-login" element={isAdmin ? <Navigate to="/admin-dashboard" /> : <AdminLoginPage onLogin={handleAdminLogin} />} />

                {/* --- Protected Student Route --- */}
                <Route 
                    path="/student-panel/*"
                    element={
                        <ProtectedRoute isAllowed={!!currentUser} redirectPath="/login">
                            {/* FIX: Pass the setCurrentUser function down as the setUser prop */}
                            <StudentPanel user={currentUser} setUser={setCurrentUser} onLogout={handleLogout} />
                        </ProtectedRoute>
                    } 
                />

                {/* --- Protected Admin Route --- */}
                <Route 
                    path="/admin-dashboard/*"
                    element={
                        <ProtectedRoute isAllowed={isAdmin} redirectPath="/admin-login">
                            <AdminDashboardPage onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />
                
                {/* A fallback route for any unknown URLs */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
