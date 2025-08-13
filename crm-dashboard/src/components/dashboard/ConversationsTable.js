import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Checkbox, TablePagination, Tooltip, Chip, Box,
    Collapse, IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import apiClient from '../../api/apiClient';

// Componente interno para una fila de la tabla principal
const Row = ({ studentGroup, onUpdate }) => {
    const { student_name, interactions } = studentGroup;
    const [open, setOpen] = useState(false);

    const summary = interactions.reduce((acc, i) => {
        acc[i.reason] = (acc[i.reason] || 0) + 1;
        return acc;
    }, {});

    const handleToggleContacted = async (interactionId) => {
        try {
            await apiClient.put(`/api/v1/conversations/${interactionId}/toggle_contacted`);
            onUpdate();
        } catch (error) {
            console.error("Failed to update contacted status", error);
        }
    };

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography variant="subtitle2">{student_name}</Typography>
                </TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {summary['Aprobado'] > 0 && (
                            <Tooltip title="Aprobados">
                                <Chip label={summary['Aprobado']} color="success" size="small" />
                            </Tooltip>
                        )}
                        {summary['Desaprobado'] > 0 && (
                            <Tooltip title="Desaprobados">
                                <Chip label={summary['Desaprobado']} color="error" size="small" />
                            </Tooltip>
                        )}
                        {summary['Pendiente'] > 0 && (
                            <Tooltip title="Pendientes">
                                <Chip label={summary['Pendiente']} color="default" size="small" />
                            </Tooltip>
                        )}
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Historial de Seguimiento
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Curso / Examen</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Motivo</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Contactado</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {interactions.map((interaction) => (
                                        <TableRow key={interaction.id}>
                                            <TableCell>
                                                {new Date(interaction.sent_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                                            </TableCell>
                                            {/* --- LÍNEA A VERIFICAR --- */}
                                            {/* Muestra el nombre del examen. Si está vacío, es porque el dato no está en la BD. */}
                                            <TableCell>{interaction.quiz_name}</TableCell>
                                            <TableCell>
                                                <Chip label={interaction.reason} size="small" />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Checkbox
                                                    color="primary"
                                                    checked={interaction.contacted}
                                                    onChange={() => handleToggleContacted(interaction.id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

const ConversationsTable = ({
    studentGroups = [],
    total = 0,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    onUpdate
}) => {
    return (
        <Paper sx={{ boxShadow: 3, overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
                Seguimiento por Alumno
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 'bold', backgroundColor: 'action.hover' } }}>
                            <TableCell padding="checkbox" width="5%" />
                            <TableCell width="35%">Alumno</TableCell>
                            <TableCell width="60%">Resumen de Interacciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentGroups.map((group) => (
                            <Row key={group.student_name} studentGroup={group} onUpdate={onUpdate} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Paper>
    );
};

export default ConversationsTable;