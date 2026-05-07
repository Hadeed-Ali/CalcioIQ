import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const POPULAR_PLAYERS = [
  { id: '937958', name: 'Lamine Yamal', team: 'Barcelona', country: 'es', position: 'RW' },
  { id: '502670', name: 'Kvicha Kvaratskhelia', team: 'PSG', country: 'ge', position: 'LW' },
  { id: '132098', name: 'Harry Kane', team: 'Bayern Munich', country: 'gb-eng', position: 'CF' },
  { id: '566723', name: 'Michael Olise', team: 'Bayern Munich', country: 'fr', position: 'RW' },
  { id: '342229', name: 'Kylian Mbappé', team: 'Real Madrid', country: 'fr', position: 'LW' },
  { id: '418560', name: 'Erling Haaland', team: 'Man City', country: 'no', position: 'CF' },
]

const cache = {}

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: '8px',
  backgroundColor: '#111827',
  border: '1px solid #334155',
  borderRadius: '12px',
  overflow: 'hidden',
  zIndex: 9999,
  boxShadow: '0 16px 48px rgba(0,0,0,0.9)',
}

const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  backgroundColor: '#111827',
  color: 'white',
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const navigate = useNavigate()

  const searchPlayers = (value) => {
    setQuery(value)
    if (value.length < 3) { setResults([]); return }

    if (cache[value]) {
      setResults(cache[value])
      return
    }

    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/players/search?query=${value}`)
        const data = await res.json()
        cache[value] = data.slice(0, 8)
        setResults(cache[value])
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 500)
  }

  const formatMarketValue = (value) => {
    if (!value) return null
    if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}m`
    if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`
    return `€${value}`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-hidden">

      {/* Background patterns - SVG art + grid + edge glow */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute left-0 top-0 h-full opacity-[0.07]" width="220" viewBox="0 0 220 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="120" r="60" stroke="#4ade80" strokeWidth="1" />
          <circle cx="30" cy="120" r="40" stroke="#4ade80" strokeWidth="0.5" />
          <circle cx="30" cy="120" r="20" stroke="#4ade80" strokeWidth="0.5" />
          <line x1="0" y1="120" x2="90" y2="120" stroke="#4ade80" strokeWidth="0.5" />
          <line x1="30" y1="90" x2="30" y2="150" stroke="#4ade80" strokeWidth="0.5" />
          <rect x="80" y="200" width="80" height="120" rx="4" stroke="#4ade80" strokeWidth="0.8" />
          <line x1="80" y1="260" x2="160" y2="260" stroke="#4ade80" strokeWidth="0.5" />
          <line x1="120" y1="200" x2="120" y2="320" stroke="#4ade80" strokeWidth="0.5" />
          <circle cx="80" cy="200" r="4" fill="#4ade80" />
          <circle cx="160" cy="200" r="4" fill="#4ade80" />
          <circle cx="80" cy="320" r="4" fill="#4ade80" />
          <circle cx="160" cy="320" r="4" fill="#4ade80" />
          <circle cx="50" cy="480" r="30" stroke="#4ade80" strokeWidth="0.8" />
          <line x1="20" y1="480" x2="80" y2="480" stroke="#4ade80" strokeWidth="0.5" />
          <rect x="10" y="580" width="50" height="70" rx="2" stroke="#4ade80" strokeWidth="0.8" />
          <line x1="10" y1="615" x2="60" y2="615" stroke="#4ade80" strokeWidth="0.4" />
          <circle cx="140" cy="640" r="25" stroke="#4ade80" strokeWidth="0.8" />
          <line x1="115" y1="640" x2="165" y2="640" stroke="#4ade80" strokeWidth="0.4" />
          <line x1="140" y1="615" x2="140" y2="665" stroke="#4ade80" strokeWidth="0.4" />
        </svg>

        <svg className="absolute right-0 top-0 h-full opacity-[0.07]" width="220" viewBox="0 0 220 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="190" cy="150" r="55" stroke="#4ade80" strokeWidth="1" />
          <path d="M 165 130 L 190 95 L 215 130 L 205 165 L 175 165 Z" stroke="#4ade80" strokeWidth="0.8" fill="none" />
          <circle cx="190" cy="150" r="15" stroke="#4ade80" strokeWidth="0.5" />
          <rect x="60" y="250" width="100" height="70" rx="4" stroke="#4ade80" strokeWidth="0.8" />
          <line x1="60" y1="275" x2="160" y2="275" stroke="#4ade80" strokeWidth="0.4" />
          <line x1="60" y1="295" x2="160" y2="295" stroke="#4ade80" strokeWidth="0.4" />
          <circle cx="75" cy="263" r="5" fill="#4ade80" opacity="0.6" />
          <circle cx="145" cy="440" r="45" stroke="#4ade80" strokeWidth="0.8" />
          <circle cx="145" cy="440" r="30" stroke="#4ade80" strokeWidth="0.4" />
          <line x1="100" y1="440" x2="190" y2="440" stroke="#4ade80" strokeWidth="0.4" />
          <line x1="145" y1="395" x2="145" y2="485" stroke="#4ade80" strokeWidth="0.4" />
          <rect x="150" y="560" width="60" height="90" rx="2" stroke="#4ade80" strokeWidth="0.8" />
          <line x1="150" y1="585" x2="210" y2="585" stroke="#4ade80" strokeWidth="0.4" />
          <line x1="150" y1="605" x2="210" y2="605" stroke="#4ade80" strokeWidth="0.4" />
          <circle cx="80" cy="610" r="35" stroke="#4ade80" strokeWidth="0.8" />
          <line x1="45" y1="610" x2="115" y2="610" stroke="#4ade80" strokeWidth="0.4" />
          <line x1="80" y1="575" x2="80" y2="645" stroke="#4ade80" strokeWidth="0.4" />
        </svg>

        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(74,222,128,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.025) 1px, transparent 1px)',
          backgroundSize: '70px 70px'
        }} />

        <div className="home-grid-shimmer" />
        {/* Subtle edge glow on left and right */}
        <div className="absolute top-0 left-0 h-full w-32" style={{
          background: 'linear-gradient(to right, rgba(74,222,128,0.05), transparent)'
        }} />
        <div className="absolute top-0 right-0 h-full w-32" style={{
          background: 'linear-gradient(to left, rgba(74,222,128,0.05), transparent)'
        }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <img src="/CalcioAI Logo.png" alt="CalcioIQ logo" className="w-14 h-14 object-contain" />
          <span className="text-green-400 font-bold text-2xl tracking-widest uppercase">CALCIO<span className="text-white">IQ</span></span>
        </div>
        <div className="flex items-center gap-10 text-md text-white/60">
          <a href="/" className="hover:text-green-400 transition-colors">Home</a>
          <a href="/compare" className="hover:text-green-400 transition-colors">Compare</a>
          <a href="/about" className="hover:text-green-400 transition-colors">About</a>
          <a href="https://github.com/felipeall/transfermarkt-api" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">Data Source</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-20 flex flex-col items-center justify-center pt-20 pb-10 px-6 text-center">
        <div className="inline-block mb-4 px-3 py-1 border border-green-400/30 bg-green-400/5 text-green-400 text-xs tracking-widest uppercase rounded-full">
          Football Intelligence Platform
        </div>

        <h1 className="text-6xl font-black tracking-tight mb-2 leading-none">
          CALCIO<span className="text-green-400">IQ</span>
        </h1>

        <p className="text-white/40 text-lg max-w-md mt-3 leading-relaxed">
          The modern home of football statistics and analytics.
        </p>

        {/* Search */}
        <div style={{ position: 'relative', marginTop: '40px', width: '100%', maxWidth: '576px', zIndex: 50 }}>
          <div style={{ position: 'relative' }}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">🔍</span>
            <input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={query}
              onChange={(e) => searchPlayers(e.target.value)}
              placeholder="Search for a player..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/25 text-base focus:outline-none focus:border-green-400/50 transition-colors"
            />
            {loading && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">searching...</span>
            )}
          </div>

          {/* Dropdown */}
          {results.length > 0 && (
            <div style={dropdownStyle}>
              {results.map((player) => (
                <div
                  key={player.id}
                  onClick={() => { setResults([]); setQuery(''); navigate(`/player/${player.id}`) }}
                  onMouseEnter={() => setHoveredId(player.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    ...dropdownItemStyle,
                    backgroundColor: hoveredId === player.id ? '#1f2937' : '#111827',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4ade80',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}>
                    <img
                      src={`https://img.a.transfermarkt.technology/portrait/small/${player.id}-1.png`}
                      alt={player.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    {player.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{player.club?.name} · {player.position}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {player.marketValue && (
                      <p style={{ color: '#4ade80', fontSize: '12px', fontWeight: 500 }}>{formatMarketValue(player.marketValue)}</p>
                    )}
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>{player.nationalities?.[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-3 text-white/20 text-xs">Examples: Messi, Ronaldo, Neymar, Benzema, Lewandowski...</p>
      </div>

      {/* Popular Players */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 mt-10 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-5 bg-green-400 rounded-full inline-block" />
          <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Popular Players</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {POPULAR_PLAYERS.map((player) => (
            <button
              key={player.id + player.name}
              onClick={() => navigate(`/player/${player.id}`)}
              className="group flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 hover:bg-white/[0.07] hover:border-green-400/30 transition-colors text-left"
            >
              <img
                src={`https://flagcdn.com/w40/${player.country}.png`}
                alt={player.country}
                className="w-7 h-5 object-cover rounded-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium group-hover:text-green-400 transition-colors truncate">{player.name}</p>
                <p className="text-white/35 text-xs">{player.team} · {player.position}</p>
              </div>
              <span className="ml-auto text-white/20 group-hover:text-green-400/50 transition-colors text-sm flex-shrink-0">→</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/5 px-10 py-6 flex items-center justify-between text-white/50 text-s">
        <span>© 2026 CalcioIQ. Personal project.</span>
        <div className="flex items-center gap-2">
          <span>Hadeed Ali</span>
          <a href="https://www.linkedin.com/in/hadeed-ali/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="text-white/40 hover:text-green-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}