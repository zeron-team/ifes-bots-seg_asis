import React from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Box, TablePagination, TextField } from '@mui/material';

const StudentListTable = ({
    studentGroups = [], total = 0, page, rowsPerPage,
    onPageChange, onRowsPerPageChange, onStudentSelect, selectedStudentName,
    nameFilter, onNameFilterChange
}) => {
    return (
        <Paper sx={{ boxShadow: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Alumnos
                </Typography>
                <TextField
                    label="Buscar por nombre"
                    variant="outlined"
                    size="small"
                    value={nameFilter}
                    onChange={(e) => onNameFilterChange(e.target.value)}
                />
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ '& .MuiTableCell-root': { fontWeight: 'bold', backgroundColor: 'action.hover' } }}>
                            <TableCell>Alumno</TableCell>
                            <TableCell>Resumen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentGroups.map((group) => {
                            const summary = group.interactions.reduce((acc, i) => {
                                acc[i.reason] = (acc[i.reason] || 0) + 1;
                                return acc;
                            }, {});

                            return (
                                <TableRow
                                    hover
                                    key={group.student_name}
                                    onClick={() => onStudentSelect(group)}
                                    selected={selectedStudentName === group.student_name}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>{group.student_name}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {summary['Aprobado'] > 0 && <Chip label={summary['Aprobado']} color="success" size="small" />}
                                            {summary['Desaprobado'] > 0 && <Chip label={summary['Desaprobado']} color="error" size="small" />}
                                            {summary['Pendiente'] > 0 && <Chip label={summary['Pendiente']} color="default" size="small" />}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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

export default StudentListTable;