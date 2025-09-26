import React, { useState, useRef, useEffect } from 'react';
import { callGeminiAPI } from '../../services/geminiAPI';

const ChatTab = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hi there! I'm Mitra. How can I help you feel better today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Automatically scroll to the bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        const userMessage = inputValue.trim();
        if (!userMessage) return;

        // Add user message to the chat
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInputValue('');
        setIsLoading(true);

        // Define a system instruction for the AI
        const systemInstruction = "You are Mitra, a compassionate and supportive AI wellness companion for college students. Your tone should be gentle, empathetic, and encouraging. Do not give medical advice. Instead, offer positive coping mechanisms, mindfulness exercises, or suggest talking to a professional. Keep your responses concise and easy to read.";
        const aiResponseText = await callGeminiAPI(userMessage, systemInstruction);
        
        // Add AI response to the chat
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
        setIsLoading(false);
    };

    return (
        <div className="h-full max-h-[calc(100vh-10rem)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col">
                <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-xl max-w-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="p-3 rounded-xl max-w-lg bg-gray-200 text-gray-800">
                                <div className="typing-indicator"><span></span><span></span><span></span></div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-gray-50 border-t flex items-center rounded-b-2xl">
                    <input
                        id="chat-input"
                        type="text"
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="ml-3 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={isLoading || !inputValue}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatTab;