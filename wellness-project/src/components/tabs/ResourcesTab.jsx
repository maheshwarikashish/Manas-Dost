import React, { useState, useRef } from 'react';
import ResourceCard from '../ResourceCard'; 
import { resources } from '../../data/mockData';

// --- SVG Icons ---
const AnxietyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 8.464a5 5 0 000 7.072m2.828-9.9a9 9 0 000 12.728m0 0l6.364-6.364m-6.364 0l6.364 6.364" /></svg>;
const MeditationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M12 12a2 2 0 01-2 2h-2a2 2 0 01-2-2V8a2 2 0 012-2h2a2 2 0 012 2v4z" /></svg>;
const MotivationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


const sections = [
    { title: "Stress & Anxiety", icon: <AnxietyIcon />, dataKey: "anxiety", colors: { bg: 'bg-[#00A896]', text: 'text-[#00A896]', iconBg: 'bg-teal-100' } },
    { title: "Guided Meditation", icon: <MeditationIcon />, dataKey: "meditation", colors: { bg: 'bg-[#FF9F43]', text: 'text-[#FF9F43]', iconBg: 'bg-orange-100' } },
    { title: "Motivation Boost", icon: <MotivationIcon />, dataKey: "motivation", colors: { bg: 'bg-[#FF6B6B]', text: 'text-[#FF6B6B]', iconBg: 'bg-red-100' } }
];

const ResourcesTab = () => {
    const [activeTab, setActiveTab] = useState(sections[0].dataKey);
    const scrollContainerRef = useRef(null);
    const activeSection = sections.find(s => s.dataKey === activeTab);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-full bg-gray-100/50 p-6 md:p-8">
            {/* --- ✨ NEW: Header with Search Bar --- */}
            <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-4xl font-extrabold bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] bg-clip-text text-transparent">
                        Resource Hub
                    </h2>
                    <p className="mt-1 text-gray-500">Your curated library for a healthier mind.</p>
                </div>
                <div className="relative w-full md:max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search resources..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#FF9F43]/50 focus:border-[#FF9F43] outline-none transition"
                    />
                </div>
            </header>

            {/* --- ✨ NEW: 2-Column Dashboard Layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* --- Left Column: Navigation --- */}
                <nav className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-4 self-start">
                    <div className="space-y-2">
                        {sections.map((section) => (
                            <button 
                                key={section.dataKey}
                                onClick={() => setActiveTab(section.dataKey)}
                                className={`w-full flex items-center space-x-3 text-left p-3 rounded-xl font-bold transition-all duration-200
                                    ${activeTab === section.dataKey 
                                        ? `${section.colors.iconBg} ${section.colors.text}`
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <div className={`p-2 rounded-lg ${section.colors.iconBg} ${section.colors.text}`}>
                                    {section.icon}
                                </div>
                                <span className="flex-grow">{section.title}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* --- Right Column: Content --- */}
                <main className="lg:col-span-3">
                    {activeSection && (
                        <div key={activeTab} className="animate-fade-in">
                            <h3 className={`text-3xl font-bold ${activeSection.colors.text}`}>{activeSection.title}</h3>
                            
                            <div className="relative group mt-6">
                                <button onClick={() => scroll('left')} className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-gray-700">
                                    <ChevronLeftIcon />
                                </button>
                                <button onClick={() => scroll('right')} className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-gray-700">
                                    <ChevronRightIcon />
                                </button>

                                <div ref={scrollContainerRef} className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                                    {resources[activeSection.dataKey].map((res, i) => (
                                        <div key={i} className="flex-shrink-0 w-80 md:w-[26rem]">
                                            <ResourceCard 
                                                resource={res} 
                                                colors={activeSection.colors} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ResourcesTab;