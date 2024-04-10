import { NextApiRequest, NextApiResponse } from 'next';
import {NextResponse} from "next/server";

let cache = {
    data: null,
    lastFetch: 0,
};

export async function GET(req: NextApiRequest, res: NextApiResponse) {

    try {
        const currentTime = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (currentTime - cache.lastFetch < twentyFourHours && cache.data) {
            return new NextResponse(JSON.stringify(cache.data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const spotifyApiUrl = 'http://localhost:5510/top-tracks'; // Your FastAPI endpoint for top artists
        const response = await fetch(spotifyApiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            cache = { data, lastFetch: currentTime };
            return new NextResponse(JSON.stringify(data), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            // Handle non-200 responses from the FastAPI server
            return new NextResponse(null, { status: response.status });
        }
    } catch (error) {
        console.error('Error when fetching:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });    }
}
