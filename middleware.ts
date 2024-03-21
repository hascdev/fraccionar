import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {

  // Check the origin from the request
  const origin = request.headers.get('origin') ?? '';

  if (process.env.NODE_ENV !== 'development' && origin !== process.env.ALLOWED_ORIGIN) {
    return Response.json(
      { message: 'Unauthorized response' },
      { status: 403 }
    )
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}