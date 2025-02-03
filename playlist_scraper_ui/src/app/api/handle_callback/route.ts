import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json(
            { error: 'No session_id found in the callback.' },
            { status: 400 }
        );
    }

    // Create a response that redirects to home
    const response = NextResponse.redirect(new URL('/', request.url));

    // Set our session_id in a HTTP-only cookie
    response.cookies.set({
        name: 'session_id',
        value: sessionId,
        httpOnly: true,
        path: '/',
        // Add 'secure: true' in production with HTTPS.
        maxAge: 60 * 60 * 24 * 7 // optional, e.g. 7 days
    });

    return response;
}
