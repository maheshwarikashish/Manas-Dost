          
import React, { useState, useEffect } from 'react';
import { default as api } from '../../services/api';
import FileUpload from '../FileUpload'; // Import the new component

// --- Helper: Status Badge ---
const StatusBadge = ({ status }) => {
    const statusStyles = {
        scheduled: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// --- Main ProfileTab Component ---
const ProfileTab = ({ user, setUser }) => { // Accept setUser to update user state globally
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user?._id) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await api.get(`/appointments/student/${user._id}`);
                setAppointments(res.data);
            } catch (err) {
                console.error("Failed to fetch appointments", err);
                setError("Couldn't load appointments.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [user]);

    const handleUploadComplete = (newPhotoUrl) => {
        // Update user state in the parent component (StudentPanel)
        setUser(prevUser => ({ ...prevUser, photoUrl: newPhotoUrl }));
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading profile...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column: Profile Card --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <img 
                                src={user.photoUrl || 'https://via.placeholder.com/150'} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <FileUpload userId={user._id} onUploadComplete={handleUploadComplete} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                        <p className="mt-4 text-xs bg-gray-100 text-gray-600 rounded-full px-4 py-1 inline-block">Student</p>
                    </div>
                </div>

                {/* --- Right Column: Appointments --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Appointments</h3>
                        {appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map(appt => (
                                    <div key={appt._id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all hover:bg-gray-50">
                                        <div>
                                            <p className="font-semibold text-gray-800">Session with {appt.counselor.name}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}
                                            </p>
                                        </div>
                                        <StatusBadge status={appt.status} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">You have no scheduled appointments. Use the "Book a Session" tab to get started.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileTab;
