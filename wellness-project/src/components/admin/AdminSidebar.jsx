import React from 'react';

const navItems = [
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'insights', label: 'AI Insights', icon: '💡' },
    { id: 'community', label: 'Community Feed', icon: '💬' },
    { id: 'resources', label: 'Resource Hub', icon: '📚' },
    { id: 'counselors', label: 'Counselors', icon: '🧑‍⚕️' },
];

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    return (
        <aside className="w-64 bg-white shadow-md flex-col hidden md:flex">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    D
                </div>
                <h1 className="text-xl font-bold text-slate-800">Darpan</h1>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                            activeTab === item.id 
                            ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-200">
                <button 
                    onClick={onLogout} 
                    className="w-full text-left flex items-center space-x-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;