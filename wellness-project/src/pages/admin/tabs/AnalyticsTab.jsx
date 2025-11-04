import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; // Use our central API service
import StatCard from '../../../components/admin/StatCard';
import IssuesBarChart from '../../../components/admin/charts/IssuesBarChart';
import EngagementDoughnutChart from '../../../components/admin/charts/EngagementDoughnutChart';
import { baseIssuesData } from '../../../data/mockAdminData'; // Keep mock data for charts for now

const AnalyticsTab = () => {
    // State to hold the fetched statistics
    const [stats, setStats] = useState({
        totalUsers: 0,
        dailyActive: 0,
        sessionsBooked: 0,
        avgUsage: '0m 0s'
    });
    const [isLoading, setIsLoading] = useState(true);

    // State for the filterable charts (still using mock data for now)
    const [filters, setFilters] = useState({ year: 'all', dept: 'all' });
    const [issuesData, setIssuesData] = useState(baseIssuesData.all);
    
    // This useEffect hook runs once to fetch the main statistics from the backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleApplyFilters = () => {
        const key = `${filters.year}-${filters.dept}`;
        setIssuesData(baseIssuesData[key] || baseIssuesData.all);
    };

    // This data can be connected to the backend later
    const engagementData = [300, 150, 90, 120];

    return (
        <div className="space-y-8">
            {/* --- Filters --- */}
            <div className="flex flex-wrap items-center gap-4">
                <select onChange={(e) => setFilters(f => ({...f, year: e.target.value}))} className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All Academic Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                </select>
                <select onChange={(e) => setFilters(f => ({...f, dept: e.target.value}))} className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All Departments</option>
                    <option value="eng">Engineering</option>
                </select>
                <button onClick={handleApplyFilters} className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
                    Apply Filters
                </button>
            </div>

            {/* --- Stat Cards (now displaying live data) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={isLoading ? '...' : stats.totalUsers} />
                <StatCard title="Daily Active Users" value={isLoading ? '...' : stats.dailyActive} />
                <StatCard title="Sessions Booked (Week)" value={isLoading ? '...' : stats.sessionsBooked} />
                <StatCard title="Avg. App Usage" value={isLoading ? '...' : stats.avgUsage} />
            </div>
            
            {/* --- Charts --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <IssuesBarChart data={issuesData} />
                </div>
                <div>
                    <EngagementDoughnutChart data={engagementData} />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;