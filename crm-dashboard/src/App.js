// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/layout/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // <-- IMPORTANTE

const theme = createTheme(); // Crea un tema por defecto

const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}> {/* <-- Envuelve todo con el proveedor de tema */}
            <Router>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;