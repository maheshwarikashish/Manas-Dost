import React, { useState, useMemo, useEffect } from 'react';
import ReusableModal from '../../../components/admin/ReusableModal';
import { default as api } from '../../../services/api';

const ResourcesTab = () => {
    const [resources, setResources] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchResources = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/resources');
            setResources(response.data);
        } catch (error) {
            console.error("Failed to fetch resources:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleOpenModal = (resource = null) => {
        setEditingResource(resource);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingResource(null);
        setIsModalOpen(false);
    };

    const handleSave = async (formData) => {
        try {
            if (editingResource) {
                await api.put(`/resources/${editingResource._id}`, formData);
            } else {
                await api.post('/resources', formData);
            }
            fetchResources();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save resource:", error);
        }
    };

    const handleDelete = async (resourceId) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await api.delete(`/resources/${resourceId}`);
                fetchResources();
            } catch (error) {
                console.error("Failed to delete resource:", error);
            }
        }
    };

    const filteredResources = useMemo(() => {
        return resources.filter(res => 
            res.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [resources, searchTerm]);
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div className="mb-4 md:mb-0">
                    <h3 className="text-4xl font-bold text-gray-800">Resource Hub</h3>
                    <p className="text-lg text-gray-500 mt-1">Manage articles, videos, and more.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                    Add New Resource
                </button>
            </div>

            <div className="mb-8">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for resources..."
                    className="w-full max-w-lg p-4 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>

            {isLoading ? <div className="text-center p-10">Loading resources...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredResources.map(res => (
                        <div key={res._id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
                            <div className="p-6">
                                <div className="font-bold text-xl mb-2 text-gray-800">{res.title}</div>
                                <span className={`inline-block bg-opacity-20 rounded-full px-4 py-1 text-sm font-semibold mr-2 mb-2 ${res.type === 'Video' ? 'bg-red-500 text-red-800' : 'bg-green-500 text-green-800'}`}>
                                    {res.type}
                                </span>
                            </div>
                            <div className="px-6 pt-4 pb-6 border-t border-gray-200 flex justify-end space-x-4">
                                <button onClick={() => handleOpenModal(res)} className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold">Edit</button>
                                <button onClick={() => handleDelete(res._id)} className="text-sm text-red-600 hover:text-red-800 font-semibold">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ResourceFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} resource={editingResource} />
        </div>
    );
};


const ResourceFormModal = ({ isOpen, onClose, onSave, resource }) => {
    const [formData, setFormData] = useState({ title: '', type: 'Article', content: '' });

    useEffect(() => {
        if (resource) {
            setFormData({ title: resource.title, type: resource.type, content: resource.content });
        } else {
            setFormData({ title: '', type: 'Article', content: '' });
        }
    }, [resource, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <ReusableModal isOpen={isOpen} onClose={onClose} title={resource ? 'Edit Resource' : 'Add New Resource'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition">
                        <option>Article</option>
                        <option>Video</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content / URL</label>
                    <textarea name="content" value={formData.content} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 transition" placeholder="Enter full article text or a YouTube video URL"></textarea>
                </div>
                <div className="pt-4 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Save Resource</button>
                </div>
            </form>
        </ReusableModal>
    );
};

export default ResourcesTab;
