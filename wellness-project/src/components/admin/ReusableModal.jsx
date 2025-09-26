import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ReusableModal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            onClick={onClose} 
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 transform transition-all duration-300 scale-100 opacity-100"
            >
                <div className="flex justify-between items-center mb-4">
                    <h4 id="modal-title" className="text-xl font-semibold text-slate-800">{title}</h4>
                    <button 
                        onClick={onClose} 
                        className="text-slate-500 hover:text-slate-800 text-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

ReusableModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node
};

export default ReusableModal;