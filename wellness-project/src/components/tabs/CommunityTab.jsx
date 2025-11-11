import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CommunityPost from '../CommunityPost';
import PostModal from '../PostModal';

// A simple spinner for the loading state
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-[#00A896]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const CommunityTab = () => {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleNewPost = async (content) => {
        if (!content) return;
        try {
            await api.post('/posts', { content });
            setIsModalOpen(false);
            fetchPosts(); 
        } catch (err) {
            console.error("Failed to create post", err);
        }
    };

    const handleSubmitReply = async (postId, content) => {
        try {
            await api.post(`/posts/reply/${postId}`, { content });
            fetchPosts();
        } catch (err) {
            console.error("Failed to submit reply", err);
        }
    };

    const handleDraftPost = async (keywords) => {
        return `Draft generated based on: ${keywords}`;
    };

    const handleSuggestReply = async (postId, setReplyContent) => {
        setReplyContent('Suggestion feature is in development.');
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                {/* ✨ MODIFIED: Themed heading */}
                <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Peer Support Community</h3>
                {/* ✨ MODIFIED: Themed primary button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#00A896] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-[#00897B] hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                    Create New Post
                </button>
            </div>
            
            {isLoading ? (
                // ✨ MODIFIED: Themed loading state
                <div className="flex items-center justify-center space-x-2 py-10">
                    <SpinnerIcon />
                    <p className="text-[#2C3E50]/80">Loading posts...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map(post => (
                        <CommunityPost
                            key={post._id}
                            post={post}
                            onSubmitReply={handleSubmitReply}
                            onSuggestReply={handleSuggestReply}
                        />
                    ))}
                </div>
            )}

            <PostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleNewPost}
                onDraftPost={handleDraftPost}
            />
        </div>
    );
};

export default CommunityTab;