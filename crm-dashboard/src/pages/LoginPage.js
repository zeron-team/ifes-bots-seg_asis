// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
// Podrías crear un componente de UI para el formulario en /components/auth/LoginForm.js

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result && result.error) {
            setError(result.error);
        }
    };

    return (
        // El mismo JSX del formulario de antes
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <form onSubmit={handleSubmit} style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2>Iniciar Sesión</h2>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" style={{ display: 'block', margin: '10px 0', padding: '10px', width: '250px' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" style={{ display: 'block', margin: '10px 0', padding: '10px', width: '250px' }} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ingresar</button>
            </form>
        </div>
    );
};

export default LoginPage;