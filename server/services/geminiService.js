const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
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

        // Get the generative model
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash', // Using a reliable and fast model
            systemInstruction: systemInstruction || 'You are a helpful and supportive assistant.'
        });

        // Generate content
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        // Ensure response is valid before getting text
        if (!response) {
            throw new Error('Received an empty response from the Gemini API.');
        }

        const text = response.text();
        return text;

    } catch (error) {
        console.error('--- GEMINI API SERVICE ERROR ---');
        console.error(`Error calling Gemini API: ${error.message}`);
        console.error(`Prompt that caused error: ${prompt}`);
        console.error('--------------------------------');
        // Throw a new error to be caught by the route handler
        throw new Error(`Failed to generate content from AI. Please check server logs for details.`);
    }
};

/**
 * Generate content (alias for callGeminiAPI for backwards compatibility)
 * @param {string} prompt - The user prompt
 * @param {string} systemInstruction - Optional system instruction
 * @returns {Promise<string>} - The AI response text
 */
const generateContent = async (prompt, systemInstruction = '') => {
    return callGeminiAPI(prompt, systemInstruction);
};

// Use CommonJS export
module.exports = {
    callGeminiAPI,
    generateContent
};
