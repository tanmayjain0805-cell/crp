'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalPlayers: number
  pendingApprovals: number
  totalTournaments: number
  totalMatches: number
  totalUmpires: number
  totalReferees: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPlayers: 0,
    pendingApprovals: 0,
    totalTournaments: 0,
    totalMatches: 0,
    totalUmpires: 0,
    totalReferees: 0,
  })

  useEffect(() => {
    // Fetch stats
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d.stats || {}))
      .catch(() => {})
  }, [])

  const cards = [
    {
      title: 'Total Players',
      value: stats.totalPlayers,
      icon: '👤',
      href: '/admin/players',
      color: 'border-green-800',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: '⏳',
      href: '/admin/players',
      color: 'border-yellow-800',
    },
    {
      title: 'Tournaments',
      value: stats.totalTournaments,
      icon: '🏆',
      href: '/admin/tournaments',
      color: 'border-blue-800',
    },
    {
      title: 'Total Matches',
      value: stats.totalMatches,
      icon: '🏏',
      href: '/admin/fixtures',
      color: 'border-purple-800',
    },
    {
      title: 'Umpires',
      value: stats.totalUmpires,
      icon: '🧢',
      href: '/admin/officials',
      color: 'border-orange-800',
    },
    {
      title: 'Referees',
      value: stats.totalReferees,
      icon: '📋',
      href: '/admin/officials',
      color: 'border-red-800',
    },
  ]

  const quickLinks = [
    { href: '/admin/players',     icon: '👤', label: 'Player Approvals'   },
    { href: '/admin/tournaments', icon: '🏆', label: 'Tournaments'        },
    { href: '/admin/fixtures',    icon: '📅', label: 'Fixtures'           },
    { href: '/admin/officials',   icon: '🧢', label: 'Officials'          },
    { href: '/admin/payments',    icon: '💰', label: 'Payments'           },
    { href: '/admin/analytics',   icon: '📊', label: 'Analytics'          },
  ]

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Jharkhand State Cricket Association
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(card => (
          <Link
            key={card.title}
            href={card.href}
            className={`bg-gray-900 border ${card.color} rounded-xl p-5 hover:opacity-80 transition`}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-gray-400 text-sm mt-1">{card.title}</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-gray-300 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-gray-900 border border-gray-800 hover:border-green-700 rounded-xl p-5 text-center transition group"
          >
            <div className="text-3xl mb-2">{link.icon}</div>
            <p className="text-gray-300 text-sm font-medium group-hover:text-green-400 transition">
              {link.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
