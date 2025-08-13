import React, { useState } from 'react';
import { TableRow, TableCell, Checkbox, Chip, Box, Collapse, Typography, IconButton, Paper } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const InteractionRow = ({ interaction, onUpdate }) => {
    const [open, setOpen] = useState(false);

    // Función para generar el texto del mensaje del bot
    const getBotMessageText = (reason, quizName) => {
        switch (reason) {
            case 'Aprobado':
                return `¡Felicitaciones! Has aprobado el examen: "${quizName}".`;
            case 'Desaprobado':
                return `Notamos que has rendido el examen: "${quizName}". ¿Necesitas ayuda para prepararte para el recuperatorio?`;
            case 'Pendiente':
                return `Hola, vimos que no te presentaste a rendir el examen: "${quizName}". ¿Tuviste alguna dificultad?`;
            default:
                return 'Interacción registrada.';
        }
    };

    return (
        <React.Fragment>
            {/* Fila de resumen de la interacción */}
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{new Date(interaction.sent_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                <TableCell>{interaction.quiz_name}</TableCell>
                <TableCell>
                    <Chip label={interaction.reason} size="small" />
                </TableCell>
                <TableCell align="center">
                    <Checkbox
                        color="primary"
                        checked={interaction.contacted}
                        onChange={() => onUpdate(interaction.id)}
                    />
                </TableCell>
            </TableRow>

            {/* Fila colapsable con el diálogo de la conversación */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Diálogo de la Interacción
                            </Typography>
                            {/* Mensaje del Bot */}
                            <Paper elevation={1} sx={{ p: 1.5, mb: 1, maxWidth: '80%', bgcolor: '#e3f2fd' }}>
                                <Typography variant="body2">
                                    {getBotMessageText(interaction.reason, interaction.quiz_name)}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ textAlign: 'right', color: 'text.secondary', mt: 0.5 }}>
                                    Bot
                                </Typography>
                            </Paper>

                            {/* Respuesta del Alumno */}
                            {interaction.responses && interaction.responses.length > 0 ? (
                                <Paper elevation={1} sx={{ p: 1.5, ml: 'auto', maxWidth: '80%', bgcolor: 'success.light' }}>
                                    <Typography variant="body2">
                                        {interaction.responses[0].message_body}
                                    </Typography>
                                    <Typography variant="caption" display="block" sx={{ textAlign: 'right', color: 'text.secondary', mt: 0.5 }}>
                                        Alumno
                                    </Typography>
                                </Paper>
                            ) : (
                                <Paper elevation={1} sx={{ p: 1.5, ml: 'auto', maxWidth: '80%', bgcolor: 'grey.300' }}>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        El alumno aún no ha respondido.
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default InteractionRow;