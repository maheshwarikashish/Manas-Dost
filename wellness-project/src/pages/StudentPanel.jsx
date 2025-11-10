import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ErrorBoundary from '../components/ErrorBoundary';

// --- Lazy load all tab components ---
const HomeTab = lazy(() => import('../components/tabs/HomeTab'));
const JourneysTab = lazy(() => import('../components/tabs/JourneysTab'));
const ToolsTab = lazy(() => import('../components/tabs/ToolsTabs'));
const ResourcesTab = lazy(() => import('../components/tabs/ResourcesTab'));
const CommunityTab = lazy(() => import('../components/tabs/CommunityTab'));
const ChatTab = lazy(() => import('../components/tabs/ChatTab'));
const BookingTab = lazy(() => import('../components/tabs/BookingTab'));
const ProfileTab = lazy(() => import('../components/tabs/ProfileTab'));
const EmergencyTab = lazy(() => import('../components/tabs/EmergencyTab'));

const HamburgerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

// A helper to get a user-friendly title from the route path
const getTitleFromPath = (path) => {
    const pathSegment = path.split('/').pop();
    if (!pathSegment) return 'Home';
    // Capitalize first letter, and handle special cases
    switch (pathSegment) {
        case 'home': return 'Dashboard';
        case 'journeys': return 'My Journeys';
        case 'tools': return 'AI Wellness Tools';
        case 'resources': return 'Resource Hub';
        case 'community': return 'Peer Support Forum';
        case 'chat': return 'Chat with Mitra';
        case 'booking': return 'Book a Session';
        case 'profile': return 'My Profile';
        case 'emergency': return 'Emergency Help';
        default: 
            return pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);
    }
};


const StudentPanel = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const navigateToTab = (tabId) => {
        navigate(`/student-panel/${tabId}`);
        setSidebarOpen(false); // Close sidebar on navigation
    };

    const pageTitle = getTitleFromPath(location.pathname);

    return (
        <section className="min-h-screen bg-gray-100">
            <div className="flex h-screen">
                <Sidebar 
                    onLogout={onLogout} 
                    isSidebarOpen={isSidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                />
                
                <main className="flex-1 flex flex-col h-screen">
                    {/* --- Mobile & Tablet Header --- */}
                    <header className="bg-white p-4 border-b border-gray-200 flex justify-between items-center md:hidden sticky top-0 z-20">
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                            <HamburgerIcon />
                        </button>
                        <h2 className="text-lg font-bold text-gray-800">{pageTitle}</h2>
                        <div className="w-6"></div> {/* Spacer to balance the title */}
                    </header>
                    
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        <ErrorBoundary>
                            <Suspense fallback={
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            }>
                                <Routes>
                                    <Route path="home" element={<HomeTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="journeys" element={<JourneysTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="tools" element={<ToolsTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="resources" element={<ResourcesTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="community" element={<CommunityTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="chat" element={<ChatTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="booking" element={<BookingTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="profile" element={<ProfileTab user={user} navigateToTab={navigateToTab} />} />
                                    <Route path="emergency" element={<EmergencyTab user={user} navigateToTab={navigateToTab} />} />
                                    
                                    <Route index element={<Navigate to="home" replace />} />
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </main>
            </div>
        </section>
    );
};

export default StudentPanel;
