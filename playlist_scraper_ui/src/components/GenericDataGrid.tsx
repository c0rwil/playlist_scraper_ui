// File: components/GenericDataGrid.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';

interface Props {
    endpoint: string;
}

const GenericDataGrid: React.FC<Props> = ({ endpoint }) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error('Failed to fetch');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error: any) {
                setError(error.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    // Assuming each item in data array has an 'id' for DataGrid to use as a.ts key
    const columns: GridColDef[] = data[0] ? Object.keys(data[0]).map(key => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        width: 150,
        editable: true,
    })) : [];

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" variant="h6" textAlign="center">
                {error}
            </Typography>
        );
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
            />
        </div>
    );
};

export default GenericDataGrid;
