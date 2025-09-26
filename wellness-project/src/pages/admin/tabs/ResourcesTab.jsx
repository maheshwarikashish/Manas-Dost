import React, { useState } from 'react';
import { adminResources } from '../../../data/mockAdminData';
import ReusableModal from '../../../components/admin/ReusableModal';

const ResourcesTab = () => {
    const [resources, setResources] = useState(adminResources);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);

    const handleOpenModal = (resource = null) => {
        setEditingResource(resource);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingResource(null);
        setIsModalOpen(false);
    };

    const handleSave = (formData) => {
        if (editingResource) {
            setResources(resources.map(r => r.id === editingResource.id ? { ...r, ...formData } : r));
        } else {
            setResources([...resources, { id: Date.now(), ...formData }]);
        }
        handleCloseModal();
    };

    const handleDelete = (resourceId) => {
        if (window.confirm('Are you sure?')) {
            setResources(resources.filter(r => r.id !== resourceId));
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-slate-800">Resource Hub Management</h3>
                <button onClick={() => handleOpenModal()} className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition">Add New Resource</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(res => (
                    <div key={res.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h5 className="font-bold">{res.title}</h5>
                        <p className="text-sm text-slate-500">{res.type}</p>
                        <div className="mt-4 flex space-x-2">
                            <button onClick={() => handleOpenModal(res)} className="text-sm bg-slate-200 px-3 py-1 rounded hover:bg-slate-300">Edit</button>
                            <button onClick={() => handleDelete(res.id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <ResourceFormModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSave} resource={editingResource} />
        </div>
    );
};

// Form component inside a modal for adding/editing resources
const ResourceFormModal = ({ isOpen, onClose, onSave, resource }) => {
    const [formData, setFormData] = useState({ title: '', type: 'Article', content: '' });

    React.useEffect(() => {
        if (resource) {
            setFormData(resource);
        } else {
            setFormData({ title: '', type: 'Article', content: '' });
        }
    }, [resource, isOpen]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
        <ReusableModal isOpen={isOpen} onClose={onClose} title={resource ? 'Edit Resource' : 'Add New Resource'}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div><label className="block font-semibold text-slate-700 mb-1">Title</label><input id="title" value={formData.title} onChange={handleChange} type="text" className="w-full p-2 border rounded-lg" required /></div>
                    <div><label className="block font-semibold text-slate-700 mb-1">Type</label><select id="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded-lg"><option>Article</option><option>Video</option></select></div>
                    <div><label className="block font-semibold text-slate-700 mb-1">Content / URL</label><textarea id="content" value={formData.content} onChange={handleChange} className="w-full p-2 border rounded-lg h-24" placeholder="Enter full article text or a YouTube video URL"></textarea></div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold px-5 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700">Save Resource</button>
                </div>
            </form>
        </ReusableModal>
    );
};


export default ResourcesTab;