import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../../services/api'; 

// 💡 NECESSARY CHART.JS IMPORTS AND REGISTRATION
// These imports are required for the Line chart and the 'fill' option to work.
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // CRITICAL: For the fill: true option
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // CRITICAL: Register the Filler plugin
);

const HomeTab = ({ user, navigateToTab }) => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodHistory, setMoodHistory] = useState([]);
    const [chartTimeframe, setChartTimeframe] = useState('week');
    const [showMoodOverview, setShowMoodOverview] = useState(false);

    const moodMap = { '😞': 1, '😕': 2, '😐': 3, '🙂': 4, '😊': 5 };
    const emojiMap = ['?', '😞', '😕', '😐', '🙂', '😊'];

    // 1. ⚙️ MODIFIED: Fetch real mood history with full timestamps
    useEffect(() => {
        const fetchMoodHistory = async () => {
            try {
                const res = await api.get('/mood/history');
                // CRITICAL: Store the data as received (objects with full ISO 'date' string and 'mood')
                setMoodHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch mood history", err);
            }
        };
        fetchMoodHistory();
    }, []);

    // 2. ➕ MODIFIED: Handle saving a new mood (creates a new entry with full timestamp)
    const handleMoodSelect = async (moodEmoji) => {
        const moodValue = moodMap[moodEmoji];
        setSelectedMood(moodEmoji);
        
        try {
            const res = await api.post('/mood', { mood: moodValue });
            
            // Update the UI by prepending the newly saved entry (with its new timestamp)
            const newEntry = res.data; 
            setMoodHistory(prevHistory => [newEntry, ...prevHistory]);

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

    // 3. 📊 MODIFIED: Reworked getChartData for hourly (week) and daily/monthly averages
    const getChartData = () => {
        const now = new Date();
        let labels = [];
        let dataPoints = [];
        
        // Convert date strings to Date objects for easier manipulation
        const filteredHistory = moodHistory.map(entry => ({ 
            ...entry, 
            date: new Date(entry.date) 
        }));

        if (chartTimeframe === 'week') {
            // Display mood changes over the last 7 days, with hourly precision
            const MS_PER_DAY = 24 * 60 * 60 * 1000;
            const sevenDaysAgo = now.getTime() - (7 * MS_PER_DAY);
            
            // Filter data to only the last 7 days
            const weekData = filteredHistory.filter(entry => entry.date.getTime() >= sevenDaysAgo);

            // Sort by time, oldest first
            weekData.sort((a, b) => a.date.getTime() - b.date.getTime());

            // Labels will be the date and time of the entry (for hourly view)
            labels = weekData.map(entry => 
                entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
                ' ' + 
                entry.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            );

            dataPoints = weekData.map(entry => entry.mood);
            
            // Handle no data case
            if (dataPoints.length === 0) {
                 labels = ['No recent data'];
                 dataPoints = [null];
            }

        } else if (chartTimeframe === 'month' || chartTimeframe === 'year') {
            // For Month and Year, we return to plotting AVERAGES per day/month
            
            let timeUnit;
            if (chartTimeframe === 'month') {
                timeUnit = 'day';
            } else { // year
                timeUnit = 'month';
            }

            // Group data by the relevant time unit (day or month)
            const groupedData = filteredHistory.reduce((acc, entry) => {
                let key;
                if (timeUnit === 'day') {
                    key = entry.date.toISOString().split('T')[0]; // YYYY-MM-DD
                } else { // month
                    key = `${entry.date.getFullYear()}-${entry.date.getMonth()}`; // YYYY-MonthIndex
                }
                
                if (!acc[key]) acc[key] = { total: 0, count: 0, date: entry.date };
                acc[key].total += entry.mood;
                acc[key].count++;
                return acc;
            }, {});

            // Prepare the final chart data based on the timeframe range
            if (chartTimeframe === 'month') {
                let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                
                for (let i = 0; i < daysInMonth; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + i);
                    
                    const dateKey = currentDate.toISOString().split('T')[0];
                    const data = groupedData[dateKey];

                    labels.push(currentDate.getDate()); // Day number
                    dataPoints.push(data ? data.total / data.count : null);
                }
            } else { // year
                const yearLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for (let i = 0; i < 12; i++) {
                    const monthKey = `${now.getFullYear()}-${i}`;
                    const data = groupedData[monthKey];

                    labels.push(yearLabels[i]);
                    dataPoints.push(data ? data.total / data.count : null);
                }
            }
        }

        return {
            labels, datasets: [{
                label: chartTimeframe === 'week' ? 'Mood Level' : 'Average Mood Level', 
                data: dataPoints, 
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                fill: true, // This now works due to the Filler plugin registration
                tension: 0.2, 
                spanGaps: false,
            }],
        };
    };
    
    const chartOptions = { 
        responsive: true, 
        plugins: { 
            legend: { display: false } 
        }, 
        scales: { 
            y: { 
                min: 1, 
                max: 5, 
                ticks: { 
                    padding: 10, 
                    font: { size: 14 }, 
                    callback: (value) => emojiMap[value] 
                } 
            },
            x: {
                // Adjust x-axis ticks for better display of time/dates
                ticks: {
                    autoSkip: chartTimeframe === 'week', // Auto-skip if it's the busy week view
                    maxRotation: chartTimeframe === 'week' ? 90 : 0, // Rotate labels for hourly view
                    minRotation: chartTimeframe === 'week' ? 90 : 0,
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