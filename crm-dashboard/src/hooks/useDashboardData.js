import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export const useDashboardData = (nameFilter, year, month) => {
    const [stats, setStats] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [totalConversations, setTotalConversations] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const skip = page * rowsPerPage;
            const limit = rowsPerPage;

            // Construye los parámetros de consulta
            const params = new URLSearchParams({
                skip: skip,
                limit: limit,
            });
            if (nameFilter) params.append('student_name', nameFilter);
            if (year) params.append('year', year);
            if (month) params.append('month', month);

            const conversationsUrl = `/api/v1/dashboard/conversations?${params.toString()}`;

            // Construye los parámetros para las estadísticas
            const statsParams = new URLSearchParams();
            if (year) statsParams.append('year', year);
            if (month) statsParams.append('month', month);
            const statsUrl = `/api/v1/dashboard/stats?${statsParams.toString()}`;

            const [statsRes, convosRes] = await Promise.all([
                apiClient.get(statsUrl),
                apiClient.get(conversationsUrl)
            ]);

            setStats(statsRes.data);
            setConversations(convosRes.data.items);
            setTotalConversations(convosRes.data.total);

        } catch (err) {
            setError('No se pudo cargar la data.');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, nameFilter, year, month]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        stats, conversations, loading, error, totalConversations,
        page, setPage, rowsPerPage, setRowsPerPage, reloadData: fetchData
    };
};