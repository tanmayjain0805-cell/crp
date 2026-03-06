import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const GET = requireAuth(async (req, user) => {
  const player = await prisma.player.findUnique({
    where: { userId: user.userId },
    include: {
      user:       { select: { name: true, email: true, mobile: true } },
      careerStats: true,
    },
  })

  if (!player) {
    return NextResponse.json({ player: null })
  }

  return NextResponse.json({ player })
}, ['PLAYER'])
