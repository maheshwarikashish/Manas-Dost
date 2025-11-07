import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../../services/api'; 

// 💡 NECESSARY CHART.JS IMPORTS AND REGISTRATION
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, 
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler 
);

const HomeTab = ({ user, navigateToTab }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodHistory, setMoodHistory] = useState([]);
    const [chartTimeframe, setChartTimeframe] = useState('day'); // Default to 'day' view
    const [showMoodOverview, setShowMoodOverview] = useState(true); // Default to showing overview

    const moodMap = { '😞': 1, '😕': 2, '😐': 3, '🙂': 4, '😊': 5 };
    const emojiMap = ['?', '😞', '😕', '😐', '🙂', '😊'];

    // 1. ⚙️ Fetches mood history with full timestamps
    useEffect(() => {
        const fetchMoodHistory = async () => {
            try {
                const res = await api.get('/mood/history');
                // CRITICAL: Ensure the full date string is preserved for time calculations
                const formattedHistory = res.data.map(entry => ({
                    date: entry.date, 
                    mood: entry.mood
                }));
                setMoodHistory(formattedHistory);
            } catch (err) {
                console.error("Failed to fetch mood history", err);
            }
        };
        fetchMoodHistory();
    }, []);

    // 2. ➕ Handles mood selection and saves to DB
    const handleMoodSelect = async (moodEmoji) => {
        const moodValue = moodMap[moodEmoji];
        setSelectedMood(moodEmoji);
        
        try {
            await api.post('/mood', { mood: moodValue });
            
            // Re-fetch history to get the latest entry, ensuring accuracy
            const res = await api.get('/mood/history');
            const formattedHistory = res.data.map(entry => ({
                date: entry.date, 
                mood: entry.mood
            }));
            setMoodHistory(formattedHistory);
            
            // Show the overview immediately after logging mood
            setShowMoodOverview(true); 

        } catch (err) {
            console.error("Failed to save mood", err);
        }
    };
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Helper function to get the YYYY-MM-DD key (based on UTC day)
    const getDateKey = (dateInput) => {
        const date = new Date(dateInput);
        return date.toISOString().split('T')[0];
    };

    // 3. 📊 Reworked getChartData
    const getChartData = () => {
        const now = new Date();
        let labels = [];
        let dataPoints = [];
        
        // Group data, creating Date objects only once for efficiency
        const groupedByDay = moodHistory.reduce((acc, entry) => {
            const entryDate = new Date(entry.date);
            const dateKey = entryDate.toISOString().split('T')[0]; // UTC Day key
            
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push({ mood: entry.mood, date: entryDate });
            return acc;
        }, {});

        // --- 'day' timeframe logic (Hourly plot for today) ---
        if (chartTimeframe === 'day') {
            const todayKey = now.toISOString().split('T')[0];
            const todayEntries = groupedByDay[todayKey] || [];
            
            todayEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

            labels = todayEntries.map(entry => 
                // CRITICAL FIX: Use 'en-IN' or similar locale if needed, but toLocaleTimeString() 
                // relies on the correct time being in the Date object, which is now verified.
                entry.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) 
            );
            dataPoints = todayEntries.map(entry => entry.mood);

            if (dataPoints.length === 0) {
                 labels = ['No data yet'];
                 dataPoints = [null];
            }

        // --- 'week' logic (Daily averages) ---
        } else if (chartTimeframe === 'week') {
            let startDate = new Date();
            startDate.setDate(now.getDate() - 6);
            
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                const dateKey = getDateKey(currentDate);

                labels.push(currentDate.toLocaleDateString('en-US', { weekday: 'short' }));
                
                const entries = groupedByDay[dateKey];
                if (entries && entries.length > 0) {
                    const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
                    dataPoints.push(avgMood);
                } else {
                    dataPoints.push(null);
                }
            }

        // --- 'month' logic (Daily averages) ---
        } else if (chartTimeframe === 'month') {
            let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            
            for (let i = 0; i < daysInMonth; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                const dateKey = getDateKey(currentDate);
                
                labels.push(i + 1); 
                
                const entries = groupedByDay[dateKey];
                if (entries && entries.length > 0) {
                    const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
                    dataPoints.push(avgMood);
                } else {
                    dataPoints.push(null);
                }
            }

        // --- 'year' logic (Monthly averages) ---
        } else if (chartTimeframe === 'year') {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const yearData = Array(12).fill(0); 
            const counts = Array(12).fill(0);
            
            // Calculate the total mood and count per month
            Object.values(groupedByDay).flat().forEach(entry => {
                const entryDate = entry.date;
                if (entryDate.getFullYear() === now.getFullYear()) {
                    const monthIndex = entryDate.getMonth();
                    yearData[monthIndex] += entryDate.mood; 
                    counts[monthIndex]++;
                }
            }); 
            
            dataPoints = yearData.map((total, i) => counts[i] > 0 ? (total / counts[i]) : null);
        }

        return {
            labels, datasets: [{
                label: chartTimeframe === 'day' ? 'Mood Entry' : 'Average Mood', 
                data: dataPoints, 
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                fill: true, 
                tension: chartTimeframe === 'day' ? 0.2 : 0.4, // Smoother line for time data
                spanGaps: true,
            }],
        };
    };
    
    const chartOptions = { 
        responsive: true, 
        plugins: { 
            legend: { display: false },
            tooltip: {
                // Adjust tooltip to show the emoji label
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${emojiMap[context.parsed.y]}`;
                    }
                }
            }
        }, 
        scales: { 
            y: { 
                min: 1, 
                max: 5, 
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: { 
                    padding: 10, 
                    font: { size: 14 }, 
                    callback: (value) => emojiMap[value] 
                } 
            },
            x: {
                grid: {
                    display: false, // Cleaner X-axis grid
                },
                // Adjust x-axis ticks for better display of hourly data
                ticks: {
                    autoSkip: chartTimeframe !== 'day', // Only auto-skip for week/month/year
                    maxRotation: chartTimeframe === 'day' ? 45 : 0, 
                    minRotation: chartTimeframe === 'day' ? 45 : 0,
                    font: { size: 11 }
                }
            }
        } 
    };

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
            <div className="w-full animate-fade-in text-center p-4">
                <hr className="my-6 border-slate-200" />
                <h4 className="text-xl font-semibold text-slate-800 mb-2">{content.title}</h4>
                <p className="text-base text-slate-600 max-w-sm mx-auto">{content.desc}</p>
                <div className="mt-4 flex justify-center">
                    {content.actions.map(action => (
                        <button key={action.tab} onClick={() => navigateToTab(action.tab)} className={`text-white font-medium px-4 py-2 rounded-xl text-sm transition shadow-md ${action.color}`}>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="w-full max-w-3xl mx-auto px-4 space-y-6">
                
                {/* 1. Header and Mood Selection */}
                <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {getGreeting()}, <span className="text-sky-600">{user?.name?.split(' ')[0]}</span>
                    </h2>
                    <p className="text-base text-slate-500 mt-2 mb-6">Log your mood for insight.</p>
                    
                    {/* Mood Emojis */}
                    <div className="flex justify-center items-center space-x-3 md:space-x-5">
                        {Object.keys(moodMap).map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => handleMoodSelect(emoji)}
                                className={`text-5xl p-3 rounded-full transition-all duration-300 transform 
                                    ${selectedMood === emoji 
                                        ? 'ring-4 ring-sky-300 bg-sky-50 shadow-xl scale-110' 
                                        : 'hover:bg-slate-100 hover:scale-105'}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                    
                    {/* For You Section */}
                    <ForYouSection />
                </div>

                {/* 2. Mood Overview Chart */}
                {showMoodOverview && (
                    <div className="w-full bg-white p-4 sm:p-6 rounded-3xl shadow-lg border border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
                            <h3 className="text-xl font-bold text-slate-800">Your Mood Overview</h3>
                            {/* Timeframe Selector */}
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl shadow-inner">
                                <button onClick={() => setChartTimeframe('day')} className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${chartTimeframe === 'day' ? 'bg-white shadow-md text-sky-600' : 'text-slate-600 hover:bg-gray-200'}`}>Day</button>
                                <button onClick={() => setChartTimeframe('week')} className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${chartTimeframe === 'week' ? 'bg-white shadow-md text-sky-600' : 'text-slate-600 hover:bg-gray-200'}`}>Week</button>
                                <button onClick={() => setChartTimeframe('month')} className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${chartTimeframe === 'month' ? 'bg-white shadow-md text-sky-600' : 'text-slate-600 hover:bg-gray-200'}`}>Month</button>
                                <button onClick={() => setChartTimeframe('year')} className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${chartTimeframe === 'year' ? 'bg-white shadow-md text-sky-600' : 'text-slate-600 hover:bg-gray-200'}`}>Year</button>
                            </div>
                        </div>
                        <div className="h-64">
                             <Line options={chartOptions} data={getChartData()} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeTab;