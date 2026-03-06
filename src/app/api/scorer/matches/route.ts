import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const GET = requireAuth(async (req, user) => {
  const scorer = await prisma.scorer.findUnique({
    where: { userId: user.userId },
  })
  if (!scorer) return NextResponse.json({ matches: [] })

  const matches = await prisma.match.findMany({
    where: {
      scorerId: scorer.id,
      status:   { in: ['SCHEDULED', 'IN_PROGRESS'] },
    },
    include: {
      homeTeam: {
        include: {
          teamPlayers: {
            include: {
              player: {
                include: {
                  user: { select: { name: true } },
                },
              },
            },
          },
        },
      },
      awayTeam: {
        include: {
          teamPlayers: {
            include: {
              player: {
                include: {
                  user: { select: { name: true } },
                },
              },
            },
          },
        },
      },
      venue:      true,
      tournament: true,
      scorecard:  true,
    },
    orderBy: { scheduledAt: 'asc' },
  })

  return NextResponse.json({ matches })
}, ['SCORER'])
