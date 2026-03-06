'use client'
import { useEffect, useState } from 'react'

export default function UmpireDashboard() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [profile, setProfile]         = useState<any>(null)
  const [loading, setLoading]         = useState(true)
  const [responding, setResponding]   = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/umpire/assignments').then(r => r.json()),
      fetch('/api/umpire/profile').then(r => r.json()),
    ]).then(([a, p]) => {
      setAssignments(a.assignments || [])
      setProfile(p.profile)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function respond(
    assignmentId: string,
    matchId: string,
    action: 'ACCEPT' | 'REJECT'
  ) {
    setResponding(assignmentId)
    await fetch(`/api/matches/${matchId}/respond`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ assignmentId, action }),
    })
    setResponding('')
    const res = await fetch('/api/umpire/assignments')
    const data = await res.json()
    setAssignments(data.assignments || [])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    )
  }

  const pending  = assignments.filter(a => a.status === 'PENDING')
  const accepted = assignments.filter(a => a.status === 'ACCEPTED')

  return (
    <div className="p-4 md:p-8 bg-gray-950 min-h-screen text-white">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Umpire Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {profile?.user?.name} • {profile?.certificationLevel}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Matches', value: profile?.matchesOfficiated || 0, color: 'text-green-400'  },
            { label: 'Pending',       value: pending.length,                  color: 'text-yellow-400' },
            { label: 'Upcoming',      value: accepted.length,                 color: 'text-blue-400'   },
          ].map(s => (
            <div
              key={s.label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pending Assignments */}
        {pending.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-yellow-400 mb-3">
              ⚠ Pending Response
            </h2>
            <div className="space-y-3">
              {pending.map(a => (
                <div
                  key={a.id}
                  className="bg-gray-900 border border-yellow-900/50 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold">
                        {a.match.homeTeam.name} vs {a.match.awayTeam.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        📅 {new Date(a.match.scheduledAt).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        🏟️ {a.match.venue.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        🏆 {a.match.tournament.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Role:{' '}
                        <span className="text-blue-400">
                          {a.role.replace('_', ' ')}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => respond(a.id, a.match.id, 'ACCEPT')}
                        disabled={responding === a.id}
                        className="bg-green-700 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-lg transition disabled:opacity-50"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => respond(a.id, a.match.id, 'REJECT')}
                        disabled={responding === a.id}
                        className="bg-red-800 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg transition disabled:opacity-50"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div>
          <h2 className="text-sm font-semibold text-green-400 mb-3">
            ✅ Upcoming Matches
          </h2>
          {accepted.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
              No upcoming matches assigned.
            </div>
          ) : (
            <div className="space-y-3">
              {accepted.map(a => (
                <div
                  key={a.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  <h3 className="font-semibold">
                    {a.match.homeTeam.name} vs {a.match.awayTeam.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    📅 {new Date(a.match.scheduledAt).toLocaleDateString('en-IN')} •
                    🏟️ {a.match.venue.name} •
                    {a.role.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
