import React, { useState } from 'react';

// MODIFIED: The 'onReaction' and 'currentUser' props are no longer needed.
const CommunityPost = ({ post, onSubmitReply, onSuggestReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = () => {
    if (replyContent.trim()) {
      onSubmitReply(post._id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const renderReplies = (replies) => {
    if (!replies || replies.length === 0) return null;
    return replies.map((reply, index) => (
      <div key={index} className="text-sm bg-slate-100 p-2 rounded-lg">
        <b>Anonymous User:</b> {reply.content}
      </div>
    ));
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <p className="text-slate-800">{post.content}</p>
      <div className="mt-4 text-xs text-slate-500">
        <span>Posted by <b>Anonymous User</b></span>
      </div>

      {/* MODIFIED: All reaction-related JSX has been removed. */}
      {/* Now, only the "Reply" button is shown. */}
      <div className="border-t mt-3 pt-3 flex items-center justify-end">
        <button 
          onClick={() => setIsReplying(!isReplying)} 
          className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          Reply
        </button>
      </div>

      {isReplying && (
        <div className="mt-3 animate-fade-in">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full text-sm border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Write a supportive reply..."
            rows="2"
          ></textarea>
          <div className="flex justify-end items-center mt-2 space-x-2">
            <button 
              onClick={() => onSuggestReply(post._id, setReplyContent)} 
              className="text-xs bg-slate-200 px-2 py-1 rounded-full hover:bg-slate-300"
            >
              Suggest Reply ✨
            </button>
            <button 
              onClick={handleSubmit} 
              className="text-sm bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3 pl-5 border-l-2 border-slate-100">
        {renderReplies(post.replies)}
      </div>
    </div>
  );
};

export default CommunityPost;

