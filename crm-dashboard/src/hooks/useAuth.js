// src/hooks/useAuth.js
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Este hook es ahora un atajo para acceder a nuestro AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};