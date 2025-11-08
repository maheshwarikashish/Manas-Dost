const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { callGeminiAPI } = require('../services/geminiService');

// @route   POST /api/chatbot
// @desc    Interact with the chatbot
// @access  Private
router.post('/', auth, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        const prompt = `You are a supportive and friendly chatbot for a student wellness app. Your goal is to provide helpful and encouraging responses to students. Here is the student's message: "${message}"`;
        
        const aiResponse = await callGeminiAPI(prompt, 'You are a friendly and supportive chatbot.');
        
        res.json({ reply: aiResponse });

    } catch (err) {
        console.error("Chatbot Error:", err.message);
        res.status(500).send('Error interacting with the chatbot');
    }
});

module.exports = router;