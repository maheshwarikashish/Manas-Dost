import React, { useState } from 'react';

const CommunityPost = ({ post, onReaction, onSubmitReply, onSuggestReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmit = () => {
    if (replyContent.trim()) {
      onSubmitReply(post.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const renderReplies = (replies) => {
    if (!replies || replies.length === 0) return null;
    return replies.map((reply, index) => (
      <div key={index} className="text-sm bg-gray-100 p-2 rounded-lg">
        <b>{reply.author}:</b> {reply.content}
      </div>
    ));
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <p className="text-gray-800">{post.content}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Posted by <b>{post.author}</b></span>
      </div>

      <div className="border-t mt-3 pt-3 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {Object.entries(post.reactions).map(([emoji, count]) => (
            <React.Fragment key={emoji}>
              <button
                onClick={() => onReaction(post.id, emoji)}
                className={`p-1 rounded-full ${post.userReaction === emoji ? 'bg-blue-200' : 'hover:bg-gray-200'} transition`}
              >
                {emoji}
              </button>
              <span className="text-sm font-semibold">{count}</span>
            </React.Fragment>
          ))}
        </div>
        <button onClick={() => setIsReplying(!isReplying)} className="text-sm font-semibold text-gray-600 hover:text-black">
          Reply
        </button>
      </div>

      {isReplying && (
        <div className="mt-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full text-sm border rounded-lg p-2"
            placeholder="Write a supportive reply..."
          ></textarea>
          <div className="flex justify-end items-center mt-2 space-x-2">
            <button onClick={() => onSuggestReply(post.id, setReplyContent)} className="text-xs bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300">
              Suggest Reply ✨
            </button>
            <button onClick={handleSubmit} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3 pl-5 border-l-2">
        {renderReplies(post.replies)}
      </div>
    </div>
  );
};

export default CommunityPost;