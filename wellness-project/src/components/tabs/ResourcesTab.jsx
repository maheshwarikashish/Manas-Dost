import React, { useState, useRef } from 'react';
import ResourceCard from '../ResourceCard'; 
import { resources } from '../../data/mockData';

// --- SVG Icons ---
const AnxietyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 8.464a5 5 0 000 7.072m2.828-9.9a9 9 0 000 12.728m0 0l6.364-6.364m-6.364 0l6.364 6.364" /></svg>;
const MeditationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M12 12a2 2 0 01-2 2h-2a2 2 0 01-2-2V8a2 2 0 012-2h2a2 2 0 012 2v4z" /></svg>;
const MotivationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


const sections = [
    { title: "Stress & Anxiety", icon: <AnxietyIcon />, dataKey: "anxiety", colors: { bg: 'bg-teal-500', text: 'text-teal-500', iconBg: 'bg-teal-100' } },
    { title: "Guided Meditation", icon: <MeditationIcon />, dataKey: "meditation", colors: { bg: 'bg-orange-500', text: 'text-orange-500', iconBg: 'bg-orange-100' } },
    { title: "Motivation Boost", icon: <MotivationIcon />, dataKey: "motivation", colors: { bg: 'bg-red-500', text: 'text-red-500', iconBg: 'bg-red-100' } }
];

const ResourcesTab = () => {
    const [activeTab, setActiveTab] = useState(sections[0].dataKey);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollContainerRefs = useRef({});
    const activeSection = sections.find(s => s.dataKey === activeTab);

    const scroll = (dataKey, direction) => {
        const container = scrollContainerRefs.current[dataKey];
        if (container) {
            const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const filteredResources = (dataKey) => {
        const allRes = resources[dataKey] || [];
        if (!searchTerm) return allRes;
        return allRes.filter(res => 
            res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
            <header className="mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                        Resource Hub
                    </h2>
                    <p className="mt-1 text-gray-500">Your curated library for a healthier mind.</p>
                </div>
                <div className="relative mt-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search all resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 outline-none transition"
                    />
                </div>
            </header>

            {/* --- Content Area --- */}
            <main className="space-y-10">
                {sections.map(section => {
                    const availableResources = filteredResources(section.dataKey);
                    if (availableResources.length === 0) return null; // Don't render section if no results

                    return (
                        <section key={section.dataKey} className="animate-fade-in">
                            <div className="flex items-center mb-4">
                                <div className={`p-2 rounded-lg ${section.colors.iconBg} ${section.colors.text} mr-3`}>
                                    {section.icon}
                                </div>
                                <h3 className={`text-xl sm:text-2xl font-bold ${section.colors.text}`}>{section.title}</h3>
                            </div>
                            
                            <div className="relative group">
                                <button onClick={() => scroll(section.dataKey, 'left')} className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-gray-700 lg:hidden">
                                    <ChevronLeftIcon />
                                </button>
                                <button onClick={() => scroll(section.dataKey, 'right')} className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-gray-700 lg:hidden">
                                    <ChevronRightIcon />
                                </button>

                                <div 
                                    ref={el => scrollContainerRefs.current[section.dataKey] = el}
                                    className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2"
                                >
                                    {availableResources.map((res, i) => (
                                        <div key={i} className="flex-shrink-0 w-72 sm:w-80">
                                            <ResourceCard 
                                                resource={res} 
                                                colors={section.colors} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}
                {/* No results message */}
                {sections.every(s => filteredResources(s.dataKey).length === 0) && searchTerm && (
                    <div className="text-center py-10">
                        <h4 className="text-lg font-semibold text-gray-700">No Resources Found</h4>
                        <p className="text-gray-500 mt-1">Try adjusting your search term to find what you're looking for.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResourcesTab;
