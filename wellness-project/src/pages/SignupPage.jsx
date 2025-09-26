import React, { useState } from 'react';

const SignupPage = ({ onSignup, showPage }) => {
    // State to manage form inputs
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State for handling feedback messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic client-side validation
        if (!name || !id || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Call the signup handler passed from App.jsx
        const result = onSignup(name, id, password);

        if (result.success) {
            setSuccess(result.message);
            // Redirect to login after a short delay
            setTimeout(() => showPage('login'), 2000);
        } else {
            setError(result.message);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <div className="flex justify-center mb-4">
                        {/* Logo SVG */}
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Create Student Account</h2>
                    <p className="text-gray-600 mb-6">Only students with a valid ID can sign up.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Verified Student ID"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Create Password"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                            Sign Up
                        </button>

                        {/* Feedback Messages */}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
                    </form>

                    <p className="text-sm text-gray-600 mt-6">
                        Already have an account?{' '}
                        <button onClick={() => showPage('login')} className="font-semibold text-blue-600 hover:underline">
                            Login
                        </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        <button onClick={() => showPage('landing')} className="hover:underline">
                            ← Back to Home
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default SignupPage;