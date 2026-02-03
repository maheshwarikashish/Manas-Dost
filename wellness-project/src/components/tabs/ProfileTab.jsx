import React from 'react';

const ProfileTab = ({ user, setUser, handleLogout }) => {
    // Fallback to default user data if none is provided
    const profileData = {
        name: user ? user.name : "John Doe",
        email: user ? user.email : "john.doe@example.com",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        avatar: user && user.profilePictureUrl ? user.profilePictureUrl : 'https://via.placeholder.com/150'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">
                My Profile
            </h3>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img 
                    src={profileData.avatar} 
                    alt="User Avatar" 
                    className="w-28 h-28 rounded-full shadow-lg border-4 border-white"
                />
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                    <p className="text-gray-600">{profileData.email}</p>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Bio</h3>
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
            </div>
        </div>
    );
};

export default ProfileTab;
