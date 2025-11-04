import React, { lazy, Suspense } from 'react';
// ADDED: Import the necessary routing components
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ErrorBoundary from '../components/ErrorBoundary';

// --- Lazy load all tab components ---
// Note: I've corrected a small typo from 'ToolsTabs' to 'ToolsTab'
const HomeTab = lazy(() => import('../components/tabs/HomeTab'));
const JourneysTab = lazy(() => import('../components/tabs/JourneysTab'));
const ToolsTab = lazy(() => import('../components/tabs/ToolsTabs'));
const ResourcesTab = lazy(() => import('../components/tabs/ResourcesTab'));
const CommunityTab = lazy(() => import('../components/tabs/CommunityTab'));
const ChatTab = lazy(() => import('../components/tabs/ChatTab'));
const BookingTab = lazy(() => import('../components/tabs/BookingTab'));
const ProfileTab = lazy(() => import('../components/tabs/ProfileTab'));
const EmergencyTab = lazy(() => import('../components/tabs/EmergencyTab'));


const StudentPanel = ({ user, onLogout }) => {
    // REMOVED: The 'activeTab' state is no longer needed. The URL is now the source of truth.
    const navigate = useNavigate();

    // This function can be passed to child components to allow them to change tabs
    const navigateToTab = (tabId) => {
        navigate(`/student-panel/${tabId}`);
    };

    return (
        <section className="min-h-screen bg-slate-100">
            <div className="flex h-screen">
                {/* MODIFIED: The Sidebar no longer needs activeTab or setActiveTab props */}
                <Sidebar onLogout={onLogout} />
                
                <main className="flex-1 flex flex-col">
                    <header className="bg-white p-4 border-b border-slate-200 md:hidden">
                        <h2 className="text-xl font-bold text-slate-800">Manas Dost</h2>
                    </header>
                    
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                        <ErrorBoundary>
                            <Suspense fallback={
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                            }>
                                {/* --- ADDED: This is the "local map" for the student panel --- */}
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
                                    
                                    {/* ADDED: A default route to redirect to the home tab if the URL is just /student-panel */}
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