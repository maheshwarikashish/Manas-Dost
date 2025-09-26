import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: 'Feature Usage Engagement',
            color: '#334155', // slate-700
            font: { size: 16, weight: 'bold' },
        },
        legend: {
            position: 'bottom',
            labels: { color: '#64748b' }, // slate-500
        },
    },
    cutout: '65%',
};

const EngagementDoughnutChart = ({ data }) => {
     const chartData = {
        labels: ['AI Chat', 'Guides', 'Booking', 'Community'],
        datasets: [{
            label: 'Feature Engagement',
            data: data,
            backgroundColor: ['#4f46e5', '#7c3aed', '#059669', '#f59e0b'],
            borderColor: '#ffffff',
            borderWidth: 4,
        }]
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-96">
             <Doughnut options={chartOptions} data={chartData} />
        </div>
    );
};

export default EngagementDoughnutChart;