import React from 'react';
import { Bar } from 'react-chartjs-2';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Most Common Student Concerns',
            color: '#334155', // slate-700
            font: { size: 16, weight: 'bold' },
        },
    },
    scales: {
        y: { ticks: { color: '#64748b' } }, // slate-500
        x: { ticks: { color: '#64748b' } },
    },
};

const IssuesBarChart = ({ data }) => {
    const chartData = {
        labels: ['Exam Stress', 'Anxiety', 'Relationships', 'Loneliness', 'Homesickness', 'Career Worries'],
        datasets: [{
            label: 'Top Issues Discussed',
            data: data,
            backgroundColor: 'rgba(79, 70, 229, 0.7)', // Indigo
            borderRadius: 6,
        }]
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-96">
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
};

export default IssuesBarChart;