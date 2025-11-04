import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

// --- SVG Icons ---
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

// --- Themed Stepper Component ---
const Stepper = ({ currentStep }) => {
    const steps = ['Select Counselor', 'Pick Date', 'Choose Time'];
    return (
        <div className="flex items-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                            ${ currentStep > index + 1 ? 'bg-[#00A896] text-white' : 
                               currentStep === index + 1 ? 'bg-[#FF9F43] text-white' : 
                               'bg-gray-200 text-gray-500'
                            }`}>
                            {currentStep > index + 1 ? '✓' : index + 1}
                        </div>
                        <span className={`ml-3 font-semibold ${ currentStep >= index + 1 ? 'text-[#2C3E50]' : 'text-gray-400' }`}>
                            {step}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-auto border-t-2 transition-colors duration-300 mx-4 ${ currentStep > index + 1 ? 'border-[#00A896]' : 'border-gray-200' }`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const BookingTab = ({ navigateToTab }) => {
    const [counselors, setCounselors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({ counselor: null, date: null, time: null });
    const [confirmation, setConfirmation] = useState('');

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const res = await api.get('/counselors');
                setCounselors(res.data);
            } catch (err) { console.error("Failed to fetch counselors", err); }
            finally { setIsLoading(false); }
        };
        fetchCounselors();
    }, []);

    const availableDates = useMemo(() => {
        const dates = []; const today = new Date();
        for (let i = 1; i < 8; i++) {
            const date = new Date(); date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, []);

    const availableTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

    const handleSelect = (type, value) => {
        setSelection(prev => ({ ...prev, [type]: value }));
        if (type === 'counselor' && step < 2) setStep(2);
        if (type === 'date' && step < 3) setStep(3);
    };
    
    const handleConfirmBooking = async () => {
        try {
            await api.post('/appointments', { counselor: selection.counselor, date: selection.date, time: selection.time });
            const selectedCounselor = counselors.find(c => c._id === selection.counselor);
            const dateString = selection.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            setConfirmation(`Your appointment with ${selectedCounselor.name} is confirmed for ${dateString} at ${selection.time}.`);
        } catch (err) {
            setConfirmation("Sorry, there was an error booking your appointment. Please try again.");
        }
    };

    const isBookingComplete = selection.counselor && selection.date && selection.time;

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center gap-2 text-gray-500"><SpinnerIcon /><span>Loading available counselors...</span></div>;
    }

    if (confirmation) {
        return (
            // ✨ MODIFIED: Ensuring no background, main content centered, with a distinct card.
            <div className="min-h-full flex items-center justify-center p-4 md:p-8">
                <div className="max-w-lg mx-auto text-center bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
                    <div className="mx-auto w-16 h-16 bg-teal-100 text-[#00A896] rounded-full flex items-center justify-center">
                        <CheckIcon />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2C3E50] mt-4">Appointment Confirmed!</h3>
                    <p className="text-gray-600 mt-2">{confirmation}</p>
                    <button 
                        onClick={() => navigateToTab('home')} 
                        className="mt-8 bg-[#FF9F43] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        // ✨ MODIFIED: Removed bg-[#FFF9F0]
        <div className="min-h-full p-4 md:p-8">
            <div className="text-center">
                <h3 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] bg-clip-text text-transparent">Book a Confidential Session</h3>
                <p className="mt-3 text-lg text-gray-600">Follow the steps below to schedule your appointment.</p>
            </div>
            
            {/* ✨ MODIFIED: Main booking card now has bg-white, shadow-xl, and a themed top border for better visibility */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-4xl mx-auto mt-8 border-t-4 border-[#00A896]"> 
                <Stepper currentStep={step} />
                
                <div className="space-y-8">
                    {/* --- Step 1: Select Counselor --- */}
                    <div className={step < 1 ? 'opacity-50 pointer-events-none' : ''}>
                        <h4 className="font-bold text-lg mb-3 text-[#2C3E50]">1. Select a Counselor</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {counselors.map(c => (
                                <div key={c._id} onClick={() => handleSelect('counselor', c._id)} className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 
                                    ${selection.counselor === c._id 
                                        ? 'bg-teal-50 border-[#00A896] ring-2 ring-teal-100 shadow-sm' 
                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}>
                                    <p className="font-semibold text-[#2C3E50]">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.specialty}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* --- Step 2: Select Date --- */}
                    {step >= 2 && (
                         <div className={`animate-fade-in ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                            <h4 className="font-bold text-lg mb-3 text-[#2C3E50]">2. Pick a Date</h4>
                            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                                {availableDates.map(date => (
                                    <button key={date.toISOString()} onClick={() => handleSelect('date', date)} className={`p-2 rounded-lg text-center transition-colors duration-200 
                                        ${selection.date?.toDateString() === date.toDateString() 
                                            ? 'bg-[#00A896] text-white shadow-md' 
                                            : 'bg-white text-[#2C3E50] hover:bg-gray-100'}`}>
                                        <p className="font-semibold text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                        <p className="text-xl font-bold">{date.getDate()}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* --- Step 3: Select Time --- */}
                    {step >= 3 && (
                        <div className={`animate-fade-in ${step < 3 ? 'opacity-50 pointer-events-none' : ''}`}>
                           <h4 className="font-bold text-lg mb-3 text-[#2C3E50]">3. Choose an Available Time</h4>
                           <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                               {availableTimes.map(time => (
                                   <button key={time} onClick={() => handleSelect('time', time)} className={`p-3 border-2 rounded-lg font-semibold transition-colors duration-200 
                                        ${selection.time === time 
                                            ? 'bg-[#00A896] text-white shadow-md border-transparent' 
                                            : 'bg-white border-gray-200 text-[#2C3E50] hover:bg-gray-100'}`}>
                                       {time}
                                   </button>
                               ))}
                           </div>
                       </div>
                    )}
                </div>
                
                {/* --- Confirmation Button --- */}
                {step >= 3 && (
                    <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                        <button onClick={handleConfirmBooking} disabled={!isBookingComplete} className="bg-[#FF9F43] text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition transform hover:scale-105 shadow-md hover:shadow-lg">
                            Confirm Appointment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingTab;