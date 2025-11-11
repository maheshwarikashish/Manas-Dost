import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- SVG Icons ---
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const SpinnerIcon = ({ color = 'text-white' }) => <svg className={`animate-spin h-5 w-5 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

// --- Reusable Components ---
const Card = ({ children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-shadow hover:shadow-xl ${className}`}>
        {children}
    </div>
);

const ThemedButton = ({ onClick, disabled, children, theme, fullWidth = false }) => (
    <button 
        onClick={onClick} 
        disabled={disabled} 
        className={`font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${theme.bg} text-white ${fullWidth ? 'w-full' : ''} flex items-center justify-center`}
    >
        {children}
    </button>
);

// --- AI Goal Setter ---
const GoalSetter = ({ theme, onPlanGenerated }) => {
    const [goalInput, setGoalInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        if (!goalInput.trim()) {
            setError('Please enter a goal.');
            return;
        }
        setIsGenerating(true);
        setError('');
        try {
            const res = await api.post('/journeys/custom', { goal: goalInput });
            onPlanGenerated(res.data); // Pass the new plan up
            setGoalInput('');
        } catch (err) { 
            console.error("Failed to generate plan", err); 
            setError(err.response?.data || 'Could not generate a plan. Please try again.');
        }
        setIsGenerating(false);
    };

    return (
        <Card className="border-t-4 border-[#00A896]">
            <h4 className="text-xl font-bold text-gray-800">AI Goal Setter</h4>
            <p className="text-sm text-gray-500 mb-4 mt-1">Let our AI create a step-by-step plan for you.</p>
            <textarea 
                value={goalInput} 
                onChange={(e) => setGoalInput(e.target.value)} 
                className={`w-full p-3 border border-gray-300 rounded-lg h-24 bg-gray-50 outline-none transition focus:ring-2 ${theme.ring} ${theme.focusBorder}`}
                placeholder="e.g., 'I want to improve my sleep quality'"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <ThemedButton onClick={handleGeneratePlan} disabled={isGenerating} theme={theme} fullWidth={true}>
                {isGenerating ? <SpinnerIcon /> : 'Generate 7-Day Plan'}
            </ThemedButton>
        </Card>
    );
};

// --- Active Plan Display ---
const ActivePlan = ({ plan, theme, onUpdate, onClear }) => {
    if (!plan || !plan.tasks) return null;

    const handleCheckboxChange = (position) => {
        const updatedTasks = plan.tasks.map((task, index) => 
            index === position ? { ...task, completed: !task.completed } : task
        );
        onUpdate({ ...plan, tasks: updatedTasks });
    };

    return (
        <Card className="border-t-4 border-[#00A896] animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-xl font-bold text-gray-800">Your Active Plan</h4>
                    <p className={`font-semibold ${theme.text}`}>{plan.title}</p>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
                <button onClick={onClear} className="text-sm bg-red-100 text-red-600 font-semibold px-3 py-1 rounded-lg hover:bg-red-200 transition">
                    Clear
                </button>
            </div>
            <div className="mt-4 space-y-3">
                {plan.tasks.map((task, index) => (
                    <div key={index} className="flex items-center">
                        <button onClick={() => handleCheckboxChange(index)} className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${task.completed ? `${theme.bg} ${theme.border}` : 'border-gray-400'}`}>
                            {task.completed && <CheckIcon />}
                        </button>
                        <span className={`ml-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {task.task}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// --- Journal Summary Display ---
const JournalSummaryDisplay = ({ data, onReset, theme }) => {
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
        <div className="space-y-6 animate-fade-in">
            <div>
                <h5 className="font-bold text-gray-800">Your Daily Summary</h5>
                <p className="text-gray-600 mt-1">{data.summary}</p>
            </div>
            <div>
                <h5 className="font-bold text-gray-800">Personalized Tips</h5>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mt-2">
                    {data.tips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </div>
            <div>
                <h5 className="font-bold text-gray-800">Your Mood Trend</h5>
                <div className="h-48 mt-2">
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
            <button onClick={onReset} className={`mt-4 text-sm font-semibold hover:underline ${theme.text}`}>
                Start Fresh for a New Day
            </button>
        </div>
    );
};

// --- Daily AI Journal ---
const DailyAiJournal = ({ theme }) => {
    const [journalInput, setJournalInput] = useState('');
    const [journalSummary, setJournalSummary] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        const fetchTodayJournal = async () => {
            try {
                const res = await api.get('/journal/today');
                if (res.data && res.data.content) {
                    setJournalInput(res.data.content);
                }
            } catch (err) {
                console.error('Could not fetch today\'s journal', err);
            }
        };
        fetchTodayJournal();
    }, []);

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
        // You might want to also delete the entry on the backend
    };

    return (
        <Card className="border-t-4 border-[#FF9F43] flex flex-col">
            <h4 className="text-xl font-bold text-gray-800">Daily AI Journal</h4>
            <p className="text-sm text-gray-500 mb-4 mt-1">Write about your day. We'll analyze it for you.</p>
            
            {journalSummary ? (
                <JournalSummaryDisplay data={journalSummary} onReset={resetJournal} theme={theme} />
            ) : (
                <div className="flex flex-col flex-grow">
                    <textarea 
                        value={journalInput} 
                        onChange={(e) => setJournalInput(e.target.value)} 
                        className={`w-full p-3 border border-gray-300 rounded-lg flex-grow bg-gray-50 outline-none transition h-48 ${theme.ring} ${theme.focusBorder}`}
                        placeholder="Write about your day... your thoughts, feelings, and events."
                    />
                    <div className="flex items-center justify-between mt-3">
                        <button onClick={handleSaveEntry} disabled={isSaving} className="text-sm bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition">
                            {isSaving ? 'Saving...' : 'Save Entry'}
                        </button>
                        <ThemedButton onClick={handleAnalyzeDay} disabled={isSummarizing || !journalInput.trim()} theme={theme}>
                            {isSummarizing ? 'Analyzing...' : "Analyze My Day"}
                        </ThemedButton>
                    </div>
                </div>
            )}
        </Card>
    );
};


// --- Main ToolsTab Component ---
const ToolsTab = () => {
    const [activePlan, setActivePlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Changed initial state to false
    const [error, setError] = useState('');

    // In this setup, we don't need to load a plan initially, 
    // it's created and then held in state.
    // If you need to persist the active plan, you'd fetch it here.

    const handlePlanUpdate = async (updatedPlan) => {
        setActivePlan(updatedPlan);
        if (!updatedPlan.id.startsWith('custom-')) return; // Don't save predefined journeys here
        try {
            await api.put(`/journeys/${updatedPlan.id}`, { tasks: updatedPlan.tasks });
        } catch (err) {
            console.error("Failed to save plan progress", err);
            setError("Could not save your plan's progress.");
            // Optional: revert UI change
        }
    };

    const handleClearPlan = () => {
        // Here you might want to call an API to delete the plan from the backend
        setActivePlan(null);
    };

    const goalSetterTheme = { bg: 'bg-[#00A896]', text: 'text-[#00A896]', border: 'border-[#00A896]', ring: 'focus:ring-[#00A896]/50', focusBorder: 'focus:border-[#00A896]' };
    const journalTheme = { bg: 'bg-[#FF9F43]', text: 'text-[#FF9F43]', border: 'border-[#FF9F43]', ring: 'focus:ring-[#FF9F43]/50', focusBorder: 'focus:border-[#FF9F43]' };

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center"><SpinnerIcon color="text-[#00A896]" /></div>;
    }

    return (
        <div className="min-h-full bg-gray-50/50 p-4 sm:p-8 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                     <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                        AI-Powered Tools
                    </h3>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Your personal assistants for goal setting and self-reflection.</p>
                </div>

                {error && 
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg" role="alert">
                        <p className="font-bold">An Error Occurred</p>
                        <p>{error}</p>
                    </div>
                }

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    
                    {/* Column 1: Goal Setter / Active Plan */}
                    <div className="space-y-8">
                        {activePlan ? (
                            <ActivePlan plan={activePlan} theme={goalSetterTheme} onUpdate={handlePlanUpdate} onClear={handleClearPlan} />
                        ) : (
                            <GoalSetter theme={goalSetterTheme} onPlanGenerated={setActivePlan} />
                        )}
                    </div>

                    {/* Column 2: AI Journal */}
                    <div className="space-y-8">
                       <DailyAiJournal theme={journalTheme} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolsTab;
