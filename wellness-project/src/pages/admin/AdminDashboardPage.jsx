import React, { useState, lazy, Suspense } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

// Lazy load all the tab components
const AnalyticsTab = lazy(() => import('./tabs/AnalyticsTab'));
const InsightsTab = lazy(() => import('./tabs/InsightsTab'));
const CommunityTab = lazy(() => import('./tabs/CommunityTab'));
const ResourcesTab = lazy(() => import('./tabs/ResourcesTab'));
const CounselorsTab = lazy(() => import('./tabs/CounselorsTab'));

const AdminDashboardPage = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('analytics');

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'insights': return <InsightsTab />;
            case 'community': return <CommunityTab />;
            case 'resources': return <ResourcesTab />;
            case 'counselors': return <CounselorsTab />;
            case 'analytics':
            default:
                return <AnalyticsTab />;
        }
    };

    return (
        <section className="min-h-screen">
            <div className="flex h-screen bg-slate-50 text-slate-800">
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
                <main className="flex-1 flex flex-col">
                    <AdminHeader activeTab={activeTab} />
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar">
                        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
                            {renderActiveTab()}
                        </Suspense>
                    </div>
                </main>
            </div>
        </section>
    );
};

export default AdminDashboardPage;