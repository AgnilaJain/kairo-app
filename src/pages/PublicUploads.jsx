// src/pages/PublicUploads.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

// We can reuse the same helper function here
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function PublicUploads() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    // --- NEW STATE to track download progress for a specific file ---
    const [downloading, setDownloading] = useState(null);

    useEffect(() => {
        const fetchPublicFiles = async () => {
            try {
                setLoading(true);
                // This query is now for public files
                const { data, error } = await supabase
                    .from('files')
                    .select('*')
                    .eq('is_public', true) // The only change needed in the query
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setFiles(data);
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicFiles();
    }, []);

    // --- NEW FUNCTION: handleDownload ---
    const handleDownload = async (filePath, fileName) => {
        try {
            setDownloading(fileName); // Set which file is currently downloading
            const { data: blob, error } = await supabase.storage
                .from('files')
                .download(filePath);

            if (error) throw error;

            // Create a URL for the downloaded file blob
            const url = window.URL.createObjectURL(blob);
            // Create a temporary link element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // This sets the name of the downloaded file
            document.body.appendChild(a); // Append the link to the body
            a.click(); // Programmatically click the link to start the download
            document.body.removeChild(a); // Remove the temporary link
            window.URL.revokeObjectURL(url); // Clean up the blob URL

        } catch (error) {
            alert("Error downloading file: " + error.message);
        } finally {
            setDownloading(null); // Reset the downloading state
        }
    };

    const filteredFiles = files.filter(file =>
        file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p style={{ padding: '20px' }}>Loading files...</p>;

    // --- UPDATED JSX / UI for the Public Page ---
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Public Uploads</h2>
                <input
                    type="text"
                    placeholder="Search all public files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '12px' }}>File Name</th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Size</th>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Uploaded On</th>
                        <th style={{ textAlign: 'right', padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredFiles.length > 0 ? (
                        filteredFiles.map(file => (
                            <tr key={file.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{file.file_name}</td>
                                <td style={{ padding: '12px' }}>{file.file_type}</td>
                                <td style={{ padding: '12px' }}>{formatBytes(file.file_size)}</td>
                                <td style={{ padding: '12px' }}>{new Date(file.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    {/* --- NEW DOWNLOAD BUTTON --- */}
                                    <button
                                        onClick={() => handleDownload(file.file_path, file.file_name)}
                                        disabled={downloading === file.file_name}
                                        style={{ backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px 12px' }}
                                    >
                                        {downloading === file.file_name ? 'Downloading...' : 'Download'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                {searchTerm ? `No files found for "${searchTerm}"` : "No public files have been uploaded yet."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}