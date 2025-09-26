import React, { useState } from 'react';
import { callGeminiAPI } from '../../services/geminiAPI';

// A simple component to safely render the AI's markdown checklist as JSX
const MarkdownChecklist = ({ text }) => {
    const items = text.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-'));
    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 rounded mr-3" />
                    <span>{item.replace(/(\* |-)/, '').trim()}</span>
                </div>
            ))}
        </div>
    );
};

const ToolsTab = () => {
    // State for AI Goal Setter
    const [goalInput, setGoalInput] = useState('');
    const [goalOutput, setGoalOutput] = useState('');
    const [isGeneratingGoal, setIsGeneratingGoal] = useState(false);

    // State for AI Journal Summary
    const [journalInput, setJournalInput] = useState('');
    const [journalOutput, setJournalOutput] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handleGeneratePlan = async () => {
        if (!goalInput) return;
        setIsGeneratingGoal(true);
        setGoalOutput('');
        const prompt = `Break down this task for a college student into a simple, actionable checklist: "${goalInput}"`;
        const result = await callGeminiAPI(prompt);
        setGoalOutput(result);
        setIsGeneratingGoal(false);
    };

    const handleSummarizeJournal = async () => {
        if (!journalInput) return;
        setIsSummarizing(true);
        setJournalOutput('');
        const prompt = `Analyze these journal entries from a college student and provide a gentle, high-level summary of emotional trends. Do not quote directly. Entries: "${journalInput}"`;
        const result = await callGeminiAPI(prompt);
        setJournalOutput(result);
        setIsSummarizing(false);
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">AI-Powered Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Goal Setter Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-bold">AI Goal Setter</h4>
                    <p className="text-sm text-gray-500 mb-4">Break down big tasks into small, manageable steps.</p>
                    <textarea
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        className="w-full p-2 border rounded-lg h-24"
                        placeholder="e.g., I need to prepare for my history final exam..."
                    ></textarea>
                    <button
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingGoal}
                        className="mt-2 bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg disabled:bg-blue-400"
                    >
                        {isGeneratingGoal ? 'Generating...' : 'Generate Plan'}
                    </button>
                    {goalOutput && (
                        <div className="mt-4 prose prose-sm max-w-none">
                           <MarkdownChecklist text={goalOutput} />
                        </div>
                    )}
                </div>

                {/* AI Journal Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-bold">AI Journal Summary</h4>
                    <p className="text-sm text-gray-500 mb-4">Write in your private journal, then let AI find the patterns.</p>
                    <textarea
                        value={journalInput}
                        onChange={(e) => setJournalInput(e.target.value)}
                        className="w-full p-2 border rounded-lg h-24"
                        placeholder="Write about your day..."
                    ></textarea>
                    <button
                        onClick={handleSummarizeJournal}
                        disabled={isSummarizing}
                        className="mt-2 bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg disabled:bg-purple-400"
                    >
                        {isSummarizing ? 'Summarizing...' : 'Summarize My Week'}
                    </button>
                    {journalOutput && (
                        <div className="mt-4 prose prose-sm max-w-none">
                            <p>{journalOutput}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolsTab;