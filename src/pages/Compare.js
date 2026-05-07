import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const COUNTRY_CODES = {
  'Spain': 'es', 'Portugal': 'pt', 'France': 'fr', 'Germany': 'de', 'Italy': 'it',
  'England': 'gb-eng', 'Scotland': 'gb-sct', 'Wales': 'gb-wls', 'Northern Ireland': 'gb-nir',
  'Brazil': 'br', 'Argentina': 'ar', 'Uruguay': 'uy', 'Colombia': 'co', 'Chile': 'cl',
  'Mexico': 'mx', 'United States': 'us', 'Canada': 'ca',
  'Netherlands': 'nl', 'Belgium': 'be', 'Croatia': 'hr', 'Serbia': 'rs',
  'Poland': 'pl', 'Czech Republic': 'cz', 'Switzerland': 'ch', 'Austria': 'at',
  'Denmark': 'dk', 'Sweden': 'se', 'Norway': 'no', 'Finland': 'fi',
  'Egypt': 'eg', 'Morocco': 'ma', 'Senegal': 'sn', 'Nigeria': 'ng', 'Ghana': 'gh',
  'Algeria': 'dz', 'Tunisia': 'tn', 'Cameroon': 'cm', 'Ivory Coast': 'ci',
  'Japan': 'jp', 'South Korea': 'kr', 'Australia': 'au',
  'Georgia': 'ge', 'Ukraine': 'ua', 'Russia': 'ru', 'Turkey': 'tr',
  'Greece': 'gr', 'Romania': 'ro', 'Hungary': 'hu', 'Bulgaria': 'bg',
  'Republic of Ireland': 'ie', 'Ireland': 'ie', 'Iceland': 'is',
  'Slovenia': 'si', 'Slovakia': 'sk', 'Bosnia-Herzegovina': 'ba',
  'Albania': 'al', 'North Macedonia': 'mk', 'Montenegro': 'me',
  'Ecuador': 'ec', 'Peru': 'pe', 'Paraguay': 'py', 'Venezuela': 've',
  'Costa Rica': 'cr', 'Panama': 'pa', 'Honduras': 'hn',
}

function getCountryCode(country) {
  if (!country) return null
  return COUNTRY_CODES[country] || country.toLowerCase().slice(0, 2)
}

export default function Compare() {
  const navigate = useNavigate()
  const [player1, setPlayer1] = useState(null)
  const [player2, setPlayer2] = useState(null)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Decorative background orbs (matching home/profile pages) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="profile-orb"
          style={{
            left: '8%',
            top: '12%',
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle at 35% 35%, rgba(74, 222, 128, 0.18), rgba(74, 222, 128, 0) 62%)',
            animationDuration: '11s',
          }}
        />
        <div
          className="profile-orb"
          style={{
            right: '-4%',
            top: '28%',
            width: '540px',
            height: '540px',
            background: 'radial-gradient(circle at 40% 40%, rgba(56, 189, 248, 0.14), rgba(56, 189, 248, 0) 60%)',
            animationDuration: '13s',
            animationDelay: '300ms',
          }}
        />
        <div
          className="profile-orb"
          style={{
            left: '30%',
            bottom: '-12%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle at 45% 45%, rgba(74, 222, 128, 0.10), rgba(74, 222, 128, 0) 62%)',
            animationDuration: '15s',
            animationDelay: '120ms',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-5 border-b border-white/5 profile-animate-in">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <img src="/CalcioAI Logo.png" alt="CalcioIQ logo" className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110" />
          <span className="text-green-400 font-bold text-2xl tracking-widest uppercase">CALCIO<span className="text-white">IQ</span></span>
        </button>
        <button onClick={() => navigate('/')} className="text-white/40 text-m hover:text-white transition-colors">
          ← Back to home
        </button>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12 profile-animate-in profile-delay-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 dashed-full bg-green-400/10 border border-green-400/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs uppercase tracking-widest font-semibold">New Feature</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Compare <span className="text-green-400">Players</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto">
            Pick two players and see how they compare in their trophies, market values, goals, assists, and more.
          </p>
        </div>

        {/* Two search panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 profile-animate-in profile-delay-2">
          <PlayerSearchPanel
            label="Player One"
            selected={player1}
            onSelect={setPlayer1}
            onClear={() => setPlayer1(null)}
            accentColor="green"
          />
          <PlayerSearchPanel
            label="Player Two"
            selected={player2}
            onSelect={setPlayer2}
            onClear={() => setPlayer2(null)}
            accentColor="purple"
          />
        </div>

        {/* Comparison view */}
        {player1 && player2 ? (
          <ComparisonView player1={player1} player2={player2} navigate={navigate} />
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 text-center profile-animate-in profile-delay-3">
            <div className="text-6xl mb-4 opacity-20 inline-block animate-bounce-slow">⚖️</div>
            <p className="text-white/50 text-base font-medium mb-2">
              {!player1 && !player2
                ? 'Select two players to start comparing'
                : !player1
                  ? 'Please select Player 1'
                  : 'Please select Player 2'}
            </p>
            <p className="text-white/25 text-xs">
              Ex: Haaland VS Mbappe or Yamal VS Olise
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-10 py-6 flex items-center justify-between text-white/50 text-s mt-10">
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

      {/* Inline styles for unique animations on this page */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .slide-in-right { animation: slide-in-right 0.5s ease-out; }
        @keyframes fill-bar {
          from { width: 0%; }
        }
        .fill-bar { animation: fill-bar 0.8s ease-out; }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

function PlayerSearchPanel({ label, selected, onSelect, onClear, accentColor }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/players/search?query=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data.slice(0, 5) : [])
      } catch (e) {
        console.log('Search error:', e)
      }
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  const accent = accentColor === 'green'
    ? { border: 'border-green-400/40', text: 'text-green-400', glow: 'shadow-[0_0_30px_rgba(74,222,128,0.15)]', focusBorder: 'focus:border-green-400/40', dot: 'bg-green-400' }
    : { border: 'border-purple-400/40', text: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(96,165,250,0.15)]', focusBorder: 'focus:border-purple-400/40', dot: 'bg-purple-400' }

  if (selected) {
    return (
      <div className={`relative bg-white/[0.03] border ${accent.border} ${accent.glow} rounded-2xl p-5 transition-all duration-500 slide-in-${accentColor === 'green' ? 'left' : 'right'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} animate-pulse`} />
            <span className={`${accent.text} text-xs uppercase tracking-widest font-semibold`}>{label}</span>
          </div>
          <button
            onClick={onClear}
            className="text-white/30 hover:text-white text-xs transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            ✕ Clear
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
            {selected.imageUrl ? (
              <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-lg truncate">{selected.name}</p>
            <p className="text-white/50 text-sm truncate">{selected.club?.name || '—'}</p>
            <p className="text-white/30 text-xs uppercase tracking-widest mt-0.5">{selected.position || '—'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 transition-all duration-300 ${focused ? `${accent.border} ${accent.glow}` : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
        <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">{label}</p>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder="Search for a player..."
        className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none ${accent.focusBorder} transition-all duration-300`}
      />
      {loading && (
        <div className="flex items-center gap-2 mt-3">
          <div className={`w-3 h-3 border-2 ${accentColor === 'green' ? 'border-green-400' : 'border-green-400'} border-t-transparent rounded-full animate-spin`} />
          <p className="text-white/30 text-xs">Searching...</p>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-3 space-y-1">
          {results.map((player, i) => (
            <button
              key={player.id}
              onClick={() => {
                onSelect(player)
                setQuery('')
                setResults([])
              }}
              style={{ animationDelay: `${i * 50}ms` }}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.05] text-left transition-all profile-animate-in"
            >
              <div className="w-10 h-12 rounded overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                {player.imageUrl ? (
                  <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">👤</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">{player.name}</p>
                <p className="text-white/40 text-xs truncate">{player.club?.name || '—'}{player.position ? ` · ${player.position}` : ''}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ComparisonView({ player1, player2, navigate }) {
  const [data1, setData1] = useState(null)
  const [data2, setData2] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayer = async (id) => {
      const [profileRes, mvRes, transRes, achRes, injRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/players/${id}/profile`),
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/players/${id}/market_value`),
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/players/${id}/transfers`),
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/players/${id}/achievements`),
        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/players/${id}/injuries`),
      ])
      const profile = await profileRes.json()
      const marketValue = await mvRes.json()
      const transfers = await transRes.json()
      const achievements = await achRes.json()
      const injuries = await injRes.json()

      let stats = null
      if (profile?.name) {
        try {
          const statsRes = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:3001"}/api/stats/search/${encodeURIComponent(profile.name)}`)
          stats = await statsRes.json()
        } catch (e) { }
      }

      return { profile, marketValue, transfers, achievements, injuries, stats }
    }

    setLoading(true)
    setData1(null)
    setData2(null)
    Promise.all([fetchPlayer(player1.id), fetchPlayer(player2.id)])
      .then(([d1, d2]) => {
        setData1(d1)
        setData2(d2)
        setLoading(false)
      })
      .catch(err => {
        console.log('Compare fetch error:', err)
        setLoading(false)
      })
  }, [player1.id, player2.id])

  if (loading) return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-16 text-center">
      <div className="relative inline-block mb-4">
        <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-2 border-green-400/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="text-white/50 text-sm font-medium">Comparing players...</p>
      <p className="text-white/25 text-xs mt-2">Settling the debate!</p>
    </div>
  )

  if (!data1 || !data2) return null

  // Aggregate current-season stats across all competitions
  const aggregateStats = (statsData) => {
    if (!statsData?.found || !statsData.competitions) return null
    return statsData.competitions.reduce((acc, c) => ({
      goals: acc.goals + c.stats.goals,
      assists: acc.assists + c.stats.assists,
      matches: acc.matches + c.stats.playedMatches,
      penalties: acc.penalties + c.stats.penalties,
    }), { goals: 0, assists: 0, matches: 0, penalties: 0 })
  }

  const stats1 = aggregateStats(data1.stats)
  const stats2 = aggregateStats(data2.stats)

  const formatValue = (v) => {
    const n = Number(v)
    if (!Number.isFinite(n) || n <= 0) return '—'
    if (n >= 1000000) return `€${(n / 1000000).toFixed(0)}m`
    if (n >= 1000) return `€${(n / 1000).toFixed(0)}k`
    return `€${n}`
  }

  const calcAge = (profile) => {
    if (!profile?.description) return null
    // Match dates like "28/07/1993" in the description
    const match = profile.description.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
    if (!match) return null
    const [, day, month, year] = match
    const birth = new Date(`${year}-${month}-${day}`)
    if (isNaN(birth.getTime())) return null
    const diff = Date.now() - birth.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  // Peak market value
  const peakMV = (mvData) => {
    if (!mvData?.marketValueHistory?.length) return 0
    const vals = mvData.marketValueHistory
      .map((h) => Number(h.marketValue))
      .filter((n) => Number.isFinite(n) && n > 0)
    return vals.length ? Math.max(...vals) : 0
  }

  // Total transfer fees paid for the player throughout career
  const totalTransferFees = (transData) => {
    if (!transData?.transfers?.length) return 0
    return transData.transfers.reduce((sum, t) => {
      const fee = Number(t.fee)
      return sum + (Number.isFinite(fee) && fee > 0 ? fee : 0)
    }, 0)
  }

  // Trophy count (sum of all achievements * count)
  const trophyCount = (achData) => {
    if (!achData?.achievements?.length) return 0
    return achData.achievements.reduce((sum, a) => sum + (Number(a.count) || 0), 0)
  }

  // Total days injured across history
  const totalDaysInjured = (injData) => {
    if (!injData?.injuries?.length) return 0
    return injData.injuries.reduce((sum, i) => sum + (Number(i.days) || 0), 0)
  }

  // Goals per match (current season)
  const goalsPerMatch = (s) => {
    if (!s || s.matches === 0) return null
    return (s.goals / s.matches).toFixed(2)
  }

  // Build comparison rows
  // Each row: { label, val1, val2, raw1, raw2, higherWins, suffix }
  // higherWins: true = bigger value highlighted, false = smaller value highlighted (e.g., age, days injured), null = no comparison
  const rows = [
    {
      category: 'Personal',
      items: [
        { label: 'Age', val1: calcAge(data1.profile), val2: calcAge(data2.profile), higherWins: false, suffix: ' yrs' },
        { label: 'Height', val1: data1.profile.height, val2: data2.profile.height, higherWins: null, suffix: ' cm' },
        { label: 'Foot', val1: data1.profile.foot, val2: data2.profile.foot, higherWins: null, capitalize: true },
        { label: 'Position', val1: data1.profile.position?.main, val2: data2.profile.position?.main, higherWins: null },
        { label: 'Nationality', val1: data1.profile.citizenship?.[0], val2: data2.profile.citizenship?.[0], higherWins: null },
      ]
    },
    {
      category: 'Career & Value',
      items: [
        { label: 'Current Club', val1: data1.profile.club?.name, val2: data2.profile.club?.name, higherWins: null },
        { label: 'Market Value', val1: formatValue(data1.profile.marketValue), val2: formatValue(data2.profile.marketValue), raw1: Number(data1.profile.marketValue) || 0, raw2: Number(data2.profile.marketValue) || 0, higherWins: true },
        { label: 'Peak Value', val1: formatValue(peakMV(data1.marketValue)), val2: formatValue(peakMV(data2.marketValue)), raw1: peakMV(data1.marketValue), raw2: peakMV(data2.marketValue), higherWins: true },
        { label: 'Total Transfer Fees', val1: formatValue(totalTransferFees(data1.transfers)), val2: formatValue(totalTransferFees(data2.transfers)), raw1: totalTransferFees(data1.transfers), raw2: totalTransferFees(data2.transfers), higherWins: true },
        { label: 'Trophies Won', val1: trophyCount(data1.achievements), val2: trophyCount(data2.achievements), higherWins: true },
        { label: 'Days Injured (career)', val1: totalDaysInjured(data1.injuries), val2: totalDaysInjured(data2.injuries), higherWins: false },
      ]
    },
  ]

  if (stats1 || stats2) {
    // If only one player has stats, mark the items as non-comparable so they don't affect the score
    const bothHaveStats = stats1 && stats2
    const compareMode = bothHaveStats ? true : null  // null = no winner highlighting

    rows.push({
      category: 'Current Season Stats',
      note: !bothHaveStats ? 'Omitted - Stats not available for both players.' : null,
      items: [
        { label: 'Matches', val1: stats1?.matches ?? '—', val2: stats2?.matches ?? '—', raw1: stats1?.matches, raw2: stats2?.matches, higherWins: compareMode },
        { label: 'Goals', val1: stats1?.goals ?? '—', val2: stats2?.goals ?? '—', raw1: stats1?.goals, raw2: stats2?.goals, higherWins: compareMode },
        { label: 'Assists', val1: stats1?.assists ?? '—', val2: stats2?.assists ?? '—', raw1: stats1?.assists, raw2: stats2?.assists, higherWins: compareMode },
        { label: 'Goal Contributions', val1: stats1 ? stats1.goals + stats1.assists : '—', val2: stats2 ? stats2.goals + stats2.assists : '—', raw1: stats1 ? stats1.goals + stats1.assists : undefined, raw2: stats2 ? stats2.goals + stats2.assists : undefined, higherWins: compareMode },
        { label: 'Goals per Match', val1: goalsPerMatch(stats1) ?? '—', val2: goalsPerMatch(stats2) ?? '—', raw1: stats1 && stats1.matches ? stats1.goals / stats1.matches : undefined, raw2: stats2 && stats2.matches ? stats2.goals / stats2.matches : undefined, higherWins: compareMode },
      ]
    })
  }

  // Calculate overall winner score (each metric where someone "wins" gives them a point)
  let p1Score = 0
  let p2Score = 0
  rows.forEach(group => {
    group.items.forEach(item => {
      if (item.higherWins === null) return
      const c1 = item.raw1 !== undefined ? item.raw1 : (typeof item.val1 === 'number' ? item.val1 : null)
      const c2 = item.raw2 !== undefined ? item.raw2 : (typeof item.val2 === 'number' ? item.val2 : null)
      if (c1 === null || c2 === null) return
      if (c1 === c2) return
      const p1Better = item.higherWins ? c1 > c2 : c1 < c2
      if (p1Better) p1Score++
      else p2Score++
    })
  })

  return (
    <div className="space-y-6 profile-animate-in">
      {/* Header with player cards */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
        <PlayerHeaderCard data={data1} accentColor="green" navigate={navigate} score={p1Score} otherScore={p2Score} />
        <div className="text-center py-4">
          <div className="text-white/80 text-4xl font-black">VS</div>
        </div>
        <PlayerHeaderCard data={data2} accentColor="purple" navigate={navigate} score={p2Score} otherScore={p1Score} />
      </div>

      {/* Score summary banner */}
      {(p1Score > 0 || p2Score > 0) && (
        <div className="bg-gradient-to-r from-green-400/5 via-white/[0.02] to-purple-400/5 border border-white/[0.07] rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-widest text-center mb-3">Head-to-Head Result</p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-green-400 text-4xl font-black">{p1Score}</p>
              <p className="text-white/50 text-s mt-1 truncate max-w-[10rem]">{data1.profile.name}</p>
            </div>
            <div className="text-white/50 text-2xl">VS</div>
            <div className="text-center">
              <p className="text-purple-400 text-4xl font-black">{p2Score}</p>
              <p className="text-white/50 text-s mt-1 truncate max-w-[10rem]">{data2.profile.name}</p>
            </div>
          </div>
          <p className="text-white/50 text-xs text-center mt-3">
            {p1Score > p2Score
              ? `${data1.profile.name} wins on ${p1Score} of ${p1Score + p2Score} compared metrics`
              : p2Score > p1Score
                ? `${data2.profile.name} wins on ${p2Score} of ${p1Score + p2Score} compared metrics`
                : `It is a tie — ${p1Score} metrics won by each player!`}
          </p>
        </div>
      )}

      {/* Comparison categories */}
      {rows.map((group, gi) => (
        <div
          key={group.category}
          className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden profile-animate-in"
          style={{ animationDelay: `${gi * 100 + 100}ms` }}
        >
          <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-white/40 rounded-full" />
              <h3 className="text-white/60 text-sm uppercase tracking-widest font-semibold">{group.category}</h3>
            </div>
            {group.note && (
              <p className="text-white/30 text-xs mt-2 italic ml-3">{group.note}</p>
            )}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {group.items.map((item, i) => (
              <ComparisonRow
                key={i}
                item={item}
                index={i}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PlayerHeaderCard({ data, accentColor, navigate, score, otherScore }) {
  const accent = accentColor === 'green'
    ? { border: 'border-green-400/30', text: 'text-green-400', bg: 'from-green-400/10', glow: 'shadow-[0_0_40px_rgba(74,222,128,0.12)]' }
    : { border: 'border-purple-400/30', text: 'text-purple-400', bg: 'from-purple-400/10', glow: 'shadow-[0_0_40px_rgba(96,165,250,0.12)]' }

  const isWinner = score > otherScore && score > 0

  return (
    <div className={`relative bg-gradient-to-br ${accent.bg} to-transparent bg-white/[0.03] border ${accent.border} ${isWinner ? accent.glow : ''} rounded-2xl p-6 text-center transition-all duration-500`}>
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-green-400 text-black text-xs font-black uppercase tracking-widest shadow-lg">
          🏆 Winner!
        </div>
      )}
      <div className="relative inline-block mb-4">
        <div className="w-28 h-32 mx-auto rounded-xl overflow-hidden bg-white/5 border border-white/10">
          {data.profile.imageUrl ? (
            <img src={data.profile.imageUrl} alt={data.profile.name} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
          )}
        </div>
        {data.profile.citizenship?.[0] && (
          <div className="absolute -bottom-1 -left-1 w-9 h-9 rounded-full bg-[#0a0a0f] border-2 border-white/10 overflow-hidden">
            <img
              src={`https://flagcdn.com/w80/${getCountryCode(data.profile.citizenship[0])}.png`}
              alt={data.profile.citizenship[0]}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.parentElement.style.display = 'none' }}
            />
          </div>
        )}
      </div>
      <button
        onClick={() => navigate(`/player/${data.profile.id}`)}
        className={`${accent.text} text-xl font-black hover:underline transition-all`}
      >
        {data.profile.name}
      </button>
      <p className="text-white/50 text-sm mt-1">{data.profile.club?.name || '—'}</p>
      <p className="text-white/30 text-xs uppercase tracking-widest mt-1">{data.profile.position?.main || '—'}</p>
    </div>
  )
}

function ComparisonRow({ item, index }) {
  const { label, val1, val2, raw1, raw2, higherWins, suffix = '', capitalize = false } = item

  const c1 = raw1 !== undefined ? raw1 : (typeof val1 === 'number' ? val1 : null)
  const c2 = raw2 !== undefined ? raw2 : (typeof val2 === 'number' ? val2 : null)

  let p1Wins = false
  let p2Wins = false
  if (higherWins !== null && c1 !== null && c2 !== null && c1 !== c2 && val1 !== '—' && val2 !== '—') {
    if (higherWins) {
      p1Wins = c1 > c2
      p2Wins = c2 > c1
    } else {
      p1Wins = c1 < c2
      p2Wins = c2 < c1
    }
  }

  // Bar visualization (only when comparing numeric values)
  const showBars = higherWins !== null && typeof c1 === 'number' && typeof c2 === 'number' && (c1 > 0 || c2 > 0)
  const total = showBars ? c1 + c2 : 0
  const pct1 = showBars && total > 0 ? (c1 / total) * 100 : 50
  const pct2 = showBars && total > 0 ? (c2 / total) * 100 : 50

  const displayVal = (v) => {
    if (v === null || v === undefined || v === '—') return '—'
    const formatted = typeof v === 'number' ? v.toLocaleString() : v
    return `${formatted}${suffix}`
  }

  return (
    <div
      className="grid grid-cols-3 hover:bg-white/[0.02] transition-colors group"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Player 1 value */}
      <div className={`p-4 text-center text-base md:text-lg font-bold text-white/70 transition-colors ${capitalize ? 'capitalize' : ''}`}>
        <span className="inline-flex items-center gap-1.5">
          {p1Wins && <span className="text-base">🏆</span>}
          {displayVal(val1)}
        </span>
      </div>

      {/* Label */}
      <div className="p-4 flex items-center justify-center border-x border-white/5">
        <span className="text-white/40 text-xs uppercase tracking-widest font-semibold text-center">{label}</span>
      </div>

      {/* Player 2 value */}
      <div className={`p-4 text-center text-base md:text-lg font-bold text-white/70 transition-colors ${capitalize ? 'capitalize' : ''}`}>
        <span className="inline-flex items-center gap-1.5">
          {p2Wins && <span className="text-base">🏆</span>}
          {displayVal(val2)}
        </span>
      </div>

      {/* Animated comparison bar with center marker */}
      {showBars && (
        <div className="col-span-3 px-4 pb-3 -mt-1">
          <div className="relative">
            <div className="flex h-1.5 rounded-full overflow-hidden bg-white/[0.04]">
              <div
                className="bg-gradient-to-r from-green-400/80 to-green-400/40 fill-bar transition-all duration-700"
                style={{ width: `${pct1}%` }}
              />
              <div
                className="bg-gradient-to-l from-purple-400/80 to-purple-400/40 fill-bar transition-all duration-700"
                style={{ width: `${pct2}%` }}
              />
            </div>
            {/* Center marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/40 rounded-full" />
            {/* Center marker dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60 border border-[#0a0a0f]" />
          </div>
        </div>
      )}
    </div>
  )
}