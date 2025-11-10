
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
            setError("Could not load journeys. Please try refreshing the page.");
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
                if (newCount > 1) {
                    showFeedback(`Amazing work! That's ${newCount} tasks today!`);
                } else {
                    showFeedback('Great job! Keep the momentum going!');
                }
            } else {
                setTasksCompletedToday(Math.max(0, tasksCompletedToday - 1));
            }
        } catch (err) {
            console.error("Failed to save progress", err);
            setCurrentJourney(currentJourney);
            alert("Could not save your progress. Please check your connection and try again.");
        }
    };

    if (view === 'display') {
        return (
            <div className="animate-fade-in p-4 sm:p-6 md:p-8 lg:p-12 min-h-full bg-white relative">
                {feedbackMessage && (
                    <div className="absolute top-5 right-5 bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-lg animate-bounce-in">
                        {feedbackMessage}
                    </div>
                )}
                <button 
                    onClick={() => { setView('selection'); fetchJourneys(); }}
                    className="flex items-center text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-200 transition-all mb-6 md:mb-8"
                >
                    <ArrowLeftIcon />
                    Back to All Journeys
                </button>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${currentJourney.theme.colors.text}`}>{currentJourney.title}</h1>
                <p className="text-gray-600 text-base mt-3 max-w-2xl">{currentJourney.description}</p>
                <div className="mt-6 md:mt-8 space-y-3">
                    {currentJourney.tasks.map((item, index) => (
                        <div key={item._id || index} className="flex items-center space-x-4 p-3 sm:p-4 rounded-lg bg-gray-50 border border-gray-100">
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
        );
    }

    return (
        <div className="min-h-full p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                 <div className="text-center">
                     <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-800">
                        Wellness Journeys
                    </h3>
                    <p className="mt-3 text-base sm:text-lg text-gray-600">Choose a guided path or create your own to achieve your wellness goals.</p>
                </div>
                
                <div className="mt-8 md:mt-10 bg-white rounded-2xl shadow-md border border-gray-200">
                    {isFetching ? (
                        <p className="py-10 text-center text-gray-500">Loading journeys...</p>
                    ) : error ? (
                        <p className="py-10 text-center text-red-500">{error}</p>
                    ) : (
                        <div>
                            {Object.keys(journeys).map(id => {
                                const journey = journeys[id];
                                const themeKey = journey.isCustom ? 'custom' : journey.journeyId;
                                const theme = journeyThemes[themeKey] || journeyThemes.custom;
                                const completedTasks = journey.tasks.filter(t => t.completed).length;
                                const progress = journey.tasks.length > 0 ? (completedTasks / journey.tasks.length) * 100 : 0;
                                
                                return (
                                    <div key={id} className="w-full text-left flex items-center p-4 sm:p-5 border-b border-gray-200 group transition-colors">
                                        <button onClick={() => handleSelectJourney(id)} className="flex-grow flex items-center min-w-0">
                                            <div className={`mr-4 sm:mr-5 ${theme.colors.text}`}>{theme.icon}</div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-black truncate pr-2">{journey.title}</h4>
                                                <p className="text-sm text-gray-500 mt-1 hidden md:block">{journey.description}</p>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                    <div className={`${theme.colors.bg} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                            <ChevronRightIcon />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteJourney(id);
                                            }}
                                            className="ml-2 sm:ml-4 p-2 rounded-full hover:bg-gray-200 flex-shrink-0"
                                            aria-label="Delete journey"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="p-4 sm:p-5 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className={`mr-4 sm:mr-5 text-purple-500`}><SparklesIcon /></div>
                            <div className="flex-grow">
                                <h4 className="text-base sm:text-lg font-bold text-gray-900">Customize Your Own</h4>
                                <p className="text-sm text-gray-500 mt-1">Tell our AI your goal for a personalized plan.</p>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
                                    <input 
                                        type="text" 
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition bg-white text-sm" 
                                        placeholder="e.g., 'Be more focused'"
                                    />
                                    <button 
                                        onClick={handleGenerateCustom} 
                                        disabled={isGenerating}
                                        className="bg-purple-500 text-white font-semibold px-4 py-2 rounded-lg disabled:bg-purple-300 transition-colors flex-shrink-0 shadow-sm hover:shadow-md"
                                    >
                                        {isGenerating ? <SpinnerIcon /> : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneysTab;
