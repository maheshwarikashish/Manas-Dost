import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'journeys', label: 'Journeys', icon: '🌱' },
        { id: 'tools', label: 'AI Tools', icon: '🛠️' },
        { id: 'resources', label: 'Resource Hub', icon: '📚' },
        { id: 'community', label: 'Peer Support', icon: '🤝' },
        { id: 'chat', label: 'Chat with Mitra', icon: '🤖' },
        { id: 'booking', label: 'Book a Session', icon: '📅' },
        { id: 'emergency', label: 'Emergency Help', icon: '🚨' },
    ];

    return (
        <aside className="w-64 bg-white shadow-md flex-col hidden md:flex">
            {/* ... Sidebar header ... */}
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                            activeTab === item.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-600 hover:bg-gray-100' // Changed inactive text to gray for better contrast
                        }`}
                    >
                        <span>{item.icon}</span>
                        {/* MODIFIED: Added font-bold class here */}
                        <span className="font-bold">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t">
                <button onClick={onLogout} className="w-full text-left flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600">
                    <span>🚪</span>
                    {/* MODIFIED: Added font-bold class here as well */}
                    <span className="font-bold">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;