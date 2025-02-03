// src/app/api/top-tracks/route.ts
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
    // 1) Check for session_id
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2) Check cache (30 min)
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    if (cache.data && currentTime - cache.lastFetch < thirtyMinutes) {
        return NextResponse.json(cache.data);
    }

    // 3) Fetch from FastAPI
    try {
        const res = await fetch(`http://localhost:5510/top-tracks?session_id=${sessionId}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: res.status });
        }

        const data = await res.json();

        // 4) Cache it
        cache = { data, lastFetch: currentTime };

        // 5) Return
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
