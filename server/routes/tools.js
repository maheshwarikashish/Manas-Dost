const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
// --- [DEFINITIVE IMPORT FIX] --- 
// Correcting the import to match the fix in journeys.js and chat.js
const geminiService = require('../services/geminiService');
const callGeminiAPI = geminiService.default.callGeminiAPI;
const User = require('../models/User');
const JournalEntry = require('../models/JournalEntry');

// --- This route saves the generated plan to the user's profile ---
router.post('/goal-setter', auth, async (req, res) => {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ msg: 'Goal text is required' });
    
    try {
        const prompt = `Act as a helpful and encouraging academic coach. A college student needs help breaking down a large goal. The student's goal is: "${goal}". Create a short, actionable plan with a maximum of 5 steps. Each step should be a clear, manageable task. The tone should be positive and motivating. Format the response as a simple markdown bulleted list.`;
        const aiResponse = await callGeminiAPI(prompt);

        const newPlan = {
            goal: goal,
            plan: aiResponse,
            createdAt: new Date(),
        };
        await User.findByIdAndUpdate(req.user.id, { activeGoalPlan: newPlan });

        res.json(newPlan);
    } catch (err) {
        console.error("Goal-setter error:", err.message);
        res.status(500).send('Error generating plan');
    }
});

// --- This route now fetches data from the DB to analyze ---
router.post('/journal-summary', auth, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const entries = await JournalEntry.find({ 
            user: req.user.id,
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        if (entries.length === 0) {
            return res.status(200).json({ summary: "Not enough journal entries to create a summary. Write a few more entries to get your first summary!", tips: [], chartData: [] });
        }
        
        const entriesText = entries.map(e => `On ${e.date.toDateString()}: ${e.content}`).join('\n');
        
        const prompt = `
            Act as a compassionate wellness analyst. Analyze the following journal entries from a college student.
            Your task is to provide a structured analysis in JSON format.
            The JSON object must have three keys:
            1. "summary": A gentle, high-level summary (2-3 sentences) of the main emotional themes.
            2. "tips": An array of 2-3 short, actionable, and positive tips based on the identified themes.
            3. "chartData": An array of objects, where each object represents a day. Each object must have a "day" (e.g., "Mon", "Tue") and a "mood" (a number from 1 for very negative to 5 for very positive).

            Here are the student's entries:
            "${entriesText}"
        `;
        
        const aiResponseText = await callGeminiAPI(prompt);
        
        try {
            const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)\s*```/);
            const jsonString = jsonMatch ? jsonMatch[1].trim() : aiResponseText.trim();
            const structuredResponse = JSON.parse(jsonString);
            res.json(structuredResponse);
        } catch (parseError) {
            console.error("Failed to parse JSON from AI response:", aiResponseText);
            throw new Error("AI returned an invalid JSON format.");
        }

    } catch (err) {
        console.error("Error generating journal summary:", err.message);
        res.status(500).send('Error generating summary. The AI may be temporarily unavailable.');
    }
});


// --- These routes allow the frontend to get and clear a saved plan ---
router.get('/goal-plan', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('activeGoalPlan');
        res.json(user.activeGoalPlan || { goal: '', plan: '', createdAt: null });
    } catch (err) {
        console.error("Error fetching plan:", err.message);
        res.status(500).send('Error fetching plan');
    }
});

router.delete('/goal-plan', auth, async (req, res) => {
    try {
        const emptyPlan = { goal: '', plan: '', createdAt: null };
        await User.findByIdAndUpdate(req.user.id, { activeGoalPlan: emptyPlan });
        res.json({ msg: 'Plan cleared successfully' });
    } catch (err) {
        console.error("Error clearing plan:", err.message);
        res.status(500).send('Error clearing plan');
    }
});

module.exports = router;
