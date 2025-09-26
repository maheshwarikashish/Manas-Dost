import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentPanel from "./pages/StudentPanel";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

// --- ADDED: Chart.js Global Setup ---
// This registers all the necessary components for every chart in the app.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
// --- End of Chart.js Setup ---


// Mock user database logic (replace with actual backend)
const VALID_STUDENT_IDS = ["SIH001", "SIH002", "SIH003"];
const usersDB = {
    users: [],
    getUsers: function() { this.users = JSON.parse(localStorage.getItem("manasDostUsers") || "[]"); return this.users; },
    saveUsers: function() { localStorage.setItem("manasDostUsers", JSON.stringify(this.users)); },
};

function App() {
    const [currentPage, setCurrentPage] = useState("landing");
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleLogin = (id, password) => {
        const user = usersDB.getUsers().find(u => u.id === id && u.password === password);
        if (user) {
            setCurrentUser(user);
            setCurrentPage("student-panel");
            return { success: true };
        }
        return { success: false, message: "Invalid Student ID or password." };
    };

    const handleSignup = (name, id, password) => {
        if (!VALID_STUDENT_IDS.includes(id)) {
            return { success: false, message: "This Student ID is not recognized." };
        }
        const users = usersDB.getUsers();
        if (users.find(u => u.id === id)) {
            return { success: false, message: "This Student ID is already registered." };
        }
        usersDB.users.push({ name, id, password });
        usersDB.saveUsers();
        return { success: true, message: "Sign up successful! Please log in." };
    };
    
    const handleStudentLogout = () => {
        setCurrentUser(null);
        setCurrentPage("landing");
    };

    const handleAdminLogin = () => {
        setIsAdmin(true);
    };

    const handleAdminLogout = () => {
        setIsAdmin(false);
        setCurrentPage("landing");
    };

    if (isAdmin) {
        return <AdminDashboardPage onLogout={handleAdminLogout} />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case "admin-login":
                return <AdminLoginPage onLogin={handleAdminLogin} />;
            case "login":
                return <LoginPage onLogin={handleLogin} showPage={setCurrentPage} />;
            case "signup":
                return <SignupPage onSignup={handleSignup} showPage={setCurrentPage} />;
            case "student-panel":
                return <StudentPanel user={currentUser} onLogout={handleStudentLogout} />;
            case "landing":
            default:
                return <LandingPage showPage={setCurrentPage} />;
        }
    };

    return <div>{renderPage()}</div>;
}

export default App;