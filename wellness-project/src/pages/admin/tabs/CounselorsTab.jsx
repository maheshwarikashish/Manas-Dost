import React, { useState, useEffect } from 'react';
import api from '../../../services/api'; // Use our central API service
import ReusableModal from '../../../components/admin/ReusableModal';

const CounselorsTab = () => {
    const [counselors, setCounselors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCounselors = async () => {
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
    
    const handleSave = async (formData) => {
        try {
            await api.post('/counselors', formData);
            fetchCounselors(); // Refresh the list
        } catch (err) {
            console.error("Failed to save counselor", err);
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleDelete = async (counselorId) => {
        if (window.confirm('Are you sure you want to remove this counselor?')) {
            try {
                await api.delete(`/counselors/${counselorId}`);
                fetchCounselors(); // Refresh the list
            } catch (err) {
                console.error("Failed to delete counselor", err);
            }
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-slate-800">Counselor Management</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition">Add New Counselor</button>
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
                                <button onClick={() => handleDelete(c._id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <CounselorFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </div>
    );
};

// --- Modal Form Component ---
const CounselorFormModal = ({ isOpen, onClose, onSave }) => { /* ... Form JSX ... */ };

export default CounselorsTab;