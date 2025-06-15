// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient.js';

import Auth from './pages/Auth.jsx';
import Home from './pages/Home.jsx';
import PublicUploads from './pages/PublicUploads.jsx';
import PrivateUploads from './pages/PrivateUploads.jsx';
import Layout from './components/Layout.jsx';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // A simple loading screen
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* If there is NO session, only the /login route is available. */}
        {/* Any other path will redirect to /login. */}
        {!session ? (
          <>
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          /* If there IS a session, the main app routes are available. */
          /* Trying to go to /login will redirect to the home page. */
          <>
            <Route path="/" element={<Layout session={session} />}>
              <Route index element={<Home session={session} />} />
              <Route path="public" element={<PublicUploads />} />
              <Route path="private" element={<PrivateUploads />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;