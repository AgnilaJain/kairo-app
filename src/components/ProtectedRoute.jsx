// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ session }) => {
    // If there is no session, redirect the user to the /login page
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // If there IS a session, render the child route (e.g., Home, PrivateUploads)
    // The <Outlet /> component does this.
    return <Outlet />;
};

export default ProtectedRoute;