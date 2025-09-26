import React, { useState, useEffect } from 'react';
import StatCard from '../../../components/admin/StatCard';
import IssuesBarChart from '../../../components/admin/charts/IssuesBarChart';
import EngagementDoughnutChart from '../../../components/admin/charts/EngagementDoughnutChart';
import { baseIssuesData } from '../../../data/mockAdminData';

const AnalyticsTab = () => {
    const [filters, setFilters] = useState({ year: 'all', dept: 'all' });
    const [issuesData, setIssuesData] = useState(baseIssuesData.all);

    // Mock data for stat cards
    const stats = {
        totalUsers: '1,428',
        dailyActive: '357',
        sessionsBooked: '42',
        avgUsage: '12m 15s'
    };
    
    // Mock data for engagement chart
    const engagementData = [300, 150, 90, 120];

    const handleApplyFilters = () => {
        const key = `${filters.year}-${filters.dept}`;
        setIssuesData(baseIssuesData[key] || baseIssuesData.all);
    };

    return (
        <div className="space-y-8">
            {/* --- Filters --- */}
            <div className="flex flex-wrap items-center gap-4">
                <select onChange={(e) => setFilters(f => ({...f, year: e.target.value}))} className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All Academic Years</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>
                <select onChange={(e) => setFilters(f => ({...f, dept: e.target.value}))} className="bg-white border border-slate-300 rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-indigo-500">
                    <option value="all">All Departments</option>
                    <option value="eng">Engineering</option>
                    <option value="arts">Arts & Sciences</option>
                    <option value="biz">Business</option>
                </select>
                <button onClick={handleApplyFilters} className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
                    Apply Filters
                </button>
            </div>

            {/* --- Stat Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers} />
                <StatCard title="Daily Active Users" value={stats.dailyActive} />
                <StatCard title="Sessions Booked (Week)" value={stats.sessionsBooked} />
                <StatCard title="Avg. App Usage" value={stats.avgUsage} />
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