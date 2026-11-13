import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const dashboardMatch = pathname.startsWith('/dashboard');
  const adminMatch = pathname.startsWith('/admin');

  if (dashboardMatch || adminMatch) {
    const token = request.cookies.get('sb-access-token')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
