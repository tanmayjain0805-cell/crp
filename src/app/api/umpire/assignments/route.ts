import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const GET = requireAuth(async (req, user) => {
  const umpire = await prisma.umpire.findUnique({
    where: { userId: user.userId },
  })
  if (!umpire) return NextResponse.json({ assignments: [] })

  const assignments = await prisma.matchOfficialAssignment.findMany({
    where: { umpireId: umpire.id },
    include: {
      match: {
        include: {
          homeTeam:   true,
          awayTeam:   true,
          venue:      true,
          tournament: true,
        },
      },
    },
    orderBy: { match: { scheduledAt: 'asc' } },
  })

  return NextResponse.json({ assignments })
}, ['UMPIRE'])
