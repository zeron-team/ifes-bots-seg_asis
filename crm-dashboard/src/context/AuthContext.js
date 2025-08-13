// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

// 1. Crea el contexto
const AuthContext = createContext(null);

// 2. Crea el componente Proveedor que contendrá toda la lógica
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }, [token]);

    const login = async (username, password) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        try {
            const response = await apiClient.post('/token', params, {
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            if (response.data.access_token) {
                setToken(response.data.access_token);
                navigate('/dashboard');
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: 'Usuario o contraseña incorrectos.' };
        }
    };

    const logout = () => {
        setToken(null);
        navigate('/login');
    };

    // El valor que se comparte con toda la app
    const value = {
        token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Exporta el contexto para poder usarlo con useContext
export default AuthContext;