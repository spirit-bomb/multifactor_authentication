import { StrictMode, useEffect } from 'react';
import React, { createContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true; // Important to send cookies with requests

export const context = createContext({ isAuthenticated: false });

const AppWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/user');
                if (res.data.success) {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) return <div className="text-white text-center mt-20">Checking Authentication...</div>;

    return (
        <context.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <App />
        </context.Provider>
    );
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    </StrictMode>
);