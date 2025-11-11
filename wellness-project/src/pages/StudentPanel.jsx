import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import ProfileTab from '../components/tabs/ProfileTab';
import CommunityTab from '../components/tabs/CommunityTab';
import BookingTab from '../components/tabs/BookingTab';
import ChatTab from '../components/tabs/ChatTab';
import ResourcesTab from '../components/tabs/ResourcesTab';
import ToolsTabs from '../components/tabs/ToolsTabs';

const StudentPanel = ({ user, setUser, handleLogout }) => {
    const [activeTab, setActiveTab] = useState('Profile');

    if (!user) {
        return <Navigate to="/login" />;
    }

    const renderTab = () => {
        switch (activeTab) {
            case 'Profile':
                return <ProfileTab user={user} setUser={setUser} handleLogout={handleLogout} />;
            case 'Community':
                return <CommunityTab user={user} />;
            case 'Appointments':
                return <BookingTab user={user} />;
            case 'Chatbot':
                return <ChatTab />;
            case 'Resources':
                return <ResourcesTab />;
            case 'Settings':
                return <ToolsTabs user={user} />;
            default:
                return <ProfileTab user={user} setUser={setUser} handleLogout={handleLogout} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                {renderTab()}
            </main>
        </div>
    );
};

export default StudentPanel;
