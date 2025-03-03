"use client"
import React from 'react';
import Button from '@mui/material/Button';

export default function LoginPage() {
    const handleLogin = () => {
        // Call Next’s /api/login which sends us to the FastAPI -> Spotify
        window.location.href = '/api/login';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
}
