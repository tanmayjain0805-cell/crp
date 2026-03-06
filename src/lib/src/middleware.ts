import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/jwt'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/reset-password']

const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN:   ['/admin'],
  PLAYER:  ['/player'],
  UMPIRE:  ['/umpire'],
  REFEREE: ['/referee'],
  SCORER:  ['/scorer'],
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (PUBLIC_ROUTES.some(r => path.startsWith(r))) {
    return NextResponse.next()
  }

  if (path.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('crp_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const user = verifyToken(token)
    for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
      if (
        routes.some(r => path.startsWith(r)) &&
        user.role !== role &&
        user.role !== 'ADMIN'
      ) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
