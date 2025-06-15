// src/components/Layout.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom'; // Make sure Outlet is imported
import { supabase } from '../supabaseClient.js';

const Topbar = ({ session }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleDeleteAccount = () => {
        if (window.confirm("Are you absolutely sure? This is permanent.")) {
            alert("Feature coming soon!");
        }
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #ccc', position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'white', zIndex: 1000 }}>
            <div style={{ width: '200px' }}></div>
            <h1 style={{ margin: 0, cursor: 'pointer' }} onClick={() => window.location.href = '/'}>Kairo</h1>
            <div style={{ width: 'auto', minWidth: '200px', textAlign: 'right', position: 'relative' }} ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px' }}>
                    {session.user.email}
                </button>
                
                {dropdownOpen && (
                    <div style={{
                        position: 'absolute', top: '40px', right: '0', backgroundColor: 'white',
                        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        width: '220px', textAlign: 'left', border: '1px solid #eee'
                    }}>
                        <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>Username</p>
                            <p style={{ margin: '4px 0 0', color: '#555', fontSize: '14px' }}>{session.user.email}</p>
                            <p style={{ margin: '10px 0 0', fontWeight: 'bold' }}>Account Name</p>
                            <p style={{ margin: '4px 0 0', color: '#555', fontSize: '14px' }}>{session.user.email}</p>
                        </div>
                        <ul style={{ listStyle: 'none', padding: '10px 0', margin: 0 }}>
                            <li onClick={() => supabase.auth.signOut()} style={{ padding: '10px 15px', cursor: 'pointer' }}>Log Out</li>
                            <li onClick={handleDeleteAccount} style={{ padding: '10px 15px', cursor: 'pointer', color: '#dc3545' }}>Delete Account</li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

const Sidebar = () => (
    <aside style={{ width: '200px', borderRight: '1px solid #ccc', height: '100vh', position: 'fixed', paddingTop: '60px', backgroundColor: '#f8f9fa' }}>
        <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                <li style={{ padding: '10px 20px' }}><Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link></li>
                <li style={{ padding: '10px 20px' }}><Link to="/public" style={{ textDecoration: 'none', color: '#333' }}>Public Uploads</Link></li>
                <li style={{ padding: '10px 20px' }}><Link to="/private" style={{ textDecoration: 'none', color: '##333' }}>Private Uploads</Link></li>
            </ul>
        </nav>
    </aside>
);

// The main Layout component now uses <Outlet /> to render the child route.
export default function Layout({ session }) {
    return (
        <div>
            <Topbar session={session} />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '200px', paddingTop: '60px', width: '100%' }}>
                    <Outlet /> {/* This is the placeholder for Home, Public, etc. */}
                </main>
            </div>
        </div>
    );
}