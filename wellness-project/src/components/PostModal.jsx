import React, { useState } from 'react';

const PostModal = ({ isOpen, onClose, onSubmit, onDraftPost }) => {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit(content);
    setContent('');
    setKeywords('');
  };

  const handleDraft = async () => {
      setIsDrafting(true);
      const draftedText = await onDraftPost(keywords);
      setContent(draftedText);
      setIsDrafting(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-gray-800">Create a New Post</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Share what's on your mind. All posts are anonymous and moderated.</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mt-4 p-3 border rounded-lg h-32"
          placeholder="I've been feeling really overwhelmed lately..."
        ></textarea>
        
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <label className="text-md font-semibold text-gray-700">Need help writing? ✨</label>
          <p className="text-xs text-gray-500">Type a few words, and our AI will help you get started.</p>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
            placeholder="e.g., lonely, project stress, homesick"
          />
          <button
            onClick={handleDraft}
            disabled={isDrafting}
            className="w-full md:w-auto mt-2 text-sm bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition disabled:bg-gray-400"
          >
            {isDrafting ? 'Drafting...' : 'Help Me Write'}
          </button>
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition"
        >
          Post Anonymously
        </button>
      </div>
    </div>
  );
};

export default PostModal;