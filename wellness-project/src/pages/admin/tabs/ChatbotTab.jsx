import React, { useState, useRef, useEffect } from 'react';
import api from '../../../services/api';

const ChatbotTab = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Welcome to the chatbot console. You can test the AI's responses here.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/chatbot', { message: input });
            const aiMessage = { sender: 'ai', text: res.data.reply };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { 
                sender: 'ai', 
                text: 'Sorry, something went wrong while connecting to the AI. Please check the server.' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-3xl font-bold text-slate-800">AI Chatbot Console</h3>
            <p className="mt-2 text-md text-slate-600">
                Interact with the AI assistant to test its tone, helpfulness, and accuracy. This is the same AI that students will interact with.
            </p>
            <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-full h-[500px] bg-slate-50 rounded-lg border p-4 overflow-y-auto flex flex-col space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start max-w-lg ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                                    AI
                                </div>
                            )}
                            <div className={`px-4 py-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-800'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start self-start">
                             <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                                AI
                            </div>
                            <div className="px-4 py-3 rounded-lg bg-slate-200 text-slate-800">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-2"></span>
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75 mr-2"></span>
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-3">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        placeholder="Send a message to the AI..."
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatbotTab;
