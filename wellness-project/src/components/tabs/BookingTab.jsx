
import React, { useState, useEffect, useMemo } from 'react';
import { default as api } from '../../services/api';

// --- SVG Icons ---
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;

// --- Responsive Stepper ---
const Stepper = ({ currentStep }) => {
    const steps = ['Counselor', 'Date', 'Time'];
    return (
        <div className="flex items-center justify-center mb-6 md:mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300
                            ${ currentStep > index + 1 ? 'bg-teal-500 text-white' : 
                               currentStep === index + 1 ? 'bg-orange-500 text-white' : 
                               'bg-gray-200 text-gray-500'
                            }`}>
                            {currentStep > index + 1 ? '✓' : index + 1}
                        </div>
                        <span className={`mt-2 text-xs text-center font-semibold hidden sm:block ${ currentStep >= index + 1 ? 'text-gray-800' : 'text-gray-400' }`}>
                            {step}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-auto border-t-2 transition-colors duration-300 mx-2 sm:mx-4 ${ currentStep > index + 1 ? 'border-teal-500' : 'border-gray-200' }`}></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const BookingTab = ({ navigateToTab }) => {
    const [counselors, setCounselors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [selection, setSelection] = useState({ counselor: null, date: null, time: null });
    const [confirmation, setConfirmation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [counselorsRes, appointmentsRes] = await Promise.all([
                    api.get('/counselors'),
                    api.get(`/appointments/student/${localStorage.getItem("userId")}`)
                ]);
                setCounselors(counselorsRes.data);
                setAppointments(appointmentsRes.data);
            } catch (err) { 
                console.error("Failed to fetch data", err); 
            }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (selection.counselor && selection.date) {
                try {
                    const res = await api.get(`/appointments/counselor/${selection.counselor}/availability?date=${selection.date.toISOString()}`);
                    setAvailableTimes(res.data);
                } catch (err) {
                    console.error("Failed to fetch availability", err);
                }
            }
        };
        fetchAvailability();
    }, [selection.counselor, selection.date]);

    const availableDates = useMemo(() => {
        const dates = []; const today = new Date();
        for (let i = 1; i < 8; i++) {
            const date = new Date(); date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    }, []);

    const handleSelect = (type, value) => {
        setSelection(prev => ({ ...prev, [type]: value, time: type === 'date' ? null : prev.time }));
        if (type === 'counselor' && step < 2) setStep(2);
        if (type === 'date' && step < 3) setStep(3);
    };
    
    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            await api.post('/appointments', { counselor: selection.counselor, date: selection.date, time: selection.time });
            const selectedCounselor = counselors.find(c => c._id === selection.counselor);
            const dateString = selection.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            setConfirmation(`Your session with ${selectedCounselor.name} is confirmed for ${dateString} at ${selection.time}.`);
        } catch (err) {
            setConfirmation("Sorry, there was an error booking your appointment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSelection({ counselor: null, date: null, time: null });
        setConfirmation('');
        setStep(1);
        const fetchData = async () => {
            try {
                const appointmentsRes = await api.get(`/appointments/student/${localStorage.getItem("userId")}`);
                setAppointments(appointmentsRes.data);
            } catch (err) { 
                console.error("Failed to fetch data", err); 
            }
        };
        fetchData();
    };

    const isBookingComplete = selection.counselor && selection.date && selection.time;

    if (isLoading) {
        return <div className="w-full max-w-7xl mx-auto flex items-center justify-center gap-2 text-gray-500 p-8"><SpinnerIcon /><span>Loading...</span></div>;
    }

    if (confirmation) {
        return (
            <div className="w-full max-w-7xl mx-auto flex items-center justify-center">
                <div className="max-w-lg w-full text-center bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
                    <div className="mx-auto w-16 h-16 bg-teal-100 text-teal-500 rounded-full flex items-center justify-center">
                        <CheckIcon />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-4">Appointment Confirmed!</h3>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">{confirmation}</p>
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 justify-center">
                        <button 
                            onClick={handleReset} 
                            className="bg-orange-500 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                        >
                            Book Another
                        </button>
                        <button 
                            onClick={() => navigateToTab('home')} 
                            className="bg-gray-100 text-gray-700 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
            <div className="text-left sm:text-center mb-6 md:mb-8">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-800">Book a Confidential Session</h3>
                <p className="mt-2 text-base text-gray-600">Follow the steps below to schedule your appointment.</p>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-t-4 border-teal-500"> 
                <Stepper currentStep={step} />
                
                <div className="space-y-6 md:space-y-8">
                    {/* --- Step 1: Select Counselor --- */}
                    <div className={`transition-opacity duration-500 ${step < 1 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        <h4 className="font-bold text-lg mb-3 text-gray-800">1. Select a Counselor</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {counselors.map(c => (
                                <div key={c._id} onClick={() => handleSelect('counselor', c._id)} className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 
                                    ${selection.counselor === c._id 
                                        ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-100' 
                                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-400'}`}>
                                    <p className="font-semibold text-gray-800">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.specialty}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* --- Step 2: Select Date --- */}
                    <div className={`transition-opacity duration-500 ${step < 2 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        <h4 className="font-bold text-lg mb-3 text-gray-800">2. Pick a Date</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                            {availableDates.map(date => (
                                <button key={date.toISOString()} onClick={() => handleSelect('date', date)} className={`p-2 rounded-lg text-center transition-colors duration-200 border-2 
                                    ${selection.date?.toDateString() === date.toDateString() 
                                        ? 'bg-teal-500 text-white border-transparent shadow-md' 
                                        : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100 hover:border-gray-400'}`}>
                                    <p className="font-semibold text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                    <p className="text-xl font-bold">{date.getDate()}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* --- Step 3: Select Time --- */}
                    <div className={`transition-opacity duration-500 ${step < 3 ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                       <h4 className="font-bold text-lg mb-3 text-gray-800">3. Choose an Available Time</h4>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                           {availableTimes.length > 0 ? availableTimes.map(time => (
                               <button key={time} onClick={() => handleSelect('time', time)} className={`p-3 border-2 rounded-lg font-semibold transition-colors duration-200 
                                    ${selection.time === time 
                                        ? 'bg-teal-500 text-white border-transparent shadow-md' 
                                        : 'border-gray-200 text-gray-800 hover:bg-gray-100 hover:border-gray-400'}`}>
                                   {time}
                               </button>
                           )) : <p className='col-span-full text-gray-500'>No available times for this date.</p>}
                       </div>
                   </div>
                </div>
                
                {/* --- Confirmation Button --- */}
                <div className={`transition-opacity duration-500 mt-6 md:mt-8 border-t border-gray-200 pt-5 text-center ${step < 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <button onClick={handleConfirmBooking} disabled={!isBookingComplete || isSubmitting} className="w-full sm:w-auto bg-orange-500 text-white font-bold py-3 px-12 rounded-lg disabled:opacity-50 transition transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed">
                        {isSubmitting ? <SpinnerIcon /> : 'Confirm Appointment'}
                    </button>
                </div>
            </div>

            <div className="mt-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Appointments</h3>
                {appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map(appt => (
                            <div key={appt._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{appt.counselor.name}</p>
                                    <p className="text-sm text-gray-600">{new Date(appt.date).toLocaleDateString()} at {appt.time}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${appt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : appt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {appt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">You have no appointments.</p>
                )}
            </div>
        </div>
    );
};

export default BookingTab;
