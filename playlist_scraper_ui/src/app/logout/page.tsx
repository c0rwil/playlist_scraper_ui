"use client"
import React from 'react';
import Button from '@mui/material/Button';

export default function LoginPage() {
    const handleLogout = () => {
        // Call /api/logout which sends us to the FastAPI -> Spotify
        window.location.href = '/api/logout';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
}
