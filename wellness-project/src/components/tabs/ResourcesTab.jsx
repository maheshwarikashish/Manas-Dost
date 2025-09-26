import React from 'react';
// Assuming these are in the correct paths from previous steps
import { resources } from '../../data/mockData';
import ResourceCard from '../ResourceCard';

const ResourcesTab = () => {
    return (
        <div>
            <h3 className="text-3xl font-bold text-gray-700 mb-8 tracking-tight">Resource Hub</h3>
            
            <div className="space-y-8">
                
                {/* --- Stress & Anxiety Section --- */}
                {/* MODIFIED: Added transition and hover effect classes */}
                <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-indigo-50">
                    <h4 className="text-2xl font-bold mb-4 text-indigo-600">Stress & Anxiety</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.anxiety.map((resource, index) => (
                            <ResourceCard key={index} resource={resource} />
                        ))}
                    </div>
                </div>

                {/* --- Guided Meditation Section --- */}
                {/* MODIFIED: Added transition and hover effect classes */}
                <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-cyan-50">
                    <h4 className="text-2xl font-bold mb-4 text-cyan-600">Guided Meditation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.meditation.map((resource, index) => (
                            <ResourceCard key={index} resource={resource} />
                        ))}
                    </div>
                </div>
                
                {/* --- Motivation Boost Section --- */}
                {/* MODIFIED: Added transition and hover effect classes */}
                <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-emerald-50">
                    <h4 className="text-2xl font-bold mb-4 text-emerald-600">Motivation Boost</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.motivation.map((resource, index) => (
                            <ResourceCard key={index} resource={resource} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResourcesTab;