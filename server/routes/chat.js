const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { callGeminiAPI } = require('../services/geminiService').default;

router.post('/', auth, async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        const systemInstruction = "You are Mitra, a compassionate and supportive AI wellness companion for college students. Your tone should be gentle, empathetic, and encouraging. Do not give medical advice. Instead, offer positive coping mechanisms, mindfulness exercises, or suggest talking to a professional. Keep your responses concise and easy to read.";

        // Call Gemini API directly
        const aiResponse = await callGeminiAPI(message, systemInstruction);

        // Return the AI's reply to the React frontend
        res.json({ reply: aiResponse });

    } catch (err) {
        console.error("Error communicating with AI service:", err.message);
        res.status(500).json({ msg: 'Error getting response from AI', error: err.message });
    }
});

module.exports = router;