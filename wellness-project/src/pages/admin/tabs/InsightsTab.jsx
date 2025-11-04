import React, { useState } from 'react';
import api from '../../../services/api'; // Use our central API service

const InsightsTab = () => {
    const [insights, setInsights] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // This function now calls our secure backend endpoint
    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setInsights('');
        try {
            const res = await api.post('/insights/generate');
            setInsights(res.data.summary);
        } catch (err) {
            console.error("Failed to generate insights", err);
            setInsights("Sorry, we couldn't generate insights at this time.");
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h3 className="text-3xl font-bold mb-4 text-slate-800">AI-Powered Conversation Insights</h3>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <p className="text-sm text-slate-500 mb-4 max-w-2xl">
                    Generate thematic summaries from the latest anonymous chat logs. This process uses AI to identify key student concerns while protecting user privacy.
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