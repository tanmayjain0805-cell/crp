import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = signToken({
      userId: user.id,
      email:  user.email,
      role:   user.role,
      name:   user.name,
    })

    const redirectMap: Record<string, string> = {
      ADMIN:   '/admin',
      PLAYER:  '/player',
      UMPIRE:  '/umpire',
      REFEREE: '/referee',
      SCORER:  '/scorer',
    }

    const res = NextResponse.json({
      message:  'Login successful',
      user:     { id: user.id, name: user.name, email: user.email, role: user.role },
      redirect: redirectMap[user.role] || '/',
    })

    res.cookies.set('crp_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 7,
    })

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
