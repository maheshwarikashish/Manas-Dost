const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
// --- [DEFINITIVE FIX] ---
// Correctly import from CommonJS module. No '.default' is needed.
const { callGeminiAPI } = require('../services/geminiService');

const conversationHistories = {}; // In-memory store for conversations

// @route   POST /api/chat
// @desc    Send a message to the chatbot
router.post('/', auth, async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        // Retrieve or initialize conversation history
        if (!conversationHistories[userId]) {
            conversationHistories[userId] = [];
        }
        const history = conversationHistories[userId];

        // Construct a simplified history for the prompt
        const promptHistory = history.map(item => `${item.role}: ${item.content}`).join('\n');
        
        const systemInstruction = `
            You are Manas, a compassionate and supportive AI wellness coach for college students. 
            Your goal is to provide empathetic, non-judgmental, and helpful guidance.
            - Keep your responses concise, friendly, and easy to understand (around 2-4 sentences).
            - Never give medical advice or diagnoses. 
            - If the user's message is alarming (mentions self-harm, etc.), respond with: "I hear that you are going through a lot right now. It is very brave of you to share. It's important to talk to someone who can provide immediate support. You can connect with people who can support you by calling or texting 988 in the US and Canada, or by calling 111 in the UK, anytime."
            - For all other conversations, provide supportive listening and gentle suggestions.
        `;

        const fullPrompt = `${promptHistory}\nuser: ${message}\nassistant:`;

        const aiResponse = await callGeminiAPI(fullPrompt, systemInstruction);

        // Add user message and AI response to history
        history.push({ role: 'user', content: message });
        history.push({ role: 'assistant', content: aiResponse });

        // Limit history size to prevent excessively long prompts
        if (history.length > 10) {
            conversationHistories[userId] = history.slice(-10);
        }

        res.json({ reply: aiResponse });

    } catch (err) {
        console.error("Chatbot error:", err.message);
        res.status(500).send('Error communicating with the chatbot');
    }
});

module.exports = router;
