import React, { useState, useRef, useEffect } from 'react';
import api from '../../services/api';

// --- SVG Icon for the Send Button ---
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

const ChatTab = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hi there! I'm Mitra. You're in a safe and confidential space. How can I help you feel better today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        const userMessage = inputValue.trim();
        if (!userMessage) return;

        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const res = await api.post('/chat', { message: userMessage });
            setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
        } catch (err) {
            console.error("AI chat error", err);
            setMessages(prev => [...prev, { sender: 'ai', text: "I'm having a little trouble connecting right now. Please try again in a moment." }]);
        }
        
        setIsLoading(false);
    };

    return (
        // ✨ MODIFIED: Removed the background color (bg-[#FFF9F0]) from the root div
        <div className="h-full flex flex-col p-4 md:p-8">
            <header className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-md">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[#2C3E50]">Mitra, Your AI Companion</h3>
                    <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                        <p className="text-sm text-gray-500">Online</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide p-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-lg lg:max-w-xl shadow
                            ${msg.sender === 'user' 
                                ? 'bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] text-white rounded-br-none' 
                                : 'bg-white text-[#2C3E50] rounded-bl-none'
                            }`}
                        >
                            <p className="text-base">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <div className="p-4 rounded-2xl max-w-lg bg-white text-[#2C3E50] rounded-bl-none shadow-md">
                            <div className="typing-indicator"><span></span><span></span><span></span></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-4">
                <div className="bg-white p-3 rounded-xl shadow-lg flex items-center space-x-3">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9F43]/50 border-transparent focus:border-transparent"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="p-3 bg-[#FF9F43] text-white rounded-lg hover:bg-[#E88E33] disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
                        disabled={isLoading || !inputValue}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatTab;