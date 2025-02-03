"use client";
import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";

type Artist = {
    id: string;
    name: string;
    genres: string[];
    popularity: number;
    followers: number;
};

type GenreData = {
    id: string;
    label: string;
    value: number;
};

interface GenrePieChartProps {
    endpoint: string;
}

export default function GenrePieChart({ endpoint }: GenrePieChartProps) {
    const [data, setData] = useState<GenreData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [genreColors, setGenreColors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }
                const artists: Artist[] = await response.json();
                const aggregatedData = aggregateGenres(artists);

                setData(aggregatedData);
                setGenreColors(generateColorMap(aggregatedData.map((g) => g.id)));
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    const aggregateGenres = (artists: Artist[]): GenreData[] => {
        const genreCounts: Record<string, number> = {};

        artists.forEach((artist) => {
            artist.genres.forEach((genre) => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });

        return Object.keys(genreCounts).map((genre) => ({
            id: genre,
            label: genre,
            value: genreCounts[genre],
        }));
    };

    const generateColorMap = (genres: string[]): Record<string, string> => {
        const colorMap: Record<string, string> = {};
        genres.forEach((genre) => {
            colorMap[genre] = `rgb(${Math.floor(Math.random() * 256)}, 
        ${Math.floor(Math.random() * 256)}, 
        ${Math.floor(Math.random() * 256)})`;
        });
        return colorMap;
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="400px"
            >
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="400px"
            >
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Build final data for the PieChart, including colors
    const chartData = data.map((item) => ({
        ...item,
        color: genreColors[item.id],
    }));

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {/* Chart Container */}
            <Box sx={{ height: 600, width: { xs: "100%", md: "60%" } }}>
                <Typography variant="h6" sx={{ mb: 2 , }}>
                    Genre Composition
                </Typography>
                <PieChart
                    series={[
                        {
                            data: chartData,
                            highlightScope: { faded: "global", highlighted: "item" },
                            faded: {
                                innerRadius: 90,
                                additionalRadius: -30,
                                color: "gray",
                            },
                            // outerRadius: 110, // optional if label collisions occur
                        },
                    ]}
                    slotProps={{
                        legend: {
                            hidden: true, // hide the default legend
                        },
                    }}
                    height={500}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                />
            </Box>

            {/* Custom Legend */}
            <Box
                sx={{
                    width: { xs: "100%", md: "40%" },
                    display: "grid",
                    gridTemplateColumns: "repeat(4, auto)",
                    columnGap: 2,
                    rowGap: 1,
                    alignItems: "start",
                    mt: { xs: 2, md: 6 },
                    pl: { xs: 0, md: 2 },
                }}
            >
                <Typography variant="subtitle1" sx={{ gridColumn: "1 / -1", mb: 1 }}>
                    Legend
                </Typography>
                {/* 1) Create a sorted copy of your data */}
                {[...chartData]
                    .sort((a, b) => b.value - a.value)
                    .map((item) => (
                        <Box
                            key={item.id}
                            sx={{ display: "flex", alignItems: "center", width: "max-content" }}
                        >
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: item.color,
                                    borderRadius: "50%",
                                    mr: 1,
                                }}
                            />
                            <Typography variant="body2">
                                {item.label} ({item.value})
                            </Typography>
                        </Box>
                    ))}
            </Box>
        </Box>

    );
}
