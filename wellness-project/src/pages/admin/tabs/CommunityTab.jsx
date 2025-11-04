import React, { useState, useEffect } from 'react';
// CORRECTED: These paths now correctly point to files from within the /pages/admin/tabs/ folder.
import api from '../../../services/api';

const CommunityTab = () => {
    const [posts, setPosts] = useState([]);
    const [announcement, setAnnouncement] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${postId}`);
                fetchPosts(); // Refresh the feed
            } catch (err) {
                console.error("Failed to delete post", err);
            }
        }
    };

    const handlePostAnnouncement = async () => {
        if (!announcement.trim()) return;
        try {
            await api.post('/posts', { content: announcement });
            setAnnouncement('');
            fetchPosts(); // Refresh the feed
        } catch (err) {
            console.error("Failed to post announcement", err);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold mb-4 text-slate-800">Community Feed Moderation</h3>
                {isLoading ? <p>Loading feed...</p> : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <div key={post._id} className="bg-white p-5 rounded-xl shadow-md">
                                <p className="text-slate-800">{post.content}</p>
                                <div className="border-t mt-3 pt-3 flex justify-end">
                                    <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete Post</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="sticky top-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">Post an Announcement</h4>
                    <p className="text-sm text-slate-500 mb-4">Share important information with all students.</p>
                    <textarea 
                        value={announcement}
                        onChange={(e) => setAnnouncement(e.target.value)}
                        className="w-full mt-4 p-3 border rounded-lg h-32 bg-slate-50 border-slate-300 text-slate-800" 
                        placeholder="e.g., Reminder: Mid-term wellness workshop..."
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