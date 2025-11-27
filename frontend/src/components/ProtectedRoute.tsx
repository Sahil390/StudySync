import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    // Check both localStorage and sessionStorage
    const sessionToken = sessionStorage.getItem("token");

    const isAuthenticated = !!token || !!sessionToken;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
