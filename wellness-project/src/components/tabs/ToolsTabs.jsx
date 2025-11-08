import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- SVG Icons ---

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const SpinnerIcon = ({ color = 'text-white' }) => <svg className={`animate-spin h-5 w-5 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- Sub-component for the Goal Setter checklist ---

const MarkdownChecklist = ({ text, themeColor, checkedState, onCheckboxChange }) => {
    const items = text.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-'));

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <button onClick={() => onCheckboxChange(index)} className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${checkedState[index] ? `${themeColor.bg} ${themeColor.border}` : 'border-gray-300'}`}>

                        {checkedState[index] && <CheckIcon />}
                    </button>
                    <span className={`ml-3 ${checkedState[index] ? 'line-through text-gray-400' : 'text-gray-700'}`}>

                        {item.replace(/(\* |-)/, '').trim()}
                    </span>
                </div>
            ))}
        </div>
    );
};

// --- Sub-component for the Journal Summary ---

const JournalSummaryDisplay = ({ data }) => {
    const chartData = {
        labels: data.chartData.map(d => d.day),
        datasets: [{

            label: 'Mood Trend',
            data: data.chartData.map(d => d.mood),
            backgroundColor: data.chartData.map(d => {
                if (d.mood <= 2) return '#FF6B6B'; // Coral
                if (d.mood === 3) return '#FF9F43'; // Orange
                return '#00A896'; // Teal
            }),
            borderRadius: 6,
        }]
    };
    const chartOptions = {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 5, grid: { drawBorder: false }, ticks: { stepSize: 1 } }, x: { grid: { display: false } } }
    };
    return (
        <div className="space-y-6">
            <div>
                <h5 className="font-bold text-[#2C3E50]">Your Daily Summary</h5>
                <p className="text-gray-600 mt-1">{data.summary}</p>
            </div>
            <div>
                <h5 className="font-bold text-[#2C3E50]">Personalized Tips</h5>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">

                    {data.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </div>
            <div>
                <h5 className="font-bold text-[#2C3E50]">Your Mood Trend</h5>
                <div className="h-48 mt-2">

                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
        </div>
    );
};

// --- Main ToolsTab Component ---

const ToolsTab = () => {
    const [savedPlan, setSavedPlan] = useState(null);
    const [goalInput, setGoalInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [journalInput, setJournalInput] = useState('');
    const [journalSummary, setJournalSummary] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [planCheckedState, setPlanCheckedState] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [planRes, journalRes] = await Promise.all([
                    api.get('/tools/goal-plan'),
                    api.get('/journal/today')
                ]);
                if (planRes.data && planRes.data.plan) {
                    setSavedPlan(planRes.data);
                    setPlanCheckedState(new Array(planRes.data.plan.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-')).length).fill(false));
                }
                if (journalRes.data && journalRes.data.content) setJournalInput(journalRes.data.content);
            } catch (err) {
                console.error("Could not fetch initial tool data", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleGeneratePlan = async () => {
        if (!goalInput) return;
        setIsGenerating(true);
        try {
            const res = await api.post('/tools/goal-setter', { goal: goalInput });
            setSavedPlan(res.data);
            setPlanCheckedState(new Array(res.data.plan.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-')).length).fill(false));
        } catch (err) { console.error("Failed to generate plan", err); }
        setIsGenerating(false);
        setGoalInput('');
    };

    const handleClearPlan = async () => {
        try {
            await api.delete('/tools/goal-plan');
            setSavedPlan(null);
            setPlanCheckedState([]);
        } catch (err) { console.error("Failed to clear plan", err); }
    };

    const handleSaveEntry = async () => {
        if (!journalInput.trim()) return;
        setIsSaving(true);
        try { 
            await api.post('/journal', { content: journalInput }); 
        } finally { 
            setIsSaving(false); 
        }
    };

    const handleAnalyzeDay = async () => {
        setIsSummarizing(true);
        setJournalSummary(null);
        try {
            const res = await api.post('/tools/journal-summary'); 
            setJournalSummary(res.data);
        } catch (err) {
            console.error("Failed to summarize journal", err);
            alert(err.response?.data?.msg || "Could not generate summary.");
        }
        setIsSummarizing(false);
    };

    const resetJournal = () => {
        setJournalSummary(null);
        setJournalInput('');
    };

    const handlePlanCheckboxChange = (position) => {
        const updatedCheckedState = planCheckedState.map((item, index) => index === position ? !item : item);
        setPlanCheckedState(updatedCheckedState);
        // Here you can also add an API call to save the checkbox state to the backend
    };

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center"><SpinnerIcon color="text-[#00A896]" /></div>;
    }

    const goalSetterTheme = { bg: 'bg-[#00A896]', text: 'text-[#00A896]', border: 'border-[#00A896]', ring: 'focus:ring-[#00A896]/50', focusBorder: 'focus:border-[#00A896]' };
    const journalTheme = { bg: 'bg-[#FF9F43]', text: 'text-[#FF9F43]', border: 'border-[#FF9F43]', ring: 'focus:ring-[#FF9F43]/50', focusBorder: 'focus:border-[#FF9F43]' };

    return (
        <div className="min-h-full p-8 md:p-12">
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] bg-clip-text text-transparent">

                AI-Powered Tools
            </h3>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">Your personal assistants for goal setting and self-reflection.</p>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- AI Goal Setter Card --- */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#00A896]">

                    {savedPlan ? (
                        <div className="animate-fade-in">

                            <h4 className="text-xl font-bold text-[#2C3E50]">Your Active Plan: <span className={goalSetterTheme.text}>{savedPlan.goal}</span></h4>
                            <div className="mt-4">

                                <MarkdownChecklist text={savedPlan.plan} themeColor={goalSetterTheme} checkedState={planCheckedState} onCheckboxChange={handlePlanCheckboxChange} />
                            </div>
                            <button onClick={handleClearPlan} className="mt-6 text-sm bg-[#FF6B6B]/10 text-[#FF6B6B] font-semibold px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/20 transition">

                                Clear Plan & Start New
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-xl font-bold text-[#2C3E50]">AI Goal Setter</h4>
                            <p className="text-sm text-gray-500 mb-4 mt-1">Break down big goals into small, manageable steps.</p>
                            <textarea value={goalInput} onChange={(e) => setGoalInput(e.target.value)} className={`w-full p-3 border border-gray-300 rounded-lg h-24 bg-gray-50 outline-none transition ${goalSetterTheme.ring} ${goalSetterTheme.focusBorder}`} placeholder="e.g., I need to prepare for my history final exam..."></textarea>
                            <button onClick={handleGeneratePlan} disabled={isGenerating} className={`w-full mt-2 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 ${goalSetterTheme.bg}`}>

                                {isGenerating ? <SpinnerIcon /> : 'Generate Plan'}
                            </button>
                        </div>
                    )}
                </div>

                {/* --- AI Journal Summary Card --- */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#FF9F43] flex flex-col">

                    <h4 className="text-xl font-bold text-[#2C3E50]">Daily AI Journal</h4>
                    <p className="text-sm text-gray-500 mb-4 mt-1">Write about your day. When you're ready, we'll analyze it for you.</p>
                    
                    {journalSummary ? (
                        <div className="animate-fade-in">

                           <JournalSummaryDisplay data={journalSummary} />
                           <button onClick={resetJournal} className={`mt-6 text-sm font-semibold hover:underline ${journalTheme.text}`}>

                                Start Fresh for a New Day
                           </button>
                        </div>
                    ) : (
                        <div className="flex flex-col flex-grow">

                            <textarea value={journalInput} onChange={(e) => setJournalInput(e.target.value)} className={`w-full p-3 border border-gray-300 rounded-lg flex-grow bg-gray-50 outline-none transition ${journalTheme.ring} ${journalTheme.focusBorder}`} placeholder="Write about your day... your thoughts, feelings, and events."></textarea>
                            <div className="flex items-center justify-between mt-2">

                                <button onClick={handleSaveEntry} disabled={isSaving} className="text-sm bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition">

                                    {isSaving ? 'Saving...' : 'Save Entry'}
                                </button>
                                <button onClick={handleAnalyzeDay} disabled={isSummarizing || !journalInput.trim()} className={`font-semibold px-4 py-2 rounded-lg text-white transition-all shadow-md hover:shadow-lg disabled:opacity-70 ${journalTheme.bg}`}>

                                    {isSummarizing ? 'Analyzing...' : "Analyze My Day"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolsTab;
