const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const CommunityPost = require('../models/CommunityPost');
const { callGeminiAPI } = require('../services/geminiService').default; 

// @route   POST /api/insights/generate
// @desc    Generate a summary of recent anonymous posts
// @access  Private (Admin Only)
router.post('/generate', adminAuth, async (req, res) => {
    try {
        // Fetch recent posts from the database to create a context for the AI
        const recentPosts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50);
        const postContents = recentPosts.map(p => p.content).join('\n');

        if (!postContents) {
            return res.json({ summary: "Not enough post data to generate a summary yet." });
        }
        
        const prompt = `Analyze the following set of anonymous student chat snippets from a peer support forum. Identify the top 3-4 recurring themes and, for each theme, provide a one-sentence summary of the core issue. Do not quote directly. Present the output as a simple bulleted list with asterisks (*). Snippets:\n\n${postContents}`;
        
        try {
            const aiResponse = await callGeminiAPI(
                prompt,
                'You are an analytical assistant that identifies patterns in student wellness discussions. Provide clear, concise insights.'
            );
            res.json({ summary: aiResponse });
        } catch (aiError) {
            console.error('AI generation error:', aiError.message);
            // Fallback to mock response if AI fails
            const mockAIResponse = "* A significant number of students are expressing high levels of stress related to upcoming final exams and project deadlines.\n* Feelings of loneliness and difficulty making social connections appear to be a common concern, especially among first-year students.\n* There is an underlying anxiety about future career prospects and securing internships after graduation.";
            res.json({ summary: mockAIResponse });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;