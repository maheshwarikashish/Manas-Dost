import React, { useState, useEffect } from 'react';

const EmergencyTab = () => {
    // State to toggle between showing saved contacts and the edit form
    const [view, setView] = useState('display'); 
    
    // State to hold the contact information from the form
    const [contacts, setContacts] = useState({
        c1name: '', c1phone: '',
        c2name: '', c2phone: ''
    });

    // State to show a temporary "Saved!" message
    const [showConfirm, setShowConfirm] = useState(false);

    // This effect runs once when the component loads
    useEffect(() => {
        // Try to load saved contacts from the browser's local storage
        const savedContacts = JSON.parse(localStorage.getItem('manasDostEmergencyContacts'));
        if (savedContacts && savedContacts.c1name) {
            setContacts(savedContacts);
        } else {
            // If no contacts are saved, open the edit view by default
            setView('edit'); 
        }
    }, []);

    // Handles changes for all input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContacts(prevContacts => ({
            ...prevContacts,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Save the current contact state to local storage
        localStorage.setItem('manasDostEmergencyContacts', JSON.stringify(contacts));
        setView('display'); // Switch back to the display view
        setShowConfirm(true); // Show the confirmation message
        setTimeout(() => setShowConfirm(false), 2000); // Hide the message after 2 seconds
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-4">Emergency Help 🚨</h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
                If you need help immediately, please use these official contacts. You can also add your own personal contacts for quick access.
            </p>
            
            {/* --- Static Helpline Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-100 p-6 rounded-2xl shadow-lg border border-red-200 text-center">
                    <h3 className="text-xl font-bold text-red-800">College Helpline</h3>
                    <p className="mt-1 text-red-700">For any on-campus emergency.</p>
                    <a href="tel:18001234567" className="mt-4 inline-block bg-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition">
                        Call Now: 1800-123-4567
                    </a>
                </div>
                <div className="bg-blue-100 p-6 rounded-2xl shadow-lg border border-blue-200 text-center">
                    <h3 className="text-xl font-bold text-blue-800">Ambulance</h3>
                    <p className="mt-1 text-blue-700">For any medical emergency.</p>
                    <a href="tel:102" className="mt-4 inline-block bg-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
                        Call Now: 102
                    </a>
                </div>
            </div>

            {/* --- Personal Contacts Section --- */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                {view === 'display' ? (
                    // --- Display View ---
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">Your Personal Contacts</h3>
                            <button onClick={() => setView('edit')} className="text-sm bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300">Edit</button>
                        </div>
                        <div className="space-y-4">
                            {(contacts.c1name || contacts.c1phone) ? (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-semibold">{contacts.c1name || 'Contact 1'}</p>
                                    <a href={`tel:${contacts.c1phone}`} className="text-blue-600">{contacts.c1phone}</a>
                                </div>
                            ) : (
                                <p className="text-gray-500">You haven't added any personal contacts yet.</p>
                            )}
                            {(contacts.c2name || contacts.c2phone) && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-semibold">{contacts.c2name || 'Contact 2'}</p>
                                    <a href={`tel:${contacts.c2phone}`} className="text-blue-600">{contacts.c2phone}</a>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // --- Edit View ---
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Edit Your Contacts</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold text-gray-700">Contact 1 (e.g., Parent/Guardian)</label>
                                <input name="c1name" value={contacts.c1name} onChange={handleInputChange} type="text" placeholder="Enter name" className="w-full mt-1 p-3 border rounded-lg" />
                                <input name="c1phone" value={contacts.c1phone} onChange={handleInputChange} type="tel" placeholder="Enter phone number" className="w-full mt-2 p-3 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">Contact 2 (e.g., Friend)</label>
                                <input name="c2name" value={contacts.c2name} onChange={handleInputChange} type="text" placeholder="Enter name" className="w-full mt-1 p-3 border rounded-lg" />
                                <input name="c2phone" value={contacts.c2phone} onChange={handleInputChange} type="tel" placeholder="Enter phone number" className="w-full mt-2 p-3 border rounded-lg" />
                            </div>
                        </div>
                        <button onClick={handleSave} className="mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition">Save Contacts</button>
                        {showConfirm && <p className="text-green-600 text-sm mt-2">Contacts saved!</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmergencyTab;