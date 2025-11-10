import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- SVG Icons ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IdCardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7-9.542 7 .847 0 1.669.118 2.457.334M18 8.828a9.959 9.959 0 012.064 3.172M6.125 6.125a9.959 9.959 0 011.83-1.05M1.395 1.395l21.21 21.21" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

const SignupPage = ({ onSignup }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const result = await onSignup(name, id, password);
            if (!result.success) {
                setError(result.message);
            } else {
                setSuccess(result.message || 'Registered successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-[#FFF9F0] p-4 relative overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-[#FF9F43]/20 rounded-full filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-[#00A896]/20 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md z-10 animate-fade-in-up">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-t-4 border-[#FF9F43]">
                    <div className="mx-auto mb-4 w-14 h-14 bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>

                    <h2 className="text-3xl font-bold mb-2 text-[#2C3E50]">Create Your Account</h2>
                    <p className="text-[#2C3E50]/80 mb-6">Join the Manas Dost community.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2"><UserIcon /></span>
                            <input type="text" placeholder="Full Name" className="w-full p-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2"><IdCardIcon /></span>
                            <input type="text" placeholder="Verified Student ID" className="w-full p-3 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition" value={id} onChange={(e) => setId(e.target.value)} required />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2"><LockIcon /></span>
                            <input type={showPassword ? 'text' : 'password'} placeholder="Create Password" className="w-full p-3 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00A896]">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2"><LockIcon /></span>
                            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" className="w-full p-3 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] transition" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00A896]">{showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                        </div>

                        <button type="submit" disabled={loading} className="w-full mt-6 bg-[#FF9F43] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-[#E88E33] hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                            {loading ? <SpinnerIcon /> : 'Create Account'}
                        </button>

                        {error && <p className="text-[#FF6B6B] text-sm pt-2">{error}</p>}
                        {success && <p className="text-green-500 text-sm pt-2">{success}</p>}
                    </form>

                    <p className="text-sm text-[#2C3E50]/80 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-[#00A896] hover:underline">
                            Login
                        </Link>
                    </p>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <Link to="/" className="text-sm text-[#2C3E50]/60 hover:text-[#2C3E50] hover:underline flex items-center justify-center w-full">
                            <ArrowLeftIcon />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignupPage;
