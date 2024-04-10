'use client'
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, CircularProgress, Paper, Avatar } from '@mui/material';

type Playlist = {
    id: string;
    name: string;
    total_tracks: number;
    cover_image: string;
};

const PlaylistsDataGrid = ({ endpoint }: { endpoint: string }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error('Failed to fetch playlists');
                const json = await response.json();
                // Transform the object into an array
                const playlistsArray: Playlist[] = Object.keys(json).map(key => ({
                    id: json[key].id,
                    name: json[key].name,
                    total_tracks: json[key].total_tracks,
                    cover_image: json[key].cover_image
                }));
                setPlaylists(playlistsArray);
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'total_tracks', headerName: 'Total Tracks', type: 'number', width: 130 },
        {
            field: 'cover_image',
            headerName: 'Cover Image',
            width: 180,
            renderCell: (params: GridRenderCellParams) => (
                <Avatar variant="square" src={params.value as string} sx={{ width: 48, height: 48 }} />
            ),
        },
        // Add more columns as needed
    ];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Paper>{error}</Paper>
            </Box>
        );
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={playlists}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            />
        </div>
    );
};

export default PlaylistsDataGrid;
