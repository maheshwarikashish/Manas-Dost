import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// --- SVG Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const CalmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM18.75 12h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5z" /></svg>;
const DietIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 0a6 6 0 00-6 6h12a6 6 0 00-6-6z" /></svg>;
const ExerciseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 1.5a.75.75 0 01.75.75V3a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 5.636a.75.75 0 011.06 0l.66.67a.75.75 0 01-1.06 1.06l-.66-.67a.75.75 0 010-1.06zM2.25 12a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm3.386 7.424a.75.75 0 01-1.06 0l-.66-.67a.75.75 0 011.06-1.06l.66.67a.75.75 0 010 1.06zM12 22.5a.75.75 0 01-.75-.75v-.75a.75.75 0 011.5 0v.75a.75.75 0 01-.75.75zm7.424-3.386a.75.75 0 01-1.06 0l-.66-.67a.75.75 0 011.06-1.06l.66.67a.75.75 0 010 1.06zM21.75 12a.75.75 0 01-.75.75h-.75a.75.75 0 010-1.5h.75a.75.75 0 01.75.75zm-3.386-7.424a.75.75 0 011.06 0l.66.67a.75.75 0 01-1.06 1.06l-.66-.67a.75.75 0 010-1.06z" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const journeyThemes = {
    anxiety: { colors: { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500' }, icon: <CalmIcon /> },
    diet: { colors: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' }, icon: <DietIcon /> },
    exercise: { colors: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' }, icon: <ExerciseIcon /> },
};

const JourneysTab = () => {
    const [view, setView] = useState('selection');
    const [journeys, setJourneys] = useState({});
    const [currentJourney, setCurrentJourney] = useState(null);
    const [customInput, setCustomInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState('');

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

    const handleSelectJourney = (journeyKey) => {
        const journeyData = journeys[journeyKey];
        setCurrentJourney({
            ...journeyData,
            theme: journeyThemes[journeyKey] || { colors: { bg: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500' } }
        });
        setView('display');
    };    
    
    const handleGenerateCustom = async () => {
        if (!customInput) return;
        setIsGenerating(true);
        setError('');
        try {
            const res = await api.post('/journeys/custom', { goal: customInput });
            setCurrentJourney({
                ...res.data,
                theme: { colors: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500' } }
            });
            setView('display');
        } catch (err) { 
            alert("Sorry, could not generate a custom plan. Our AI may be busy. Please try again later."); 
        }
        finally {
            setIsGenerating(false);
        }
    };

    const handleToggleTask = async (taskIndex) => {
        if (!currentJourney) return;

        // Optimistic UI update
        const updatedTasks = currentJourney.tasks.map((task, index) => 
            index === taskIndex ? { ...task, completed: !task.completed } : task
        );
        const updatedJourney = { ...currentJourney, tasks: updatedTasks };
        setCurrentJourney(updatedJourney);

        try {
            await api.put(`/journeys/${currentJourney.id}`, { tasks: updatedTasks });
            // On successful save, we can also refetch the main journey list to ensure consistency
            const newJourneys = { ...journeys, [currentJourney.id]: updatedJourney };
            setJourneys(newJourneys);
        } catch (err) {
            console.error("Failed to save progress", err);
            // Revert the state if the API call fails
            setCurrentJourney(currentJourney);
            alert("Could not save your progress. Please check your connection and try again.");
        }
    };

    if (view === 'display') {
        return (
            <div className="animate-fade-in p-6 sm:p-8 md:p-12 min-h-full bg-white">
                <button 
                    onClick={() => setView('selection')} 
                    className="flex items-center text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-200 transition-all mb-8"
                >
                    <ArrowLeftIcon />
                    Back to All Journeys
                </button>
                <h1 className={`text-3xl md:text-4xl font-bold ${currentJourney.theme.colors.text}`}>{currentJourney.title}</h1>
                <p className="text-gray-600 text-base md:text-lg mt-3 max-w-2xl">{currentJourney.description}</p>
                <div className="mt-8 space-y-3">
                    {currentJourney.tasks.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <button onClick={() => handleToggleTask(index)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 
                                ${item.completed ? `${currentJourney.theme.colors.bg} ${currentJourney.theme.colors.border}` : 'border-gray-300'}`}>
                                {item.completed && <CheckIcon />}
                            </button>
                            <span className={`font-medium text-base ${item.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                                {item.task}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full p-6 sm:p-8 md:p-12 bg-gray-50/50">
            <div className="max-w-4xl mx-auto">
                 <div className="text-center">
                     <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-800">
                        Wellness Journeys
                    </h3>
                    <p className="mt-3 text-lg text-gray-600">Choose a guided path or create your own to achieve your wellness goals.</p>
                </div>
                
                <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-200">
                    {isFetching ? (
                        <p className="py-10 text-center text-gray-500">Loading journeys...</p>
                    ) : error ? (
                        <p className="py-10 text-center text-red-500">{error}</p>
                    ) : (
                        <div>
                            {Object.keys(journeys).map(key => {
                                const theme = journeyThemes[key] || { colors: { bg: 'bg-gray-500', text: 'text-gray-500' }, icon: <SparklesIcon /> };
                                const journey = journeys[key];
                                const completedTasks = journey.tasks.filter(t => t.completed).length;
                                const progress = journey.tasks.length > 0 ? (completedTasks / journey.tasks.length) * 100 : 0;
                                
                                return (
                                    <button key={key} onClick={() => handleSelectJourney(key)} className="w-full text-left flex items-center p-5 border-b border-gray-200 group hover:bg-gray-50 transition-colors">
                                        <div className={`mr-5 ${theme.colors.text}`}>{theme.icon}</div>
                                        <div className="flex-grow">
                                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-black">{journey.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{journey.description}</p>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                <div className={`${theme.colors.bg} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                        <ChevronRightIcon />
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="p-5 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className={`mr-5 text-purple-500`}><SparklesIcon /></div>
                            <div className="flex-grow">
                                <h4 className="text-lg font-bold text-gray-900">Customize Your Own</h4>
                                <p className="text-sm text-gray-500 mt-1">Tell our AI your goal for a personalized plan.</p>
                                <div className="flex items-center gap-2 mt-3">
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
