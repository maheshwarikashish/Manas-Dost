import React, { useState, useEffect } from 'react';
import ReusableModal from '../../../components/admin/ReusableModal';
import { api } from '../../../services/api';

const CounselorsTab = () => {
    const [counselors, setCounselors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCounselor, setEditingCounselor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCounselors = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/counselors');
            setCounselors(res.data);
        } catch (err) {
            console.error("Failed to fetch counselors", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCounselors();
    }, []);

    const handleOpenModal = (counselor = null) => {
        setEditingCounselor(counselor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingCounselor(null);
        setIsModalOpen(false);
    };

    const handleSave = async (formData) => {
        try {
            if (editingCounselor) {
                await api.put(`/counselors/${editingCounselor._id}`, formData);
            } else {
                await api.post('/counselors', formData);
            }
            fetchCounselors();
            handleCloseModal();
        } catch (err) {
            console.error("Failed to save counselor", err);
        }
    };

    const handleDelete = async (counselorId) => {
        if (window.confirm('Are you sure you want to remove this counselor?')) {
            try {
                await api.delete(`/counselors/${counselorId}`);
                fetchCounselors();
            } catch (err) {
                console.error("Failed to delete counselor", err);
            }
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-slate-800">Counselor Management</h3>
                <button onClick={() => handleOpenModal()} className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition">Add New Counselor</button>
            </div>

            {isLoading ? <p>Loading counselors...</p> : (
                <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
                    {counselors.map(c => (
                        <div key={c._id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
                            <div>
                                <h5 className="font-bold text-lg">{c.name}</h5>
                                <p className="text-sm text-slate-500">{c.specialty}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => handleOpenModal(c)} className="text-sm bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">Edit</button>
                                <button onClick={() => handleDelete(c._id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <CounselorFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} counselor={editingCounselor} />
        </div>
    );
};

const CounselorFormModal = ({ isOpen, onClose, onSave, counselor }) => {
    const [formData, setFormData] = useState({ name: '', specialty: '', bio: '' });

    useEffect(() => {
        if (counselor) {
            setFormData({ name: counselor.name, specialty: counselor.specialty, bio: counselor.bio || '' });
        } else {
            setFormData({ name: '', specialty: '', bio: '' });
        }
    }, [counselor, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <ReusableModal isOpen={isOpen} onClose={onClose} title={counselor ? 'Edit Counselor' : 'Add New Counselor'}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div><label className="block font-semibold text-slate-700 mb-1">Name</label><input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-2 border rounded-lg" required /></div>
                    <div><label className="block font-semibold text-slate-700 mb-1">Specialty</label><input name="specialty" value={formData.specialty} onChange={handleChange} type="text" className="w-full p-2 border rounded-lg" required /></div>
                    <div><label className="block font-semibold text-slate-700 mb-1">Biography</label><textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-2 border rounded-lg h-24" placeholder="Briefly describe the counselor..."></textarea></div>
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
