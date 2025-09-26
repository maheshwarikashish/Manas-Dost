import React from 'react';

const AdminHeader = ({ activeTab }) => {
    // Format the tab ID into a readable title (e.g., 'analytics' -> 'Analytics')
    const title = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

    return (
        <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            {/* You could add other header items here, like a user profile dropdown */}
        </header>
    );
};

export default AdminHeader;