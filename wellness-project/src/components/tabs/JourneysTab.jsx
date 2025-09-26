import React, { useState } from 'react';
// Assuming you have these files from previous steps
import { journeys as predefinedJourneys } from '../../data/mockData';
import { callGeminiAPI } from '../../services/geminiAPI';

const JourneysTab = () => {
    // 'selection' shows the list of journeys, 'display' shows the selected one's tasks
    const [view, setView] = useState('selection');
    const [currentJourney, setCurrentJourney] = useState(null);
    const [customInput, setCustomInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectJourney = (journeyKey) => {
        const journeyData = predefinedJourneys[journeyKey];
        setCurrentJourney({
            ...journeyData,
            tasks: journeyData.tasks.map(task => ({ ...task, completed: false }))
        });
        setView('display');
    };
    
    const handleGenerateCustom = async () => {
        if (!customInput) return;
        setIsLoading(true);
        const prompt = `Create a 7-day wellness challenge for a college student with the goal: "${customInput}". Provide a title, a one-sentence description, and exactly 7 daily tasks. Format as: Title: [Your Title]\nDescription: [Your Description]\nDay 1: [Task 1]\nDay 2: [Task 2]...`;
        
        const result = await callGeminiAPI(prompt);
        setIsLoading(false);

        try {
            const lines = result.split('\n');
            const title = lines[0].replace('Title: ', '');
            const description = lines[1].replace('Description: ', '');
            const tasks = lines.slice(2).map(line => ({ task: line.replace(/Day \d: /, ''), completed: false }));
            
            setCurrentJourney({ title, description, tasks });
            setView('display');
        } catch (e) {
            alert("Sorry, could not generate a custom plan. Please try a different goal.");
        }
    };

    const handleToggleTask = (taskIndex) => {
        const updatedTasks = currentJourney.tasks.map((task, index) => 
            index === taskIndex ? { ...task, completed: !task.completed } : task
        );
        setCurrentJourney({ ...currentJourney, tasks: updatedTasks });
    };

    if (view === 'display') {
        return (
            <div>
                <button onClick={() => setView('selection')} className="mb-4 text-blue-600 hover:underline">
                    ← Back to Journeys
                </button>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-2xl font-bold">{currentJourney.title}</h4>
                    <p className="text-sm text-gray-500 mb-6">{currentJourney.description}</p>
                    <div className="space-y-4">
                        {currentJourney.tasks.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border">
                                <input 
                                    type="checkbox" 
                                    id={`task-${index}`} 
                                    checked={item.completed}
                                    onChange={() => handleToggleTask(index)}
                                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`task-${index}`} className={`font-semibold ${item.completed ? "line-through text-gray-500" : ""}`}>
                                    {item.task}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Choose a Wellness Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => handleSelectJourney('anxiety')} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition transform cursor-pointer">
                    <h4 className="text-xl font-bold text-purple-500">Reduce Anxiety</h4>
                    <p className="text-sm text-gray-500 mt-2">A 7-day plan with calming exercises and mindfulness techniques.</p>
                </div>
                <div onClick={() => handleSelectJourney('diet')} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition transform cursor-pointer">
                    <h4 className="text-xl font-bold text-green-600">Healthy Diet</h4>
                    <p className="text-sm text-gray-500 mt-2">A 7-day challenge to build better eating habits for your mind and body.</p>
                </div>
                <div onClick={() => handleSelectJourney('exercise')} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition transform cursor-pointer">
                    <h4 className="text-xl font-bold text-orange-600">Daily Exercise</h4>
                    <p className="text-sm text-gray-500 mt-2">A 7-day plan to get your body moving and boost your mood.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-700">Customize Your Own</h4>
                    <p className="text-sm text-gray-500 mt-2">Tell our AI your goal, and it will create a personalized 7-day plan for you!</p>
                    <input 
                        type="text" 
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="w-full mt-3 p-2 border rounded-lg" 
                        placeholder="e.g., 'Be more focused'"
                    />
                    <button 
                        onClick={handleGenerateCustom} 
                        disabled={isLoading}
                        className="mt-2 w-full bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg text-sm disabled:bg-gray-400"
                    >
                        {isLoading ? 'Creating...' : 'Create My Plan ✨'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JourneysTab;