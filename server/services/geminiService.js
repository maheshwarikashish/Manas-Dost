const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI client. It is crucial to do this once and reuse the client.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The user prompt
 * @param {string} systemInstruction - Optional system instruction
 * @returns {Promise<string>} - The AI response text
 */
const callGeminiAPI = async (prompt, systemInstruction = '') => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set in environment variables');
        }

        // --- [DEFINITIVE FIX] --- 
        // Get the generative model using the correct model name as requested.
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash', 
        });

        const result = await model.generateContent([
            { role: "system", parts: [{ text: systemInstruction || 'You are a helpful and supportive assistant.' }] },
            { role: "user", parts: [{ text: prompt }] },
        ]);

        const response = result.response;

        if (!response || !response.text) {
            console.error("Invalid response structure from Gemini API:", response);
            throw new Error('Received an invalid or empty response from the Gemini API.');
        }

        const text = response.text();
        return text;

    } catch (error) {
        console.error('--- GEMINI API SERVICE ERROR ---');
        console.error(`Timestamp: ${new Date().toISOString()}`);
        // Log the full error for better debugging, not just the message.
        console.error("Full Error Object:", error);
        console.error('--------------------------------');
        // Re-throw a more user-friendly error to be caught by the route handler.
        throw new Error(`Failed to generate content from AI. The API call failed.`);
    }
};

module.exports = { callGeminiAPI };
