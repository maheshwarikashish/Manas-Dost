import React from 'react';

const ProfileTab = ({ user }) => {
    // Dummy data for demonstration
    const userProfile = {
        name: user ? user.name : 'John Doe',
        email: user ? user.email : 'john.doe@example.com',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        avatar: 'https://via.placeholder.com/150'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                <img src={userProfile.avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
                <div>
                    <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                    <p className="text-gray-600">{userProfile.email}</p>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold">Bio</h3>
                <p className="text-gray-700">{userProfile.bio}</p>
            </div>
        </div>
    );
};

export default ProfileTab;
