import {generateContent} from './services/geminiService'

// Test the Gemini integration
async function testGemini() {
    try {
        console.log('Testing Gemini API integration...');
        
        const testMessage = "Hello, I'm feeling stressed about my exams. Can you help me?";
        const systemInstruction = "You are Mitra, a compassionate and supportive AI wellness companion for college students.";
        
        const response = await generateContent(testMessage, systemInstruction);
        console.log('Gemini Response:', response);
        console.log('✅ Gemini API integration is working!');
        
    } catch (error) {
        console.error('❌ Error testing Gemini API:', error.message);
        console.log('Make sure to set your GEMINI_API_KEY in the .env file');
    }
}

testGemini();
