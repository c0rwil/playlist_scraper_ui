import { NextRequest, NextResponse } from 'next/server';

type Cache = {
    data: any;
    lastFetch: number;
};

let cache: Cache = {
    data: null,
    lastFetch: 0
};

export async function GET(request: NextRequest) {
    // Check for session_id
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // In-memory cache check
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 min in ms

    if (cache.data && currentTime - cache.lastFetch < thirtyMinutes) {
        // Still fresh; return cached data
        return NextResponse.json(cache.data);
    }

    // Otherwise, fetch from FastAPI
    try {
        const res = await fetch(`http://localhost:5510/playlists?session_id=${sessionId}`, {
            method: 'GET',
            headers: { Accept: 'application/json' }
        });

        if (!res.ok) {
            // Forward the error status
            return NextResponse.json({ error: 'Failed to fetch from FastAPI' }, { status: res.status });
        }

        const data = await res.json();

        // Store in local cache
        cache = { data, lastFetch: currentTime };

        // Return JSON
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching from FastAPI:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
