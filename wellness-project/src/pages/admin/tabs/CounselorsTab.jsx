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
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-4xl font-bold text-gray-800">Counselor Management</h3>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                    Add New Counselor
                </button>
            </div>

            {isLoading ? <div className="text-center p-10">Loading counselors...</div> : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Specialty</th>
                                    <th scope="col" className="px-8 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {counselors.map(c => (
                                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="text-md font-medium text-gray-900">{c.name}</div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="text-md text-gray-600">{c.specialty}</div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right text-md font-medium">
                                            <div className="flex items-center justify-end space-x-5">
                                                <button onClick={() => handleOpenModal(c)} className="text-indigo-600 hover:text-indigo-800 font-semibold">Edit</button>
                                                <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800 font-semibold">Remove</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <input name="specialty" value={formData.specialty} onChange={handleChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 transition" placeholder="Briefly describe the counselor..."></textarea>
                </div>
                <div className="pt-4 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Save Counselor</button>
                </div>
            </form>
        </ReusableModal>
    );
};

export default CounselorsTab;
