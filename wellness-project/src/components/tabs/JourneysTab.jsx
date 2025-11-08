import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// --- SVG Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const CalmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.25 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM18.75 12h-1.5a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5z" /></svg>;
const FocusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M12 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const journeyThemes = {
    anxiety: { colors: { bg: 'bg-[#00A896]', text: 'text-[#00A896]', border: 'border-[#00A896]' }, icon: <CalmIcon /> },
    focus: { colors: { bg: 'bg-[#FF9F43]', text: 'text-[#FF9F43]', border: 'border-[#FF9F43]' }, icon: <FocusIcon /> },
};

const JourneysTab = () => {
    const [view, setView] = useState('selection');
    const [predefinedJourneys, setPredefinedJourneys] = useState({});
    const [currentJourney, setCurrentJourney] = useState(null);
    const [customInput, setCustomInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchJourneys = async () => {
            try {
                const res = await api.get('/journeys');
                setPredefinedJourneys(res.data);
            } catch (err) { console.error("Failed to fetch journeys", err); }
            finally { setIsFetching(false); }
        };
        fetchJourneys();
    }, []);

    const handleSelectJourney = (journeyKey) => {
        const journeyData = predefinedJourneys[journeyKey];
        setCurrentJourney({
            ...journeyData,
            tasks: journeyData.tasks.map(task => ({ ...task, completed: false })),
            theme: journeyThemes[journeyKey] || Object.values(journeyThemes)[0]
        });
        setView('display');
    };
    
    const handleGenerateCustom = async () => {
        if (!customInput) return;
        setIsLoading(true);
        try {
            const res = await api.post('/journeys/custom', { goal: customInput });
            setCurrentJourney({
                ...res.data,
                tasks: res.data.tasks.map(task => ({ ...task, completed: false })),
                theme: { colors: { bg: 'bg-[#FF6B6B]', text: 'text-[#FF6B6B]', border: 'border-[#FF6B6B]' } }
            });
            setView('display');
        } catch (err) { alert("Sorry, could not generate a custom plan. Please try again later."); }
        finally {
            setIsLoading(false);
        }
    };

    const handleToggleTask = async (taskIndex) => {
        const updatedTasks = currentJourney.tasks.map((task, index) => 
            index === taskIndex ? { ...task, completed: !task.completed } : task
        );
        setCurrentJourney({ ...currentJourney, tasks: updatedTasks });

        try {
            // Assuming an endpoint to save journey progress exists
            await api.put(`/journeys/${currentJourney.id}`, { tasks: updatedTasks });
        } catch (err) {
            console.error("Failed to save progress", err);
            // Optionally revert the state change and show an error to the user
        }
    };

    if (view === 'display') {
        return (
            // ✨ MODIFIED: Removed background color and blobs
            <div className="animate-fade-in p-8 md:p-12 min-h-full">
                <button 
                    onClick={() => setView('selection')} 
                    className="flex items-center text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all mb-10"
                >
                    <ArrowLeftIcon />
                    Back to All Journeys
                </button>
                <h1 className={`text-4xl md:text-5xl font-bold ${currentJourney.theme.colors.text}`}>{currentJourney.title}</h1>
                <p className="text-gray-600 text-lg mt-4 max-w-2xl">{currentJourney.description}</p>
                <div className="mt-10 space-y-2">
                    {currentJourney.tasks.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-200/80">
                            <button onClick={() => handleToggleTask(index)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200
                                ${item.completed ? `${currentJourney.theme.colors.bg} ${currentJourney.theme.colors.border}` : 'border-gray-300'}`}
                            >
                                {item.completed && <CheckIcon />}
                            </button>
                            <span className={`font-medium ${item.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                                {item.task}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        // ✨ MODIFIED: Removed background color and blobs
        <div className="min-h-full p-8 md:p-12">
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] bg-clip-text text-transparent">
                Wellness Journeys
            </h3>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">Choose a guided path or create your own to achieve your wellness goals.</p>
            
            <div className="mt-10 border-t border-gray-200">
                {isFetching ? <p className="py-6 text-gray-500">Loading journeys...</p> : (
                    <>
                        {Object.keys(predefinedJourneys).map(key => {
                            const theme = journeyThemes[key] || Object.values(journeyThemes)[0];
                            return (
                                <button key={key} onClick={() => handleSelectJourney(key)} className="w-full text-left flex items-center p-6 border-b border-gray-200/80 group hover:bg-gray-100/50 transition-colors">
                                    <div className={`mr-6 ${theme.colors.text}`}>{theme.icon}</div>
                                    <div className="flex-grow">
                                        <h4 className="text-xl font-bold text-gray-800 group-hover:text-black">{predefinedJourneys[key].title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{predefinedJourneys[key].description}</p>
                                    </div>
                                    <ChevronRightIcon />
                                </button>
                            );
                        })}
                    </>
                )}

                <div className="flex items-center p-6">
                    <div className={`mr-6 text-[#FF6B6B]`}><SparklesIcon /></div>
                    <div className="flex-grow">
                        <h4 className="text-xl font-bold text-gray-800">Customize Your Own</h4>
                        <p className="text-sm text-gray-500 mt-1">Tell our AI your goal for a personalized plan.</p>
                        <div className="flex items-center gap-2 mt-4">
                            <input 
                                type="text" 
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] outline-none transition bg-white/50" 
                                placeholder="e.g., 'Be more focused'"
                            />
                            <button 
                                onClick={handleGenerateCustom} 
                                disabled={isLoading}
                                className="bg-[#FF9F43] text-white font-semibold px-4 py-2 rounded-lg disabled:bg-orange-300 transition-colors flex-shrink-0"
                            >
                                {isLoading ? <SpinnerIcon /> : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneysTab;