import React from 'react';

const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

const ResourceCard = ({ resource, colors }) => {
    const isVideo = resource.type === 'Video';
    
    // Create a dynamic, themed placeholder URL using the passed-in color
    const hexColor = colors.bg.replace('bg-[', '').replace(']', '').slice(1);
    const placeholderText = resource.title.split(' ').slice(0, 2).join('+');
    const imageUrl = `https://placehold.co/600x400/${hexColor}/white?text=${placeholderText}&font=lato`;

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden h-full flex flex-col hover:-translate-y-2">
            <div className="relative">
                <img src={imageUrl} alt={resource.title} className="w-full h-48 object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent"></div>
                <span className={`absolute top-4 left-4 text-xs font-bold text-white px-3 py-1 rounded-full ${colors.bg}`}>
                    {resource.type}
                </span>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h5 className={`text-xl font-bold text-[#2C3E50] group-hover:${colors.text} transition-colors duration-300`}>
                    {resource.title}
                </h5>
                <p className="text-base text-gray-600 mt-2 flex-grow">
                    {isVideo ? 'Guided video session to help you recenter.' : resource.content}
                </p>

                <a
                    href={isVideo ? resource.content : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center font-bold text-sm mt-4 ${colors.text}`}
                >
                    {isVideo ? 'Watch Video' : 'Read Article'}
                    <ArrowRightIcon />
                </a>
            </div>
        </div>
    );
};

export default ResourceCard;