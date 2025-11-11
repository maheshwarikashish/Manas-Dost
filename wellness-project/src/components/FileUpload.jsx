import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { default as api } from '../services/api';

const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const FileUpload = ({ userId, onUploadComplete, simpleIcon = false }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (!acceptedFiles.length) {
            setUploadError("Invalid file type. Please upload a PNG or JPG image.");
            return;
        }

        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('photo', file);

        setIsUploading(true);
        setUploadError(null);

        try {
            // The endpoint is now correct because api.js is fixed
            const res = await api.put(`/auth/user/${userId}/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadComplete(res.data.photoUrl); // Notify parent
        } catch (err) {
            console.error("File upload failed:", err);
            const errorMsg = err.response?.data?.message || 'Upload failed. Please try again.';
            setUploadError(errorMsg);
        } finally {
            setIsUploading(false);
        }
    }, [userId, onUploadComplete]);

    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop, 
        // FIX APPLIED HERE: Using the new object format for the accept prop
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        multiple: false,
    });

    // A simpler icon-only version for the profile view
    if (simpleIcon) {
        return (
            <div {...getRootProps()} className="bg-orange-500 rounded-full p-2 cursor-pointer hover:bg-orange-600 transition-colors">
                <input {...getInputProps()} />
                <CameraIcon />
            </div>
        );
    }

    // Default larger dropzone UI (can be used elsewhere if needed)
    return (
        <div {...getRootProps()} className="relative group w-32 h-32 mx-auto rounded-full overflow-hidden cursor-pointer border-4 border-gray-200 hover:border-orange-500 transition-all">
            <input {...getInputProps()} />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm text-center">Change Photo</p>
            </div>
            {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                    <p className="text-sm font-semibold">Uploading...</p>
                </div>
            )}
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
        </div>
    );
};

export default FileUpload;
