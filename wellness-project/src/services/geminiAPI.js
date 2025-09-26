// WARNING: Do NOT expose your API key on the client-side in a real application.
// This should be handled by a backend server to keep it secure.
const API_KEY = "YOUR_API_KEY_HERE";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

export const callGeminiAPI = async (prompt, systemInstruction = "") => {
    // ... logic from your callGeminiAPI function ...
    try {
        // ... fetch logic ...
    } catch (error) {
        return "Error connecting to AI.";
    }
};