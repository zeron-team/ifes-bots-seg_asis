// src/components/layout/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../hooks/useAuth'; // Asumimos que useAuth expone logout

const Navbar = ({ onMenuClick }) => {
    const { logout } = useAuth();

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#1e293b' }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { sm: 'none' } }} // Se muestra en móvil
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    CRM Chatbot
                </Typography>
                <Button color="inherit" onClick={logout}>
                    Cerrar Sesión
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;