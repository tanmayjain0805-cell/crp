import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  const cookie = req.cookies.get('crp_token')
  return cookie?.value ?? null
}

export function requireAuth(
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  allowedRoles?: string[]
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const token = getTokenFromRequest(req)
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const user = verifyToken(token)
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return handler(req, user)
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }
}
