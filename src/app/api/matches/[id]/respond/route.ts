import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const PATCH = requireAuth(async (req, user) => {
  const { assignmentId, action } = await req.json()

  const assignment = await prisma.matchOfficialAssignment.findUnique({
    where:   { id: assignmentId },
    include: {
      match:   { include: { homeTeam: true, awayTeam: true } },
      umpire:  { include: { user: true } },
      referee: { include: { user: true } },
    },
  })

  if (!assignment) {
    return NextResponse.json(
      { error: 'Assignment not found' },
      { status: 404 }
    )
  }

  const ownerUserId =
    assignment.umpire?.userId || assignment.referee?.userId

  if (ownerUserId !== user.userId && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.matchOfficialAssignment.update({
    where: { id: assignmentId },
    data:  { status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED' },
  })

  if (action === 'ACCEPT') {
    if (assignment.umpireId) {
      await prisma.umpire.update({
        where: { id: assignment.umpireId },
        data:  { matchesOfficiated: { increment: 1 } },
      })
    }
    if (assignment.refereeId) {
      await prisma.referee.update({
        where: { id: assignment.refereeId },
        data:  { matchesOfficiated: { increment: 1 } },
      })
    }
  }

  // Notify admins
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
  })
  const officialName =
    assignment.umpire?.user.name ||
    assignment.referee?.user.name ||
    'Official'
  const matchName = `${assignment.match.homeTeam.name} vs ${assignment.match.awayTeam.name}`

  await Promise.all(
    admins.map(admin =>
      prisma.notification.create({
        data: {
          userId:  admin.id,
          title:   `Assignment ${action === 'ACCEPT' ? 'Accepted' : 'Rejected'}`,
          message: `${officialName} has ${
            action === 'ACCEPT' ? 'accepted' : 'rejected'
          } the assignment for ${matchName}.`,
        },
      })
    )
  )

  return NextResponse.json({ assignment: updated })
}, ['UMPIRE', 'REFEREE', 'ADMIN'])
