import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'; // Updated import for the stable version
import Paper from '@mui/material/Paper';
import GenericDataGrid from "@/components/GenericDataGrid";
import Divider from "@mui/material/Divider";
import PieChart from "@/components/PieChart";
import { useTheme } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import PlaylistsDataGrid from "@/components/PlaylistsDataGrid";

export default function HomePage() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                {/* Top Tracks Grid */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 10 }}>
                        <Typography>
                            Top Tracks
                        </Typography>
                        <GenericDataGrid endpoint={"/api/top_tracks"} />
                    </Paper>
                </Grid>

                {/* Top Artists Grid */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 10 }}>
                        <Typography>
                            Top Artists
                        </Typography>
                        <GenericDataGrid endpoint={"/api/top_artists"} />
                    </Paper>
                </Grid>

                {/* Horizontal Divider */}
                <Grid item xs={12}>
                    <Divider flexItem />
                </Grid>
                {/* Playlists Grid  */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 10 }}>
                        <Typography>
                            Top Artists
                        </Typography>
                        <PlaylistsDataGrid endpoint={"/api/playlists"} />
                    </Paper>
                </Grid>

                {/* Pie Chart */}
                <Grid item xs={12} md={12}>
                    <Paper elevation={3} sx={{ height: '100%' }}>
                        <PieChart endpoint={"/api/top_artists"} />
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
}
