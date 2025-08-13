// src/components/dashboard/KPICard.js
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, alpha } from '@mui/material';

const KPICard = ({ title, value, icon, color = 'primary.main' }) => {

    // Función para obtener el color del tema de forma segura
    const getThemeColor = (theme) => {
        const [palette, shade] = color.split('.');
        if (theme.palette[palette] && theme.palette[palette][shade]) {
            return theme.palette[palette][shade];
        }
        return '#000'; // Color por defecto si no se encuentra
    };

    return (
        <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" variant="body1">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                            {value}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            // --- ESTA ES LA CORRECCIÓN ---
                            // Usamos una función que recibe el 'theme' para acceder
                            // al color real antes de pasarlo a la función alpha().
                            backgroundColor: (theme) => alpha(getThemeColor(theme), 0.15),
                            height: 56,
                            width: 56
                        }}
                    >
                        {/* El ícono puede usar el color del tema directamente aquí */}
                        {icon && React.cloneElement(icon, { sx: { color: color, fontSize: '1.75rem' } })}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
};

export default KPICard;