import React, { useState } from 'react';
import { callGeminiAPI } from '../../../services/geminiAPI';
import { MOCK_CHAT_LOGS } from '../../../data/mockAdminData';

const InsightsTab = () => {
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setInsights('');
        const prompt = `Analyze the following set of anonymous student chat snippets. Identify the top 3-4 recurring themes and, for each theme, provide a one-sentence summary of the core issue. Do not quote directly. Present the output as a simple bulleted list. Snippets:\n\n${MOCK_CHAT_LOGS}`;
        const result = await callGeminiAPI(prompt);
        setInsights(result);
        setIsLoading(false);
    };

    return (
        <div>
            <h3 className="text-3xl font-bold mb-4 text-slate-800">AI-Powered Conversation Insights</h3>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <p className="text-sm text-slate-500 mb-4 max-w-2xl">
                    Gemini API generates thematic summaries from thousands of anonymous chat logs, protecting privacy while revealing key student concerns.
                </p>
                <button 
                    onClick={handleGenerateInsights}
                    disabled={isLoading}
                    className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-purple-700 transition disabled:bg-purple-400"
                >
                    {isLoading ? 'Generating...' : 'Generate New Summary'}
                </button>
                
                {insights && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border animate-fade-in">
                        <h4 className="font-bold text-lg mb-2">Summary of Recent Concerns:</h4>
                        <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: insights.replace(/\* (.*?)\n/g, '<li class="ml-4 mb-2">$1</li>').replace(/\n/g, '<br>') }} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightsTab;