import { NextResponse } from 'next/server';

export async function GET() {
    // Redirect directly to FastAPI /login endpoint which will bounce to Spotify for authorization
    return NextResponse.redirect('http://localhost:5510/login');
}
