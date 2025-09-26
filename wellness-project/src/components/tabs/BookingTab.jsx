import React, { useState, useMemo } from 'react';
import { counselors, availableTimes } from '../../data/mockData'; // Assuming times are in mockData

const BookingTab = () => {
    const [step, setStep] = useState(1); // 1: Counselor, 2: Date, 3: Time
    const [selection, setSelection] = useState({ counselor: null, date: null, time: null });
    const [confirmation, setConfirmation] = useState('');

    const availableDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i < 8; i++) { // Show next 7 days
            const date = new Date();
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, []);

    const handleSelect = (type, value) => {
        setSelection(prev => ({ ...prev, [type]: value }));
        if (type === 'counselor') setStep(2);
        if (type === 'date') setStep(3);
    };
    
    const handleConfirmBooking = () => {
        const selectedCounselor = counselors.find(c => c.id === selection.counselor);
        const dateString = selection.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        setConfirmation(`Success! Your appointment with ${selectedCounselor.name} is booked for ${dateString} at ${selection.time}.`);
    };

    const isBookingComplete = selection.counselor && selection.date && selection.time;

    return (
        <div>
            <h3 className="text-3xl font-bold mb-4">Book a Confidential Session</h3>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="space-y-6">
                    {/* Step 1: Select Counselor */}
                    <div>
                        <h4 className="font-bold text-lg mb-2">1. Select a Counselor</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {counselors.map(c => (
                                <div key={c.id} onClick={() => handleSelect('counselor', c.id)} className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-100 ${selection.counselor === c.id ? 'bg-blue-100 border-blue-400' : ''}`}>
                                    <p className="font-semibold">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.specialty}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Step 2: Select Date */}
                    {step >= 2 && (
                         <div>
                            <h4 className="font-bold text-lg mb-2">2. Pick a Date</h4>
                            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                                {availableDates.map(date => (
                                    <button key={date} onClick={() => handleSelect('date', date)} className={`p-2 rounded-lg text-center ${selection.date?.toDateString() === date.toDateString() ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                                        <p className="font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                        <p>{date.getDate()}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                   
                    {/* Step 3: Select Time */}
                    {step >= 3 && (
                        <div>
                           <h4 className="font-bold text-lg mb-2">3. Choose an Available Time</h4>
                           <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                               {availableTimes.map(time => (
                                   <button key={time} onClick={() => handleSelect('time', time)} className={`p-2 border rounded-lg ${selection.time === time ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>{time}</button>
                               ))}
                           </div>
                       </div>
                    )}
                </div>
                
                {/* Confirmation */}
                <div className="mt-8 border-t pt-6 text-center">
                    {confirmation ? (
                        <p className="text-green-600 font-semibold">{confirmation}</p>
                    ) : (
                        <button onClick={handleConfirmBooking} disabled={!isBookingComplete} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition">
                            Book Appointment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingTab;