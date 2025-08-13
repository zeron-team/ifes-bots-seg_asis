import React, { useState, useMemo } from 'react';
import { Paper, Typography, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import InteractionRow from './InteractionRow'; // <-- Importamos el nuevo componente

const ConversationDetail = ({ studentGroup, onUpdate }) => {
    const [caseTypeFilter, setCaseTypeFilter] = useState('Todos');

    const filteredInteractions = useMemo(() => {
        if (!studentGroup) return [];
        if (caseTypeFilter === 'Todos') {
            return studentGroup.interactions;
        }
        return studentGroup.interactions.filter(i => i.reason === caseTypeFilter);
    }, [studentGroup, caseTypeFilter]);

    if (!studentGroup) {
        return (
            <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">Selecciona un alumno para ver los detalles</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2, height: '100%', boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
                Historial de: <span style={{ fontWeight: 'bold' }}>{studentGroup.student_name}</span>
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Filtrar por Caso</InputLabel>
                <Select value={caseTypeFilter} label="Filtrar por Caso" onChange={(e) => setCaseTypeFilter(e.target.value)}>
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="Aprobado">Aprobado</MenuItem>
                    <MenuItem value="Desaprobado">Desaprobado</MenuItem>
                    <MenuItem value="Pendiente">Pendiente</MenuItem>
                </Select>
            </FormControl>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width="5%" />
                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Curso / Examen</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Motivo</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="center">Contactado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Ahora mapeamos y renderizamos el componente InteractionRow */}
                        {filteredInteractions.map((interaction) => (
                            <InteractionRow
                                key={interaction.id}
                                interaction={interaction}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ConversationDetail;