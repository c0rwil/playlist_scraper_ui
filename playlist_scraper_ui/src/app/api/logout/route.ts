import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Clear the session_id cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('session_id');
    return response;
}
