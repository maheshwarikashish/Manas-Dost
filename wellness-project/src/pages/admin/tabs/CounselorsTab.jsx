import React, { useState } from 'react';
import { adminCounselors } from '../../../data/mockAdminData';
import ReusableModal from '../../../components/admin/ReusableModal';

const CounselorsTab = () => {
    const [counselors, setCounselors] = useState(adminCounselors);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleSave = (formData) => {
        // In a real app, you'd handle create/update differently.
        // For this mock, we'll just add a new one.
        setCounselors([...counselors, { id: Date.now(), load: 0, ...formData }]);
        setIsModalOpen(false);
    };

    const handleDelete = (counselorId) => {
        if (window.confirm('Are you sure you want to remove this counselor?')) {
            setCounselors(counselors.filter(c => c.id !== counselorId));
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-slate-800">Counselor Management</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition">Add New Counselor</button>
            </div>
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-md">
                {counselors.map(c => (
                     <div key={c.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
                        <div>
                            <h5 className="font-bold text-lg">{c.name}</h5>
                            <p className="text-sm text-slate-500">{c.specialty}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">{c.load}% Booked</span>
                            <button onClick={() => handleDelete(c.id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">Remove</button>
                        </div>
                    </div>
                ))}
            </div>
            <CounselorFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </div>
    );
};

// Form component inside a modal for adding a counselor
const CounselorFormModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', specialty: '' });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', specialty: '' });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <ReusableModal isOpen={isOpen} onClose={onClose} title="Add New Counselor">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div><label className="block font-semibold text-slate-700 mb-1">Full Name</label><input id="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-2 border rounded-lg" required /></div>
                    <div><label className="block font-semibold text-slate-700 mb-1">Specialty</label><input id="specialty" value={formData.specialty} onChange={handleChange} type="text" className="w-full p-2 border rounded-lg" placeholder="e.g., Anxiety & Stress" required /></div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold px-5 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700">Save Counselor</button>
                </div>
            </form>
        </ReusableModal>
    );
};

export default CounselorsTab;