import React, { useState } from 'react';

const LoginPage = ({ onLogin, showPage }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = onLogin(id, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    {/* ... form JSX from your HTML ... */}
                    <h2 className="text-2xl font-bold mb-2">Student Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Student ID"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                            Login
                        </button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                    <p className="text-sm text-gray-600 mt-6">
                        Don't have an account?{' '}
                        <button onClick={() => showPage('signup')} className="font-semibold text-blue-600 hover:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;