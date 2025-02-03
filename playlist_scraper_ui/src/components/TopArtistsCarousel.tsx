"use client"
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Typography, Avatar } from '@mui/material';

type Artist = {
    id: string;
    name: string;
    image: string; // This should be the image URL
};

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
};

const TopArtistsCarousel = ({ endpoint }: { endpoint: string }) => {
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error('Failed to fetch top artists');
                const artists: Artist[] = await response.json();
                setTopArtists(artists); // Assuming the API returns an array of artists
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Slider {...settings}>
            {topArtists.map((artist) => (
                <div key={artist.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar src={artist.image} sx={{ width: 150, height: 150 }} />
                        <Typography>{artist.name}</Typography>
                    </Box>
                </div>
            ))}
        </Slider>
    );
};

export default TopArtistsCarousel;
