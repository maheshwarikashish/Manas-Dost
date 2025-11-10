
import React, { useState, useEffect } from 'react';
import ReusableModal from '../../../components/admin/ReusableModal';
import { default as api } from '../../../services/api';

const CounselorsTab = () => {
    const [counselors, setCounselors] = useState([]);
    const [appointments, setAppointments] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCounselor, setEditingCounselor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCounselorId, setExpandedCounselorId] = useState(null);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

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

    const handleToggleAppointments = async (counselorId) => {
        if (expandedCounselorId === counselorId) {
            setExpandedCounselorId(null);
        } else {
            setExpandedCounselorId(counselorId);
            if (!appointments[counselorId]) {
                setIsLoadingAppointments(true);
                try {
                    const res = await api.get(`/appointments/counselor/${counselorId}`);
                    setAppointments(prev => ({ ...prev, [counselorId]: res.data }));
                } catch (err) {
                    console.error("Failed to fetch appointments", err);
                } finally {
                    setIsLoadingAppointments(false);
                }
            }
        }
    };

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
                                    <th scope="col" className="px-8 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Appointments</th>
                                    <th scope="col" className="px-8 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {counselors.map(c => (
                                    <React.Fragment key={c._id}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="text-md font-medium text-gray-900">{c.name}</div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="text-md text-gray-600">{c.specialty}</div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <button onClick={() => handleToggleAppointments(c._id)} className="text-blue-600 hover:text-blue-800 font-semibold">
                                                    {expandedCounselorId === c._id ? 'Hide' : 'View'} Appointments
                                                </button>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right text-md font-medium">
                                                <div className="flex items-center justify-end space-x-5">
                                                    <button onClick={() => handleOpenModal(c)} className="text-indigo-600 hover:text-indigo-800 font-semibold">Edit</button>
                                                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800 font-semibold">Remove</button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedCounselorId === c._id && (
                                            <tr>
                                                <td colSpan="4" className="p-4 bg-gray-50">
                                                    {isLoadingAppointments ? (
                                                        <p className='text-center'>Loading appointments...</p>
                                                    ) : (
                                                        <div>
                                                            <h5 className="font-bold text-gray-800 mb-2">Appointments for {c.name}</h5>
                                                            {appointments[c._id]?.length > 0 ? (
                                                                <table className="min-w-full divide-y divide-gray-200 mt-2">
                                                                    <thead className='bg-gray-100'>
                                                                        <tr>
                                                                            <th className='px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase'>Student</th>
                                                                            <th className='px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase'>Date</th>
                                                                            <th className='px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase'>Time</th>
                                                                            <th className='px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase'>Status</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {appointments[c._id].map(appt => (
                                                                            <tr key={appt._id}>
                                                                                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>{appt.student.name}</td>
                                                                                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-600'>{new Date(appt.date).toLocaleDateString()}</td>
                                                                                <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-600'>{appt.time}</td>
                                                                                <td className='px-4 py-2 whitespace-nowrap text-sm'>
                                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : appt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                                        {appt.status}
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <p className='text-gray-500 mt-2'>No appointments scheduled.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
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
