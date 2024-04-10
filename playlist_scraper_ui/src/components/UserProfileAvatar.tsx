"use client"
import React, { useEffect, useState } from 'react';
import { Avatar, Box, CircularProgress } from '@mui/material';

type UserProfile = {
    display_name: string;
    profile_picture: string;
};

const UserProfileAvatar = ({ endpoint }: { endpoint: string }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile.');
                }
                const data: UserProfile = await response.json();
                setUserProfile(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!userProfile) {
        // You might want to handle the null case more gracefully in production
        return <Avatar />; // Shows default avatar if no profile is loaded
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar alt={userProfile.display_name} src={userProfile.profile_picture} />
            <span>{userProfile.display_name}</span>
        </Box>
    );
};

export default UserProfileAvatar;
