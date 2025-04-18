// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
interface userPayLoad {
  userId: string;
  role: string
}
async function verifyAccessToken(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    // console.log("payload = ");
    // console.log(payload);
    const {userId, role} = (payload as {user:userPayLoad}).user;

    return {userId, role};
    // return payload as { userId?: string; role?: string };
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}

const protectedAdminRoutes = ['/admin-landing-page', '/create-movie-listing-page'];
const protectedUserRoutes = ['/homepage', '/view-all-cinema-locations', '/view-cinema-movie-times'];
const publicRoutes = ['/', '/login', 'sign-up'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminRoute = protectedAdminRoutes.some((route) => path.startsWith(route));
  const isUserRoute = protectedUserRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const rawToken = req.cookies.get('accessToken')?.value;
  const accessToken = rawToken ? decodeURIComponent(rawToken) : "";
  const user = await verifyAccessToken(accessToken);
  console.log(user);

  if ((isAdminRoute || isUserRoute) && !user?.userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (isAdminRoute && user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/homepage', req.url));
  }
  
  if (isUserRoute && user?.role !== 'user') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  if (isPublicRoute && user?.role === 'user') {
    return NextResponse.redirect(new URL('/homepage', req.url));
  }
  
  if (isPublicRoute && user?.role === 'admin') {
    return NextResponse.redirect(new URL('/admin-landing-page', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
