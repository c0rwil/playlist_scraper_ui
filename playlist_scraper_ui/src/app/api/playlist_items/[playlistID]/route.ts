import { NextRequest, NextResponse } from 'next/server';

type CacheEntry = {
    data: any;
    lastFetch: number;
};

type Cache = {
    [key: string]: CacheEntry; // We'll key by sessionId + playlistId
};

let cache: Cache = {};

export async function GET(request: NextRequest, context: { params: { playlistId: string } }) {
    const { playlistId } = context.params;

    // 1) session_id from cookie
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2) We key the cache by `<sessionId>_<playlistId>`
    const cacheKey = `${sessionId}_${playlistId}`;

    // 3) Check if we have fresh data
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    const cached = cache[cacheKey];
    if (cached && currentTime - cached.lastFetch < thirtyMinutes) {
        return NextResponse.json(cached.data);
    }

    // 4) Otherwise, fetch from FastAPI
    try {
        const res = await fetch(
            `http://localhost:5510/playlist-items?playlist_id=${playlistId}&session_id=${sessionId}`,
            {
                method: 'GET',
                headers: { Accept: 'application/json' },
            }
        );

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch playlist items' }, { status: res.status });
        }

        const data = await res.json();

        // 5) Store in cache
        cache[cacheKey] = { data, lastFetch: currentTime };

        // 6) Return
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching playlist items:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
