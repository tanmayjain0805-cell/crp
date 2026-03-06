import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const GET = requireAuth(async (req, user) => {
  const profile = await prisma.umpire.findUnique({
    where:   { userId: user.userId },
    include: { user: { select: { name: true, email: true, mobile: true } } },
  })
  return NextResponse.json({ profile })
}, ['UMPIRE'])
