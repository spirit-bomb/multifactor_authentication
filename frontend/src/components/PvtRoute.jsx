import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const PrivateRoute = () => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me'); // token check route
                setAuth(res.data.success);
            } catch {
                setAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div className="text-center mt-20 text-white">Checking authentication...</div>;
    return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
