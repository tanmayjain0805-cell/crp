import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')

const SECRET: string = process.env.JWT_SECRET || 'crp_default_secret'

export async function POST(req: NextRequest) {
  try {
    const { name, email, mobile, password, role } = await req.json()

    if (!name || !email || !mobile || !password || !role) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { mobile }] },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Email or mobile already registered' },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 12)
    const user   = await prisma.user.create({
      data: { name, email, mobile, password: hashed, role },
    })

    if (role === 'UMPIRE') {
      await prisma.umpire.create({
        data: { userId: user.id, certificationLevel: 'Level 1', district: '' },
      })
    } else if (role === 'REFEREE') {
      await prisma.referee.create({
        data: { userId: user.id, certificationLevel: 'Level 1', district: '' },
      })
    } else if (role === 'SCORER') {
      await prisma.scorer.create({ data: { userId: user.id } })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      SECRET,
      { expiresIn: '7d' }
    )

    const res = NextResponse.json(
      {
        message: 'Registration successful',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    )

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
