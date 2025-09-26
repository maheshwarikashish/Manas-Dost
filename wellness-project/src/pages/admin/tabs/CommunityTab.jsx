import React, { useState } from 'react';
import { adminCommunityPosts } from '../../../data/mockAdminData';

const CommunityTab = () => {
    const [posts, setPosts] = useState(adminCommunityPosts);
    const [announcement, setAnnouncement] = useState('');

    const handleDelete = (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setPosts(posts.filter(p => p.id !== postId));
        }
    };

    const handlePostAnnouncement = () => {
        if (!announcement.trim()) return;
        const newPost = {
            id: Date.now(),
            author: 'College Administration',
            content: announcement,
            timestamp: 'Just now',
            supports: 0,
            comments: 0
        };
        setPosts([newPost, ...posts]);
        setAnnouncement('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold mb-4 text-slate-800">Community Feed Moderation</h3>
                <div className="space-y-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white p-5 rounded-xl shadow-md">
                            <p className="text-slate-800">{post.content}</p>
                            <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                                <span className={post.author.includes('Admin') ? 'font-bold text-teal-600' : ''}>Posted by: {post.author}</span>
                                <span>{post.timestamp}</span>
                            </div>
                            <div className="border-t mt-3 pt-3 flex justify-end">
                                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete Post</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="sticky top-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">Post an Announcement</h4>
                    <p className="text-sm text-slate-500 mb-4">Share important information or messages of support with all students.</p>
                    <textarea 
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        className="w-full mt-4 p-3 border rounded-lg h-32 bg-slate-50 border-slate-300 text-slate-800" 
                        placeholder="e.g., Reminder: Mid-term wellness workshop this Friday..."
                    ></textarea>
                    <button onClick={handlePostAnnouncement} className="w-full mt-4 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition">
                        Post as Administration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityTab;