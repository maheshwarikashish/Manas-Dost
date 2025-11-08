import React, { useState } from 'react';
import api from '../../../services/api';

const InsightsTab = () => {
    const [insightsData, setInsightsData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setInsightsData(null);
        setError('');
        try {
            const res = await api.post('/insights/generate');
            if (res.data && res.data.insights) {
                setInsightsData(res.data.insights);
            } else {
                setError('Received an unexpected data structure from the server.');
            }
        } catch (err) {
            console.error("Failed to generate insights", err);
            setError("Sorry, we couldn't generate insights at this time. Please try again later.");
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h3 className="text-3xl font-bold text-slate-800">AI-Powered Conversation Insights</h3>
            <p className="mt-2 text-md text-slate-600 max-w-3xl">
                Click the button to use AI to analyze the latest anonymous student chat logs. This process identifies key concerns and suggests actionable steps, all while protecting user privacy.
            </p>
            
            <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
                <button 
                    onClick={handleGenerateInsights}
                    disabled={isLoading}
                    className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : 'Generate New Insights'}
                </button>
                
                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg animate-fade-in">
                        <p className="font-semibold">An Error Occurred</p>
                        <p>{error}</p>
                    </div>
                )}

                {insightsData && (
                    <div className="mt-8 animate-fade-in">
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">Generated Report</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {insightsData.map((insight, index) => (
                                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col shadow-sm">
                                    <h5 className="text-lg font-bold text-purple-700">{insight.theme}</h5>
                                    <p className="text-slate-600 mt-2 flex-grow">{insight.summary}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <p className="text-sm font-semibold text-slate-800">Suggested Action:</p>
                                        <p className="text-sm text-slate-600 mt-1">{insight.suggestion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightsTab;