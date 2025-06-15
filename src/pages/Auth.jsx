// src/pages/Auth.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient.js';

// No changes needed to the styles
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
        fontFamily: 'sans-serif',
    },
    card: {
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        marginTop: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
    },
    buttonSecondary: {
        backgroundColor: '#6c757d',
    },
    errorMessage: {
        color: '#dc3545',
        marginTop: '15px',
    }
};

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // --- NEW, ROBUST handleAuthAction FUNCTION ---
    const handleAuthAction = async (actionType) => {
        setError(null);
        setLoading(true);

        let authResult;

        try {
            if (actionType === 'signIn') {
                // Call the function with its full context: supabase.auth.signInWithPassword
                authResult = await supabase.auth.signInWithPassword({ email, password });
            } else if (actionType === 'signUp') {
                // Call the function with its full context: supabase.auth.signUp
                authResult = await supabase.auth.signUp({ email, password });
            }

            // Destructure the error safely from the result
            const { error: authError } = authResult;
            if (authError) throw authError;

        } catch (error) {
            setError(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Kairo</h1>
                <p>Sign in or create an account to continue</p>
                {/* We now pass a simple string to the handler */}
                <form onSubmit={(e) => { e.preventDefault(); handleAuthAction('signIn'); }}>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div>
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => handleAuthAction('signUp')}
                            style={{ ...styles.button, ...styles.buttonSecondary }} 
                            disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                {error && <p style={styles.errorMessage}>{error}</p>}
            </div>
        </div>
    );
}