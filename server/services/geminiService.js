import { GoogleGenerativeAI } from '@google/generative-ai';

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
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction || 'You are a helpful and supportive assistant.'
        });

        // Generate content
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Gemini API Error:', error.message);
        throw new Error(`Failed to generate content: ${error.message}`);
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

export default {
    callGeminiAPI,
    generateContent
};
