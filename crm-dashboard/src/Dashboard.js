// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import apiClient from './api';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await apiClient.get('/api/v1/dashboard/stats');
                setStats(statsRes.data);

                const convosRes = await apiClient.get('/api/v1/dashboard/conversations');
                setConversations(convosRes.data);
            } catch (err) {
                setError('No se pudo cargar la data. ¿Iniciaste sesión?');
                console.error(err);
            }
        };
        fetchData();
    }, []);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!stats) return <p>Cargando...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard de Seguimiento</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h2>{stats.total_sent}</h2>
                    <p>Enviados</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h2>{stats.total_responses}</h2>
                    <p>Respuestas</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                    <h2>{stats.response_rate}%</h2>
                    <p>Tasa de Respuesta</p>
                </div>
            </div>

            <h2>Conversaciones Recientes</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Fecha</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Alumno</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Motivo</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Respuesta</th>
                    </tr>
                </thead>
                <tbody>
                    {conversations.map(convo => (
                        <tr key={convo.id}>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{new Date(convo.sent_at).toLocaleString()}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{convo.student_name}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{convo.reason}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>
                                {convo.responses.length > 0 ? convo.responses[0].message_body : '---'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
