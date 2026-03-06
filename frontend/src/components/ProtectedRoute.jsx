import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;

    // Not authenticated
    if (!user) return <Navigate to="/login" replace />;

    // Role check
    if (role && user.role !== role && user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return children;
}