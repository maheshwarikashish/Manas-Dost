                                                     
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { default as api } from '../services/api';

const FileUpload = ({ userId, onUploadComplete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (!acceptedFiles.length) return;

        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('photo', file);

        setIsUploading(true);
        setUploadError(null);

        try {
            const res = await api.put(`/users/${userId}/photo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadComplete(res.data.photoUrl); // Notify parent component of new URL
        } catch (err) {
            console.error("File upload failed:", err);
            setUploadError('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [userId, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: 'image/*',
        multiple: false,
    });

    return (
        <div {...getRootProps()} className="relative group w-32 h-32 mx-auto rounded-full overflow-hidden cursor-pointer border-4 border-gray-200 hover:border-teal-500 transition-all duration-300">
            <input {...getInputProps()} />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs text-center">{isDragActive ? 'Drop file' : 'Change Photo'}</p>
            </div>
            {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                    <p className="text-sm font-semibold">Uploading...</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
