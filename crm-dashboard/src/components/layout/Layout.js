// src/components/layout/Layout.js
import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <Navbar onMenuClick={handleDrawerToggle} />
            <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` }, // Ancho del Sidebar
                    ml: { sm: `240px` }, // Margen izquierdo del Sidebar
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Toolbar /> {/* Espaciador para que el contenido no quede debajo del Navbar */}
                <Box component="div" sx={{ flexGrow: 1 }}>
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    );
};

export default Layout;