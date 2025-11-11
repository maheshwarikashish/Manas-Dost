import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// --- SVG Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const CalmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM18.75 12h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5z" /></svg>;
const DietIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 0a6 6 0 00-6 6h12a6 6 0 00-6-6z" /></svg>;
const ExerciseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 1.5a.75.75 0 01.75.75V3a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 5.636a.75.75 0 011.06 0l.66.67a.75.75 0 01-1.06 1.06l-.66-.67a.75.75 0 010-1.06zM2.25 12a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm3.386 7.424a.75.75 0 01-1.06 0l-.66-.67a.75.75 0 011.06-1.06l.66.67a.75.75 0 010 1.06zM12 22.5a.75.75 0 01-.75-.75v-.75a.75.75 0 011.5 0v.75a.75.75 0 01-.75-.75zm7.424-3.386a.75.75 0 01-1.06 0l-.66-.67a.75.75 0 011.06-1.06l.66.67a.75.75 0 010 1.06zM21.75 12a.75.75 0 01-.75.75h-.75a.75.75 0 010-1.5h.75a.75.75 0 01.75.75zm-3.386-7.424a.75.75 0 011.06 0l.66.67a.75.75 0 01-1.06 1.06l-.66-.67a.75.75 0 010-1.06z" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const journeyThemes = {
    anxiety: { colors: { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500' }, icon: <CalmIcon /> },
    diet: { colors: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' }, icon: <DietIcon /> },
    exercise: { colors: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' }, icon: <ExerciseIcon /> },
    custom: { colors: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' }, icon: <SparklesIcon /> },
};

const JourneysTab = () => {
    const [view, setView] = useState('selection');
    const [journeys, setJourneys] = useState({});
    const [currentJourney, setCurrentJourney] = useState(null);
    const [customInput, setCustomInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [tasksCompletedToday, setTasksCompletedToday] = useState(0);

    const fetchJourneys = useCallback(async () => {
        try {
            setIsFetching(true);
            const res = await api.get('/journeys');
            setJourneys(res.data);
            setError('');
        } catch (err) { 
            console.error("Failed to fetch journeys", err); 
            setError("Could not load journeys. Please try refreshing.");
        }
        finally { setIsFetching(false); }
    }, []);

    useEffect(() => {
        fetchJourneys();
    }, [fetchJourneys]);

    const showFeedback = (message) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const handleSelectJourney = (journeyId) => {
        const journeyData = journeys[journeyId];
        const themeKey = journeyData.isCustom ? 'custom' : journeyData.journeyId;
        setCurrentJourney({
            ...journeyData,
            theme: journeyThemes[themeKey] || journeyThemes.custom
        });
        setView('display');
    };    
    
    const handleGenerateCustom = async () => {
        if (!customInput) return;
        setIsGenerating(true);
        setError('');
        try {
            const res = await api.post('/journeys/custom', { goal: customInput });
            const newJourney = res.data;
            setJourneys(prev => ({ ...prev, [newJourney._id]: newJourney }));
            handleSelectJourney(newJourney._id);
        } catch (err) { 
            alert("Sorry, could not generate a custom plan. Our AI may be busy. Please try again later."); 
        }
        finally {
            setIsGenerating(false);
            setCustomInput('');
        }
    };

    const handleDeleteJourney = async (journeyIdToDelete) => {
        if (!window.confirm('Are you sure you want to delete this journey? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/journeys/${journeyIdToDelete}`);
            setJourneys(prevJourneys => {
                const newJourneys = { ...prevJourneys };
                delete newJourneys[journeyIdToDelete];
                return newJourneys;
            });
            showFeedback('Journey deleted successfully!');
        } catch (err) {
            console.error("Failed to delete journey", err);
            setError('Could not delete the journey. Please try again.');
        }
    };

    const handleToggleTask = async (taskIndex) => {
        if (!currentJourney) return;
        const wasCompleted = currentJourney.tasks[taskIndex].completed;
        const updatedTasks = currentJourney.tasks.map((task, index) => 
            index === taskIndex ? { ...task, completed: !task.completed } : task
        );
        const updatedJourney = { ...currentJourney, tasks: updatedTasks };
        setCurrentJourney(updatedJourney);

        try {
            const res = await api.put(`/journeys/${currentJourney._id}`, { tasks: updatedTasks });
            setJourneys(prev => ({ ...prev, [currentJourney._id]: res.data }));
            if (!wasCompleted) {
                const newCount = tasksCompletedToday + 1;
                setTasksCompletedToday(newCount);
                showFeedback(newCount > 1 ? `Awesome! That's ${newCount} tasks today!` : 'Great start! Keep it up!');
            } else {
                setTasksCompletedToday(Math.max(0, tasksCompletedToday - 1));
            }
        } catch (err) {
            console.error("Failed to save progress", err);
            setCurrentJourney(currentJourney); // Revert optimistic update on failure
            alert("Could not save your progress. Please check your connection and try again.");
        }
    };

    // --- Display View for a Single Journey ---
    if (view === 'display') {
        return (
            <div className="animate-fade-in w-full max-w-7xl mx-auto">
                {feedbackMessage && (
                    <div className="fixed top-20 right-5 bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg animate-bounce-in z-50">
                        {feedbackMessage}
                    </div>
                )}
                <button 
                    onClick={() => { setView('selection'); fetchJourneys(); }}
                    className="flex items-center text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-200 transition-all mb-6"
                >
                    <ArrowLeftIcon />
                    Back to All Journeys
                </button>
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                    <h1 className={`text-2xl sm:text-3xl font-bold ${currentJourney.theme.colors.text}`}>{currentJourney.title}</h1>
                    <p className="text-gray-600 mt-2 max-w-2xl">{currentJourney.description}</p>
                    <div className="mt-6 space-y-3">
                        {currentJourney.tasks.map((item, index) => (
                            <div key={item._id || index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                <button onClick={() => handleToggleTask(index)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 
                                    ${item.completed ? `${currentJourney.theme.colors.bg} ${currentJourney.theme.colors.border}` : 'border-gray-300'}`}>
                                    {item.completed && <CheckIcon />}
                                </button>
                                <span className={`font-medium text-sm sm:text-base ${item.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                                    {item.task}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- Selection View for All Journeys ---
    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
             <div className="text-left sm:text-center mb-8">
             <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                Wellness Journeys
            </h3>
                <p className="mt-2 text-base text-gray-600">Choose a guided path or create your own to achieve your wellness goals.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {isFetching ? (
                    <p className="py-12 text-center text-gray-500">Loading journeys...</p>
                ) : error ? (
                    <p className="py-12 text-center text-red-500">{error}</p>
                ) : (
                    <div>
                        {Object.keys(journeys).map((id, index) => {
                            const journey = journeys[id];
                            const themeKey = journey.isCustom ? 'custom' : journey.journeyId;
                            const theme = journeyThemes[themeKey] || journeyThemes.custom;
                            const completedTasks = journey.tasks.filter(t => t.completed).length;
                            const progress = journey.tasks.length > 0 ? (completedTasks / journey.tasks.length) * 100 : 0;
                            
                            return (
                                <div key={id} className={`w-full text-left flex items-center p-4 group transition-colors ${index === Object.keys(journeys).length - 1 ? '' : 'border-b border-gray-200'}`}>
                                    <button onClick={() => handleSelectJourney(id)} className="flex-grow flex items-center min-w-0">
                                        <div className={`mr-4 ${theme.colors.text}`}>{theme.icon}</div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-base font-bold text-gray-900 group-hover:text-black truncate pr-2">{journey.title}</h4>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div className={`${theme.colors.bg} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="ml-2 text-gray-400 group-hover:text-gray-600"><ChevronRightIcon /></div>
                                    </button>
                                    {journey.isCustom && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteJourney(id); }}
                                            className="ml-2 p-2 rounded-full hover:bg-red-100 flex-shrink-0"
                                            aria-label="Delete journey"
                                        >
                                            <TrashIcon />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="p-4 bg-gray-50/70">
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className={`mr-4 text-purple-500 mb-2 sm:mb-0`}><SparklesIcon /></div>
                        <div className="flex-grow w-full">
                            <h4 className="text-base font-bold text-gray-900">Customize Your Own</h4>
                            <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-2">
                                <input 
                                    type="text" 
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition bg-white text-sm" 
                                    placeholder="e.g., 'Feel more energized'"
                                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateCustom()}
                                />
                                <button 
                                    onClick={handleGenerateCustom} 
                                    disabled={isGenerating || !customInput}
                                    className="bg-purple-500 text-white font-semibold px-5 py-2 rounded-md disabled:bg-purple-300 transition-colors flex-shrink-0 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                                >
                                    {isGenerating ? <SpinnerIcon /> : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneysTab;
