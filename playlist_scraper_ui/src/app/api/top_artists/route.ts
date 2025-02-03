// src/app/api/top-artists/route.ts
import { NextRequest, NextResponse } from 'next/server';

type Cache = {
    data: any;
    lastFetch: number;
};

let cache: Cache = {
    data: null,
    lastFetch: 0,
};

export async function GET(request: NextRequest) {
    // 1) Check for session_id cookie
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2) In-memory cache check (30 minutes)
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in ms

    if (cache.data && currentTime - cache.lastFetch < thirtyMinutes) {
        return NextResponse.json(cache.data); // Return cached
    }

    // 3) Otherwise, fetch from FastAPI
    try {
        const res = await fetch(`http://localhost:5510/top-artists?session_id=${sessionId}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
            // Forward the error from FastAPI
            return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: res.status });
        }

        const data = await res.json();

        // 4) Cache the data
        cache = { data, lastFetch: currentTime };

        // 5) Return JSON
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching top artists:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
