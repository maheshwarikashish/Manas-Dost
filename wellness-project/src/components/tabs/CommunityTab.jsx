import React, { useState } from 'react';
// Import child components and mock data
import CommunityPost from '../CommunityPost';
import PostModal from '../PostModal';
import { communityPostsData } from '../../data/mockData';
import { callGeminiAPI } from '../../services/geminiAPI';

const CommunityTab = () => {
    // State for all posts in the feed
    const [posts, setPosts] = useState(communityPostsData);
    // State to control which posts are shown
    const [filter, setFilter] = useState('all');
    // State to control the visibility of the new post modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNewPost = (content) => {
        if (!content) return;
        const newPost = {
            id: Date.now(),
            author: "Anonymous User", // Or get from logged in user context
            content,
            tags: [], // Could add logic to parse tags from content
            replies: [],
            reactions: { '❤️': 0, '👍': 0, '🤗': 0 },
            userReaction: null,
        };
        // Add the new post to the top of the feed
        setPosts([newPost, ...posts]);
        setIsModalOpen(false); // Close the modal after posting
    };

    const handleReaction = (postId, reaction) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const newReactions = { ...p.reactions };
                // If user is undoing their reaction
                if (p.userReaction === reaction) {
                    newReactions[reaction]--;
                    return { ...p, reactions: newReactions, userReaction: null };
                }
                // If user is changing their reaction or reacting for the first time
                if (p.userReaction) {
                    newReactions[p.userReaction]--;
                }
                newReactions[reaction]++;
                return { ...p, reactions: newReactions, userReaction: reaction };
            }
            return p;
        }));
    };

    const handleSubmitReply = (postId, content) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const newReply = { author: 'Anonymous User', content };
                return { ...p, replies: [...p.replies, newReply] };
            }
            return p;
        }));
    };

    const handleDraftPost = async (keywords) => {
        if (!keywords) return "";
        const prompt = `Help a college student write an anonymous post for a peer support forum based on these keywords. The tone should be gentle and encourage others to share experiences. Keywords: "${keywords}"`;
        return await callGeminiAPI(prompt);
    };
    
    const handleSuggestReply = async (postId, setReplyContent) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return;
        setReplyContent('Generating...');
        const prompt = `A student wrote this in an anonymous forum: "${post.content}". Generate one short, empathetic, and non-judgmental reply option to show support.`;
        const result = await callGeminiAPI(prompt);
        setReplyContent(result);
    };

    const filteredPosts = filter === 'all' 
        ? posts 
        : posts.filter(p => p.tags.includes(filter));

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center space-x-4">
                    <h3 className="text-2xl font-bold">Peer Support</h3>
                    <div className="flex space-x-2">
                        {['all', 'exam', 'first-year'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setFilter(tag)}
                                className={`px-3 py-1 rounded-full text-sm transition ${
                                    filter === tag 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white border hover:bg-gray-100'
                                }`}
                            >
                                {tag === 'all' ? 'All Posts' : `#${tag.charAt(0).toUpperCase() + tag.slice(1)}`}
                            </button>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                >
                    Create New Post
                </button>
            </div>

            <div className="space-y-6">
                {filteredPosts.map(post => (
                    <CommunityPost
                        key={post.id}
                        post={post}
                        onReaction={handleReaction}
                        onSubmitReply={handleSubmitReply}
                        onSuggestReply={handleSuggestReply}
                    />
                ))}
            </div>

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