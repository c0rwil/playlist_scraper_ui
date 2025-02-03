// src/app/api/user-profile/route.ts
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
    // 1) session_id
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2) cache check
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    if (cache.data && currentTime - cache.lastFetch < thirtyMinutes) {
        return NextResponse.json(cache.data);
    }

    // 3) fetch user-profile from FastAPI
    try {
        const res = await fetch(`http://localhost:5510/user-profile?session_id=${sessionId}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: res.status });
        }

        const data = await res.json();

        // 4) store in cache
        cache = { data, lastFetch: currentTime };

        // 5) return
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
