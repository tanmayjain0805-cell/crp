import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export const POST = requireAuth(async (req, user) => {
  if (user.role !== 'PLAYER') {
    return NextResponse.json(
      { error: 'Only players can register' },
      { status: 403 }
    )
  }

  const body = await req.json()
  const {
    dob, district, address, previousClub,
    playingRole, battingStyle, bowlingStyle,
    aadhaarUrl, photoUrl,
  } = body

  const existing = await prisma.player.findUnique({
    where: { userId: user.userId },
  })
  if (existing) {
    return NextResponse.json(
      { error: 'Profile already submitted' },
      { status: 409 }
    )
  }

  const player = await prisma.player.create({
    data: {
      userId: user.userId,
      dob:    new Date(dob),
      district,
      address,
      previousClub,
      playingRole,
      battingStyle,
      bowlingStyle,
      aadhaarUrl,
      photoUrl,
      status: 'PENDING',
    },
    include: { user: true },
  })

  await prisma.playerCareerStats.create({
    data: { playerId: player.id },
  })

  await prisma.notification.create({
    data: {
      userId:  user.userId,
      title:   'Registration Submitted',
      message: 'Your player profile is under review.',
    },
  })

  return NextResponse.json(
    { message: 'Registration submitted', player },
    { status: 201 }
  )
}, ['PLAYER'])

export const GET = requireAuth(async (req) => {
  const { searchParams } = new URL(req.url)
  const status   = searchParams.get('status')
  const search   = searchParams.get('search')
  const district = searchParams.get('district')

  const players = await prisma.player.findMany({
    where: {
      ...(status   && { status:   status as any }),
      ...(district && { district }),
      ...(search   && {
        user: { name: { contains: search, mode: 'insensitive' } },
      }),
    },
    include: {
      user:        { select: { name: true, email: true, mobile: true } },
      careerStats: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ players })
}, ['ADMIN', 'SCORER'])
