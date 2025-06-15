// src/pages/Home.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function Home({ session }) {
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            if (e.target.files[0].size > 2 * 1024 * 1024 * 1024) {
                alert('File is too large! Maximum size is 2GB.');
                e.target.value = '';
                return;
            }
            setFile(e.target.files[0]);
        }
    };

    // --- UPDATED uploadFile FUNCTION WITH BETTER ERROR HANDLING ---
    const uploadFile = async (isPublic) => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        try {
            setUploading(true);
            const user = session.user;

            // Define the file path. This is a common point of error.
            const filePath = `${user.id}/${file.name}`;

            // 1. Upload the file to Supabase Storage
            console.log("Uploading to Storage...");
            const { error: uploadError } = await supabase.storage
                .from('files') // Make sure this bucket name is EXACTLY 'files'
                .upload(filePath, file);

            // Check for a specific error from storage
            if (uploadError) {
                console.error("Error during storage upload:", uploadError);
                throw uploadError; // This will jump to the catch block
            }
            console.log("Storage upload successful!");

            // 2. Insert the file metadata into the 'files' database table
            console.log("Inserting metadata into database...");
            const { error: insertError } = await supabase
                .from('files') // Make sure this table name is EXACTLY 'files'
                .insert({
                    file_name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    file_size: file.size,
                    is_public: isPublic,
                    user_id: user.id
                });
            
            // Check for a specific error from the database insert
            if (insertError) {
                console.error("Error during database insert:", insertError);
                throw insertError; // This will jump to the catch block
            }
            
            console.log("Database insert successful!");
            alert('File uploaded successfully!');

        } catch (error) {
            // This will now catch ANY error from the 'try' block
            alert("Upload Failed! Check the developer console for more details.");
            // This provides a detailed error message for you to debug
            console.error("A detailed error occurred during the upload process:", error);
        } finally {
            setUploading(false);
            setFile(null);
            // Check if the element exists before trying to clear it
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.value = "";
            }
        }
    };

    // The returned JSX is the same as before
    return (
        <div style={{ padding: '20px' }}>
            <h2>Where do you want to upload your file?</h2>
            <input type="file" id="file-input" onChange={handleFileChange} disabled={uploading} />
            
            {file && (
                <div>
                    <p>Selected file: {file.name}</p>
                    <button onClick={() => uploadFile(true)} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload to Public'}
                    </button>
                    <button onClick={() => uploadFile(false)} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload to Private'}
                    </button>
                </div>
            )}
        </div>
    );
}