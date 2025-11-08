import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- SVG Icons ---
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const SpinnerIcon = ({ color = 'text-white' }) => <svg className={`animate-spin h-5 w-5 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;


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


// --- Main ToolsTab Component ---
const ToolsTab = () => {
    const [activePlan, setActivePlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Use useCallback for functions to stabilize them
    const loadActivePlan = useCallback(async () => {
        setIsLoading(true);
        try {
            // Assuming a dedicated endpoint to get the *active* custom plan
            // If not available, you might need to manage this state on the client or adapt the backend
            // For now, we'll manage it in the parent component's state after generation.
        } catch (err) {
            console.error("Could not fetch active plan", err);
            setError("Couldn't load your plan. Please refresh.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadActivePlan();
    }, [loadActivePlan]);

    const handlePlanUpdate = async (updatedPlan) => {
        setActivePlan(updatedPlan);
        try {
            // This assumes a generic journey update endpoint works for custom plans too
            await api.put(`/journeys/${updatedPlan.id}`, { tasks: updatedPlan.tasks });
        } catch (err) {
            console.error("Failed to save plan progress", err);
            // Optional: add UI feedback for save failure
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
                     <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-800">
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
                            <GoalSetter theme={goalSetterT