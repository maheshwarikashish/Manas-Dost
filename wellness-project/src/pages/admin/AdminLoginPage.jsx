import React, { useState } from 'react';

const AdminLoginPage = ({ onLogin }) => {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const ACCESS_CODE = 'SIH2025';

    const handleLogin = () => {
        if (accessCode === ACCESS_CODE) {
            onLogin();
        } else {
            setError('Invalid Access Code.');
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-sm">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center text-slate-800">
                    <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
                    <p className="text-slate-600 mb-6">Access the "Darpan" Dashboard</p>
                    <input
                        type="password"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter Access Code"
                        className="w-full p-3 border rounded-lg text-center"
                    />
                    <button onClick={handleLogin} className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition">
                        Login
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </div>
        </section>
    );
};

export default AdminLoginPage;