import React, { useState } from 'react';
import InsightsTab from './tabs/InsightsTab';
import ChatbotTab from './tabs/ChatbotTab';
import UserManagementTab from './tabs/UserManagementTab'; // Import the new tab

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('insights');

    const tabs = {
        insights: { label: 'Insights', component: <InsightsTab /> },
        chatbot: { label: 'Chatbot', component: <ChatbotTab /> },
        users: { label: 'User Management', component: <UserManagementTab /> }, // Add the new tab
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex space-x-6">
                        {Object.keys(tabs).map(tabKey => (
                            <button
                                key={tabKey}
                                onClick={() => setActiveTab(tabKey)}
                                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tabKey
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                {tabs[tabKey].label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    {tabs[activeTab].component}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;