import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const GET = requireAuth(async () => {
  const [
    totalPlayers,
    pendingApprovals,
    totalTournaments,
    totalMatches,
    totalUmpires,
    totalReferees,
  ] = await Promise.all([
    prisma.player.count(),
    prisma.player.count({ where: { status: 'PENDING' } }),
    prisma.tournament.count(),
    prisma.match.count(),
    prisma.umpire.count(),
    prisma.referee.count(),
  ])

  return NextResponse.json({
    stats: {
      totalPlayers,
      pendingApprovals,
      totalTournaments,
      totalMatches,
      totalUmpires,
      totalReferees,
    },
  })
}, ['ADMIN'])
