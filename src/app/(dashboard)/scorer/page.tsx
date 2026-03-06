'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ScorerDashboard() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/scorer/matches')
      .then(r => r.json())
      .then(d => { setMatches(d.matches || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-gray-950 min-h-screen text-white">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Scorer Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage match scorecards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Assigned Matches', value: matches.length,                                    color: 'text-green-400' },
            { label: 'Completed',        value: matches.filter(m => m.status === 'COMPLETED').length, color: 'text-blue-400'  },
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

        {/* Quick Link */}
        <Link
          href="/scorer/entry"
          className="block bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl text-center transition"
        >
          ✏️ Enter Score for a Match
        </Link>

        {/* Matches List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">
            Assigned Matches
          </h2>
          {matches.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
              No matches assigned yet.
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map(m => (
                <div
                  key={m.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">
                      {m.homeTeam.name} vs {m.awayTeam.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      📅 {new Date(m.scheduledAt).toLocaleDateString('en-IN')} •
                      🏟️ {m.venue.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {m.tournament.name} • {m.round}
                    </p>
                  </div>
                  <Link
                    href="/scorer/entry"
                    className="bg-green-700 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-lg transition"
                  >
                    Score
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
