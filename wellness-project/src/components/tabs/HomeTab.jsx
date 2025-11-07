import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../../services/api'; // Import the central API service

// REMOVED: The mock data generator is no longer needed.

const HomeTab = ({ user, navigateToTab }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodHistory, setMoodHistory] = useState([]);
    const [chartTimeframe, setChartTimeframe] = useState('week');
    const [showMoodOverview, setShowMoodOverview] = useState(false);

    // MODIFIED: This useEffect hook now fetches real mood history from the backend
    useEffect(() => {
        const fetchMoodHistory = async () => {
            try {
                const res = await api.get('/mood/history');
                // Format the data from the backend to match what the chart expects
                const formattedHistory = res.data.map(entry => ({
                    date: entry.date.split('T')[0], // "YYYY-MM-DD"
                    mood: entry.mood
                }));
                setMoodHistory(formattedHistory);
            } catch (err) {
                console.error("Failed to fetch mood history", err);
            }
        };
        fetchMoodHistory();
    }, []);

    // MODIFIED: This function now saves the selected mood to the database
    const handleMoodSelect = async (moodEmoji) => {
        const moodValue = moodMap[moodEmoji];
        setSelectedMood(moodEmoji);
        
        // Step 1: Update the UI immediately for a responsive feel
        const todayStr = new Date().toISOString().split('T')[0];
        const newEntry = { date: todayStr, mood: moodValue };
        setMoodHistory([newEntry, ...moodHistory.filter(entry => entry.date !== todayStr)]);

        // Step 2: Send the new mood to the backend to be saved
        try {
            await api.post('/mood', { mood: moodValue });
        } catch (err) {
            console.error("Failed to save mood", err);
            // Optional: You could add logic here to revert the UI change if the save fails
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };
// ... (imports and useState/useEffect hooks remain unchanged)

    // --- The rest of the component's logic and JSX remains the same ---
    const moodMap = { '😞': 1, '😕': 2, '😐': 3, '🙂': 4, '😊': 5 };
    const emojiMap = ['?', '😞', '😕', '😐', '🙂', '😊'];
    
    // ... (getGreeting and handleMoodSelect remain unchanged)

    const getChartData = () => {
        const now = new Date();
        const nowStr = now.toISOString().split('T')[0];
        let labels = [];
        let dataPoints = [];
        
        // Create a map for quick lookup: {"YYYY-MM-DD": moodValue}
        const moodLookup = moodHistory.reduce((acc, entry) => {
            acc[entry.date] = entry.mood;
            return acc;
        }, {});

        // Helper function to format date keys for lookup
        const formatDateKey = (date) => date.toISOString().split('T')[0];

        if (chartTimeframe === 'week') {
            let startDate = new Date();
            startDate.setDate(now.getDate() - 6);
            
            // Generate labels and data points for the last 7 days
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                
                const dateKey = formatDateKey(currentDate);

                // Label: Mon, Tue, Wed...
                labels.push(currentDate.toLocaleDateString('en-US', { weekday: 'short' }));
                
                // Data: Look up mood value, or use null if no entry
                dataPoints.push(moodLookup[dateKey] || null);
            }

        } else if (chartTimeframe === 'month') {
            // Find the start date of the current month
            let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            
            // Generate labels (1, 2, 3...) and data points for the month
            for (let i = 0; i < daysInMonth; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                
                const dateKey = formatDateKey(currentDate);
                
                labels.push(i + 1); // Day number (1 to 31)
                
                // Data: Look up mood value, or use null
                dataPoints.push(moodLookup[dateKey] || null);
            }

        } else if (chartTimeframe === 'year') {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const yearData = Array(12).fill(0); 
            const counts = Array(12).fill(0);
            
            // Calculate the average mood per month
            moodHistory.forEach(entry => {
                const entryDate = new Date(entry.date);
                if (entryDate.getFullYear() === now.getFullYear()) {
                    const monthIndex = entryDate.getMonth();
                    yearData[monthIndex] += entry.mood; 
                    counts[monthIndex]++;
                }
            }); 
            
            // Ensure null is used for months with no data
            dataPoints = yearData.map((total, i) => counts[i] > 0 ? (total / counts[i]) : null);
        }

        return {
            labels, datasets: [{
                label: 'Mood Level', data: dataPoints, borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)', fill: true, tension: 0.4, spanGaps: true,
            }],
        };
    };
    
// ... (The rest of the component remains unchanged)
    const chartOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 1, max: 5, ticks: { padding: 10, font: { size: 14 }, callback: (value) => emojiMap[value] } } } };

    const ForYouSection = () => {
        if (!selectedMood) return null;
        let content;
        switch (selectedMood) {
            case '😞': content = { title: "We're here for you", desc: "It's okay to not be okay. Talking about it can help.", actions: [{ label: "Chat with Mitra", tab: "chat", color: "bg-indigo-500 hover:bg-indigo-600" }] }; break;
            case '😕': content = { title: "Feeling Overwhelmed?", desc: "Breaking down tasks can bring clarity. Let our AI help.", actions: [{ label: "Use AI Goal Setter", tab: "tools", color: "bg-purple-500 hover:bg-purple-600" }] }; break;
            case '😐': content = { title: "A Neutral Day?", desc: "A little structure can make a big difference. Try a wellness journey.", actions: [{ label: "Start a Journey", tab: "journeys", color: "bg-orange-500 hover:bg-orange-600" }] }; break;
            case '🙂': content = { title: "Feeling Good?", desc: "That's great! Share some encouragement with your peers.", actions: [{ label: "Visit Peer Support", tab: "community", color: "bg-yellow-500 hover:bg-yellow-600" }] }; break;
            case '😊': content = { title: "It's a Great Day!", desc: "Awesome! Capture this feeling in your private journal.", actions: [{ label: "Open Journal", tab: "tools", color: "bg-green-500 hover:bg-green-600" }] }; break;
            default: return null;
        }
        return (
            <div className="w-full animate-fade-in text-center">
                <hr className="my-6 border-slate-200" />
                <h4 className="text-xl font-bold text-slate-700 mb-1">{content.title}</h4>
                <p className="text-base text-slate-600 my-2 max-w-sm mx-auto">{content.desc}</p>
                <div className="mt-4">
                    {content.actions.map(action => (
                        <button key={action.tab} onClick={() => navigateToTab(action.tab)} className={`text-white font-semibold px-5 py-2.5 rounded-lg text-base transition ${action.color}`}>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="py-6">
            <div className="w-full max-w-3xl mx-auto px-4 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-700 tracking-tight">
                        {getGreeting()}, <span className="text-sky-500">{user?.name?.split(' ')[0]}</span>
                    </h2>
                    <p className="text-base text-slate-500 mt-2 mb-4">How are you feeling today?</p>
                    <div className="flex justify-center items-center space-x-2 md:space-x-3">
                        {Object.keys(moodMap).map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => handleMoodSelect(emoji)}
                                className={`text-4xl p-2 rounded-full transition-all duration-200 transform ${selectedMood === emoji ? 'bg-sky-100 scale-110' : 'hover:bg-slate-100 hover:scale-105'}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    <ForYouSection />
                </div>
                {!showMoodOverview && (
                    <div className="bg-slate-100 p-5 rounded-2xl text-center animate-fade-in">
                         <h3 className="text-lg font-bold text-slate-700">Track Your Wellness Journey</h3>
                         <p className="text-slate-500 mt-1 mb-4 text-xs">Visualize your mood patterns to gain valuable insights.</p>
                         <button 
                            onClick={() => setShowMoodOverview(true)} 
                            className="bg-sky-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-sky-600 transition text-sm"
                        >
                           View My Mood Overview
                        </button>
                    </div>
                )}
                {showMoodOverview && (
                    <div className="w-full bg-white p-4 sm:p-6 rounded-2xl shadow-lg animate-fade-in">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <h3 className="text-lg font-bold text-slate-700">Your Mood Overview</h3>
                            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                                <button onClick={() => setChartTimeframe('week')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${chartTimeframe === 'week' ? 'bg-white shadow text-sky-600' : 'text-slate-500'}`}>Week</button>
                                <button onClick={() => setChartTimeframe('month')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${chartTimeframe === 'month' ? 'bg-white shadow text-sky-600' : 'text-slate-500'}`}>Month</button>
                                <button onClick={() => setChartTimeframe('year')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${chartTimeframe === 'year' ? 'bg-white shadow text-sky-600' : 'text-slate-500'}`}>Year</button>
                            </div>
                        </div>
                        <div className="h-56">
                             <Line options={chartOptions} data={getChartData()} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeTab;