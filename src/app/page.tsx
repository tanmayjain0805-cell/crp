import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏏</span>
          <div>
            <span className="font-bold text-white">CRP</span>
            <span className="text-gray-400 text-xs ml-2 hidden sm:inline">
              Cricket Resource Platform
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-gray-400 hover:text-white text-sm transition px-4 py-2 rounded-lg hover:bg-gray-800">
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="inline-block bg-green-900/40 border border-green-700 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          Jharkhand State Cricket Association
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Cricket Resource<br />
          <span className="text-green-400">Platform</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Complete digital infrastructure for JSCA — player registrations,
          tournament management, fixture scheduling, live scorecards,
          and official payments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-2xl text-lg transition">
            🏏 Register as Player
          </Link>
          <Link
            href="/login"
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-3.5 rounded-2xl text-lg transition border border-gray-700">
            Sign In →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: '👤', title: 'Player Registration', desc: 'Online registration with Aadhaar and photo upload' },
            { icon: '🏆', title: 'Tournament Management', desc: 'Create T20, One Day and Multi-Day tournaments' },
            { icon: '📅', title: 'Fixture Generator', desc: 'Auto-generate Round Robin and Knockout schedules' },
            { icon: '🧢', title: 'Official Management', desc: 'Umpire and referee assignment with conflict prevention' },
            { icon: '📊', title: 'Live Scorecards', desc: 'Real-time score entry with automatic stats updates' },
            { icon: '💰', title: 'Payment System', desc: 'Monthly payment summaries with WhatsApp notifications' },
          ].map(f => (
            <div
              key={f.title}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 hover:border-green-800 transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 text-center py-6 text-gray-600 text-xs">
        © {new Date().getFullYear()} Jharkhand State Cricket Association · CRP v1.0
      </footer>
    </main>
  )
}
