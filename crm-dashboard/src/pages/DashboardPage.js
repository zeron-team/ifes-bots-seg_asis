import React, { useMemo, useState, useEffect } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDebounce } from 'use-debounce';

import KPICard from '../components/dashboard/KPICard';
import StudentListTable from '../components/dashboard/StudentListTable';
import ConversationDetail from '../components/dashboard/ConversationDetail';

import { Container, Grid, Typography, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import apiClient from '../api/apiClient';

const DashboardPage = () => {
    const [nameFilter, setNameFilter] = useState('');
    const [debouncedFilter] = useDebounce(nameFilter, 500);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const {
        stats, conversations, loading, error, totalConversations,
        page, setPage, rowsPerPage, setRowsPerPage, reloadData
    } = useDashboardData(debouncedFilter, selectedYear, selectedMonth);

    const handleToggleContacted = async (interactionId) => {
        await apiClient.put(`/api/v1/conversations/${interactionId}/toggle_contacted`);
        reloadData();
    };

    const studentGroups = useMemo(() => {
        if (!conversations) return [];
        const groups = conversations.reduce((acc, convo) => {
            const key = convo.student_name;
            if (!acc[key]) {
                acc[key] = { student_name: key, interactions: [] };
            }
            acc[key].interactions.push(convo);
            acc[key].interactions.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
            return acc;
        }, {});
        return Object.values(groups);
    }, [conversations]);

    useEffect(() => {
        if (selectedStudent) {
            const updatedStudent = studentGroups.find(g => g.student_name === selectedStudent.student_name);
            setSelectedStudent(updatedStudent);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentGroups]);

    const years = [2024, 2025];
    const months = [
        { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
    ];

    if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

    return (
        <Container maxWidth="xl" sx={{pb: 4}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Resumen de Seguimiento Académico</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Mes</InputLabel>
                        <Select value={selectedMonth} label="Mes" onChange={(e) => setSelectedMonth(e.target.value)}>
                            {months.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Año</InputLabel>
                        <Select value={selectedYear} label="Año" onChange={(e) => setSelectedYear(e.target.value)}>
                            {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* --- SINTAXIS DEL GRID CORREGIDA --- */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid xs={12} sm={6} md={3}><KPICard title="Alumnos Pendientes" value={stats?.pending_contact_students_count || 0} color="error.main" /></Grid>
                <Grid xs={12} sm={6} md={3}><KPICard title="Alumnos Contactados" value={stats?.contacted_students_count || 0} color="success.main" /></Grid>
                <Grid xs={12} sm={6} md={3}><KPICard title="Total Interacciones" value={stats?.total_sent || 0} color="primary.main" /></Grid>
                <Grid xs={12} sm={6} md={3}><KPICard title="Tasa de Respuesta" value={`${stats?.response_rate || 0}%`} color="warning.main" /></Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid xs={12} md={5}>
                    {loading ? <CircularProgress /> : (
                        <StudentListTable
                            studentGroups={studentGroups}
                            total={totalConversations}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                            onStudentSelect={setSelectedStudent}
                            selectedStudentName={selectedStudent?.student_name}
                            nameFilter={nameFilter}
                            onNameFilterChange={setNameFilter}
                        />
                    )}
                </Grid>

                <Grid xs={12} md={7}>
                    <ConversationDetail
                        studentGroup={selectedStudent}
                        onUpdate={handleToggleContacted}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;