// src/pages/PrivateUploads.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';

// --- NEW HELPER FUNCTION ---
// This function converts bytes into a human-readable format (KB, MB, GB).
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function PrivateUploads() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    // --- NEW STATE for the search term ---
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPrivateFiles = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('files')
                    .select('*')
                    .eq('is_public', false)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setFiles(data);
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPrivateFiles();
    }, []);

    const handleDelete = async (fileId, filePath) => {
        if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) {
            return;
        }
        try {
            const { error: storageError } = await supabase.storage.from('files').remove([filePath]);
            if (storageError) throw storageError;

            const { error: dbError } = await supabase.from('files').delete().eq('id', fileId);
            if (dbError) throw dbError;

            setFiles(files.filter(file => file.id !== fileId));
            alert("File deleted successfully!");
        } catch (error) {
            alert("Error deleting file: " + error.message);
        }
    };

    // --- NEW FILTERING LOGIC ---
    // This filters the 'files' array based on the 'searchTerm' in real-time.
    const filteredFiles = files.filter(file =>
        file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p style={{ padding: '20px' }}>Loading files...</p>;

    // --- UPDATED AND MORE ADVANCED JSX / UI ---
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>My Private Uploads</h2>
                {/* This is the new, functional search bar */}
                <input
                    type="text"
                    placeholder="Search your private files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            {/* We now use a table for a much cleaner look */}
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
                    {/* We check if there are any files to display after filtering */}
                    {filteredFiles.length > 0 ? (
                        filteredFiles.map(file => (
                            <tr key={file.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{file.file_name}</td>
                                <td style={{ padding: '12px' }}>{file.file_type}</td>
                                <td style={{ padding: '12px' }}>{formatBytes(file.file_size)}</td>
                                <td style={{ padding: '12px' }}>{new Date(file.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDelete(file.id, file.file_path)}
                                        style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px 12px' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // This message shows if there are no files or if the search finds nothing.
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                {searchTerm ? `No files found for "${searchTerm}"` : "You haven't uploaded any private files yet."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}