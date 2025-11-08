const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const CommunityPost = require('../models/CommunityPost');
const { callGeminiAPI } = require('../services/geminiService');

const mockAIResponse = {
    insights: [
        {
            theme: "Exam Stress",
            summary: "A significant number of students are expressing high levels of stress related to upcoming final exams and project deadlines.",
            suggestion: "Host a series of 'de-stress' workshops focusing on time management and mindfulness techniques during the week leading up to finals."
        },
        {
            theme: "Social Isolation",
            summary: "Feelings of loneliness and difficulty making social connections appear to be a common concern, especially among first-year students.",
            suggestion: "Organize more frequent, low-pressure social mixers or study groups for first-year students to encourage peer connections."
        },
        {
            theme: "Career Anxiety",
            summary: "There is an underlying anxiety about future career prospects and securing internships after graduation.",
            suggestion: "Create a mentorship program connecting current students with alumni in their desired fields for guidance and networking."
        }
    ]
};

router.post('/generate', adminAuth, async (req, res) => {
    try {
        const recentPosts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50);
        const postContents = recentPosts.map(p => p.content).join('\n---\n');

        if (recentPosts.length < 5) { // Require a minimum number of posts
            return res.json(mockAIResponse);
        }
        
        const prompt = `
            Analyze the following set of anonymous student chat snippets from a peer support forum. The snippets are separated by '---'.
            Your task is to identify the top 3-4 recurring themes. 
            
            Your response MUST be a valid JSON object. Do not add any text or markdown formatting before or after the JSON object.
            The JSON object should have a single key "insights", which is an array of objects.
            Each object in the array must have three string keys:
            1. "theme": A short, 2-3 word title for the recurring topic (e.g., "Exam Stress").
            2. "summary": A one-sentence summary of the core issue students are discussing.
            3. "suggestion": A concrete, actionable step the university administration or wellness center could take to address this theme.

            Here are the snippets:
            ---
            ${postContents}
            ---
        `;
        
        try {
            const aiResponseString = await callGeminiAPI(prompt);
            
            // Attempt to parse the AI's response
            const parsedResponse = JSON.parse(aiResponseString);
            
            // Basic validation of the parsed structure
            if (!parsedResponse.insights || !Array.isArray(parsedResponse.insights)) {
                throw new Error("Invalid AI response structure: 'insights' array not found.");
            }
            
            res.json(parsedResponse);

        } catch (aiError) {
            console.error('AI generation or parsing error:', aiError.message);
            // Fallback to the mock response if AI fails or returns invalid data
            res.json(mockAIResponse);
        }
    } catch (dbError) {
        console.error('Database Error:', dbError.message);
        res.status(500).send('Server Error while fetching posts');
    }
});

module.exports = router;