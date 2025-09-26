import React, { useState, lazy, Suspense } from 'react';
import Sidebar from '../components/Sidebar';
import ErrorBoundary from '../components/ErrorBoundary';

// --- Lazy Load All Tab Components ---
const HomeTab = lazy(() => import('../components/tabs/HomeTab'));
const JourneysTab = lazy(() => import('../components/tabs/JourneysTab'));
const ToolsTab = lazy(() => import('../components/tabs/ToolsTabs'));
const CommunityTab = lazy(() => import('../components/tabs/CommunityTab'));
// ADDED: Lazy load remaining tabs
const ResourcesTab = lazy(() => import('../components/tabs/ResourcesTab'));
const ChatTab = lazy(() => import('../components/tabs/ChatTab'));
const BookingTab = lazy(() => import('../components/tabs/BookingTab'));
const EmergencyTab = lazy(() => import('../components/tabs/EmergencyTab'));


const StudentPanel = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('home');

    const renderActiveTab = () => {
        let ComponentToRender;
        
        // This switch statement now covers all navigation options from the sidebar
        switch (activeTab) {
            case 'journeys':
                ComponentToRender = JourneysTab;
                break;
            case 'tools':
                ComponentToRender = ToolsTab;
                break;
            case 'resources': // ADDED
                ComponentToRender = ResourcesTab;
                break;
            case 'community':
                ComponentToRender = CommunityTab;
                break;
            case 'chat': // UPDATED: Replaced placeholder
                ComponentToRender = ChatTab;
                break;
            case 'booking': // ADDED
                ComponentToRender = BookingTab;
                break;
            case 'emergency': // ADDED
                ComponentToRender = EmergencyTab;
                break;
            case 'home':
            default:
                ComponentToRender = HomeTab;
                break;
        }

        return (
            <ErrorBoundary>
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                }>
                    <ComponentToRender user={user} navigateToTab={setActiveTab} />
                </Suspense>
            </ErrorBoundary>
        );
    };

    return (
        <section className="min-h-screen bg-gray-50">
            <div className="flex h-screen">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
                <main className="flex-1 flex flex-col">
                    <header className="bg-white p-4 border-b">
                        <h2 className="text-xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
                    </header>
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gradient-to-br from-blue-50 to-teal-50">
                        {renderActiveTab()}
                    </div>
                </main>
            </div>
        </section>
    );
};

export default StudentPanel;