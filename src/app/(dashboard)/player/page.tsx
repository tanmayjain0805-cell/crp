'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PlayerDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/players/me')
      .then(r => r.json())
      .then(d => { setProfile(d.player); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">🏏</div>
        <h1 className="text-2xl font-bold mb-2">Welcome to CRP</h1>
        <p className="text-gray-400 mb-6 text-center max-w-sm">
          You haven't completed your player registration yet.
        </p>
        <Link
          href="/player/register"
          className="bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-xl transition">
          📋 Complete Registration
        </Link>
      </div>
    )
  }

  const STATUS_UI: Record<string, {
    icon: string; text: string; color: string; bg: string
  }> = {
    PENDING: {
      icon: '⏳',
      text: 'Registration Under Review',
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/20 border-yellow-700',
    },
    APPROVED: {
      icon: '✅',
      text: 'Registration Approved',
      color: 'text-green-400',
      bg: 'bg-green-900/20 border-green-700',
    },
    REJECTED: {
      icon: '❌',
      text: 'Registration Rejected',
      color: 'text-red-400',
      bg: 'bg-red-900/20 border-red-700',
    },
    CORRECTION_REQUESTED: {
      icon: '📝',
      text: 'Correction Required',
      color: 'text-orange-400',
      bg: 'bg-orange-900/20 border-orange-700',
    },
  }

  const st = STATUS_UI[profile.status] || STATUS_UI['PENDING']
  const stats = profile.careerStats

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start gap-5">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
                alt="Profile"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center text-3xl font-bold text-green-400">
                {profile.user.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.user.name}</h2>
              <p className="text-gray-400 text-sm">
                {profile.district} • {profile.playingRole?.replace(/_/g, ' ')}
              </p>
              <p className="text-gray-500 text-sm">{profile.user.email}</p>
              <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full border text-sm font-medium ${st.bg} ${st.color}`}>
                <span>{st.icon}</span> {st.text}
              </div>
            </div>
          </div>
          {profile.adminNote && profile.status !== 'APPROVED' && (
            <div className="mt-4 bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
              <span className="text-gray-500">Admin note: </span>
              {profile.adminNote}
            </div>
          )}
        </div>

        {/* Career Stats */}
        {profile.status === 'APPROVED' && stats && (
          <>
            <h3 className="text-lg font-semibold text-gray-300">
              Career Statistics
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { label: 'Matches',     value: stats.matches },
                { label: 'Runs',        value: stats.runs },
                { label: 'Average',     value: stats.average?.toFixed(1) },
                { label: 'Strike Rate', value: stats.strikeRate?.toFixed(1) },
                { label: '50s',         value: stats.fifties },
                { label: '100s',        value: stats.hundreds },
                { label: 'Wickets',     value: stats.wickets },
                { label: 'Catches',     value: stats.catches },
              ].map(s => (
                <div
                  key={s.label}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
                >
                  <p className="text-2xl font-bold text-green-400">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quick Links */}
        {profile.status === 'APPROVED' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: '/player/stats',   icon: '📊', label: 'View Full Stats'  },
              { href: '/player/matches', icon: '🏟️', label: 'Match History'    },
              { href: '/player/profile', icon: '👤', label: 'Edit Profile'     },
            ].map(link => (
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
        )}
      </div>
    </div>
  )
}
