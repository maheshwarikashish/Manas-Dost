import React from 'react';

const StatCard = ({ title, value, change, changeType, icon }) => {
    const isIncrease = changeType === 'increase';
    const changeColor = isIncrease ? 'text-emerald-500' : 'text-rose-500';
    const iconColor = isIncrease ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-start justify-between">
            <div>
                <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
                {change && (
                    <p className={`text-sm font-semibold mt-2 flex items-center ${changeColor}`}>
                        {isIncrease ? '▲' : '▼'}
                        <span className="ml-1">{change}</span>
                    </p>
                )}
            </div>
            {icon && (
                 <div className={`rounded-full p-2 ${iconColor}`}>
                    {icon}
                 </div>
            )}
        </div>
    );
};

export default StatCard;