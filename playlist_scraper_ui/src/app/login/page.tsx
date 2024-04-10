import React from 'react';
import { redirect} from 'next/navigation'; // Import useNavigation
import Button from '@mui/material/Button';

const LoginPage = () => {

    const handleLogin = () => {
        const backendUrl = 'http://localhost:5510/login';
        redirect(backendUrl); // Use navigation.navigate for redirects
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login with Spotify
            </Button>
        </div>
    );
};

export default LoginPage;
