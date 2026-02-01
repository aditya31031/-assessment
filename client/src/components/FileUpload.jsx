import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import iconFile from '../assets/icon-file.png';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage('');
            setStatus('');
            setUploadProgress(0); // Reset progress on new file
        }
    };

    const handleTriggerFileSelect = () => {
        document.getElementById('fileInput').click();
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            setStatus('error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setUploadProgress(0);

        // ARITIFICIAL DELAY: 5 Seconds
        // We will simulate progress from 0% to 90% over 5 seconds
        const totalDuration = 5000;
        const intervalTime = 50;
        const steps = totalDuration / intervalTime;
        let currentStep = 0;

        const progressInterval = setInterval(() => {
            currentStep++;
            const simulatedProgress = Math.min(90, Math.round((currentStep / steps) * 90));
            setUploadProgress(simulatedProgress);
        }, intervalTime);

        try {
            // Wait for the full 5 seconds BEFORE starting the actual upload request
            await new Promise(resolve => setTimeout(resolve, totalDuration));
            clearInterval(progressInterval);

            // Now do the actual upload
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // We don't really need onUploadProgress here effectively since the file is local and tiny,
                // but we can let it bump from 90 to 100.
                onUploadProgress: (progressEvent) => {
                    // Map the real upload (which is fast) to the remaining 10% (90-100)
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    const finalStage = 90 + Math.round(percentCompleted * 0.1);
                    setUploadProgress(finalStage);
                }
            });
            setMessage(`Success! ${res.data.count || ''} records imported.`);
            setStatus('success');
            setFile(null);
            setUploadProgress(100);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            clearInterval(progressInterval);
            setMessage('Error uploading file: ' + (error.response?.data?.error || error.message));
            setStatus('error');
            setUploadProgress(0);
        } finally {
            clearInterval(progressInterval);
            setLoading(false);
        }
    };

    return (
        <div className="card upload-card-wrapper">
            <h2 className="section-title">Upload Users</h2>

            <div className="file-selection-area" style={{ marginBottom: '2rem' }}>
                <input
                    id="fileInput"
                    type="file"
                    className="file-input-hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexDirection: 'column' }}>
                    <div className="icon-container">
                        <img
                            src={iconFile}
                            alt="CSV File"
                            style={{ width: '80px', height: 'auto', display: 'block' }}
                        />
                    </div>

                    <button
                        className="btn-secondary"
                        onClick={handleTriggerFileSelect}
                        style={{
                            background: 'white',
                            border: '1px solid #cbd5e1',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: '500',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Choose CSV File
                    </button>

                    <p style={{ margin: '0.5rem 0 0 0', height: '24px', color: file ? '#0f172a' : '#94a3b8', fontWeight: file ? 600 : 400 }}>
                        {file ? file.name : "No file chosen"}
                    </p>
                </div>
            </div>

            <div>
                <button
                    className="btn-primary"
                    onClick={handleUpload}
                    disabled={!file || loading}
                    style={{ width: '100%', maxWidth: '300px' }}
                >
                    {loading ? 'Processing...' : 'Upload CSV'}
                </button>

                {loading && (
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${uploadProgress}% ` }}
                        ></div>
                    </div>
                )}
            </div>

            {message && (
                <div className={`status - message ${status} `}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
