// File: components/GenrePieChart.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography } from '@mui/material';

type Artist = {
    id: string;
    name: string;
    genres: string[];
    popularity: number;
    followers: number;
};

const GenrePieChart = ({ endpoint }: { endpoint: string }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error('Failed to fetch');
                const artists: Artist[] = await response.json();
                setData(aggregateGenres(artists));
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    const aggregateGenres = (artists: Artist[]) => {
        const genreCounts: Record<string, number> = {};

        artists.forEach((artist) => {
            artist.genres.forEach((genre) => {
                if (!genreCounts[genre]) {
                    genreCounts[genre] = 0;
                }
                genreCounts[genre]++;
            });
        });

        return Object.keys(genreCounts).map((genre) => ({
            id: genre,
            label: genre,
            value: genreCounts[genre],
        }));
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Genre Composition
            </Typography>
            <PieChart
                series={[
                    {
                        data,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                height={500}
            />
        </Box>
    );
};

export default GenrePieChart;
