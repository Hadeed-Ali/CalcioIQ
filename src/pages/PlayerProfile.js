import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

export default function PlayerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [marketValue, setMarketValue] = useState(null)
  const [achievements, setAchievements] = useState(null)
  const [transfers, setTransfers] = useState(null)
  const [injuries, setInjuries] = useState(null)
  const [currentStats, setCurrentStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [recentMatches, setRecentMatches] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [profileRes, mvRes, achRes, transRes, injRes] = await Promise.all([
          fetch(`http://localhost:3001/api/players/${id}/profile`),
          fetch(`http://localhost:3001/api/players/${id}/market_value`),
          fetch(`http://localhost:3001/api/players/${id}/achievements`),
          fetch(`http://localhost:3001/api/players/${id}/transfers`),
          fetch(`http://localhost:3001/api/players/${id}/injuries`),
        ])
        const [profileData, mvData, achData, transData, injData] = await Promise.all([
          profileRes.json(),
          mvRes.json(),
          achRes.json(),
          transRes.json(),
          injRes.json(),
        ])
        setProfile(profileData)
        setMarketValue(mvData)
        setAchievements(achData)
        setTransfers(transData)
        setInjuries(injData)

        if (profileData?.name) {
          try {
            const statsRes = await fetch(`http://localhost:3001/api/stats/search/${encodeURIComponent(profileData.name)}`)
            const statsData = await statsRes.json()
            setCurrentStats(statsData)
          } catch (e) {
            console.log('Stats fetch failed:', e)
            setCurrentStats({ found: false })
          }
        }

        // Fetch recent team matches
        if (profileData?.club?.name) {
          try {
            const matchesRes = await fetch(`http://localhost:3001/api/team/matches?name=${encodeURIComponent(profileData.club.name)}`)
            const matchesData = await matchesRes.json()
            setRecentMatches(matchesData)
          } catch (e) {
            console.log('Matches fetch failed:', e)
            setRecentMatches({ found: false })
          }
        }
      } catch (err) {
        console.log('Error fetching player:', err)
      }
      setLoading(false)
    }
    fetchAll()
    setActiveTab('overview')
  }, [id])

  const formatValue = (value) => {
    const n = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(n) || n <= 0) return '—'
    if (n >= 1000000) return `€${(n / 1000000).toFixed(0)}m`
    if (n >= 1000) return `€${(n / 1000).toFixed(0)}k`
    return `€${n}`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return '—'
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) return <LoadingScreen />

  if (!profile || profile.error) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/40 text-lg mb-4">Player not found</p>
        <button onClick={() => navigate('/')} className="text-green-400 text-sm hover:underline">← Back to search</button>
      </div>
    </div>
  )

  const currentMarketValueNumber = typeof profile.marketValue === 'number'
    ? profile.marketValue
    : Number(profile.marketValue)
  const hasCurrentMarketValue = Number.isFinite(currentMarketValueNumber) && currentMarketValueNumber > 0
  const isRetired = (profile.club?.name || '').trim().toLowerCase() === 'retired'

  const peakValue = marketValue?.marketValueHistory?.length
    ? Math.max(
      ...marketValue.marketValueHistory
        .map((h) => (typeof h.marketValue === 'number' ? h.marketValue : Number(h.marketValue)))
        .filter((n) => Number.isFinite(n) && n > 0),
    )
    : null
  const hasPeakValue = Number.isFinite(peakValue) && peakValue > 0

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <div
          className="profile-orb"
          style={{
            left: '10%',
            top: '14%',
            width: '360px',
            height: '360px',
            background: 'radial-gradient(circle at 35% 35%, rgba(74, 222, 128, 0.18), rgba(74, 222, 128, 0) 62%)',
            animationDuration: '10s',
          }}
        />
        <div
          className="profile-orb"
          style={{
            right: '-6%',
            top: '34%',
            width: '520px',
            height: '520px',
            background: 'radial-gradient(circle at 40% 40%, rgba(56, 189, 248, 0.12), rgba(56, 189, 248, 0) 60%)',
            animationDuration: '12s',
            animationDelay: '300ms',
          }}
        />
        <div
          className="profile-orb"
          style={{
            left: '22%',
            bottom: '-10%',
            width: '560px',
            height: '560px',
            background: 'radial-gradient(circle at 45% 45%, rgba(74, 222, 128, 0.10), rgba(74, 222, 128, 0) 62%)',
            animationDuration: '14s',
            animationDelay: '120ms',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-5 border-b border-white/5 profile-animate-in">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <img src="/CalcioAI Logo.png" alt="CalcioIQ logo" className="w-14 h-14 object-contain" />
          <span className="text-green-400 font-bold text-2xl tracking-widest uppercase">CALCIO<span className="text-white">IQ</span></span>
        </button>
        <button onClick={() => navigate('/')} className="text-white/40 text-m hover:text-white transition-colors">
          ← Back to search
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 overflow-hidden border-b border-white/5 profile-animate-in profile-delay-1">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/3 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-start gap-8">

            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-45 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl">👤</div>`
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
                )}
              </div>
              {profile.shirtNumber && (
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-green-400 rounded-full text-black font-black text-s">
                  {profile.shirtNumber}
                </div>
              )}

              {profile.citizenship?.[0] && (
                <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-[#000000] border-2 border-white/10 overflow-hidden flex items-center justify-center" title={`Plays for ${profile.citizenship[0]}`}>
                  <img
                    src={`https://flagcdn.com/w80/${getCountryCode(profile.citizenship[0])}.png`}
                    alt={profile.citizenship[0]}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.parentElement.style.display = 'none' }}
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {profile.position?.main && (
                  <span className="text-white/30 text-sm uppercase tracking-widest">{profile.position.main}</span>
                )}
                {profile.citizenship?.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">{c}</span>
                ))}
              </div>

              <h1 className="text-4xl font-black tracking-tight leading-none mb-5">
                {profile.name}
              </h1>

              {/* Quick stats row */}
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  {hasCurrentMarketValue ? (
                    <>
                      <p className="text-green-400 text-xl font-black">{formatValue(currentMarketValueNumber)}</p>
                      <p className="text-white/30 text-xs mt-0.5">Current Value</p>
                    </>
                  ) : (
                    <>
                      <p className={`text-xl font-black ${isRetired ? 'text-white/70' : 'text-white/40'}`}>
                        {isRetired ? 'Retired' : '—'}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {isRetired ? 'Market value unavailable' : 'Current Value'}
                      </p>
                    </>
                  )}
                </div>
                {hasPeakValue && (
                  <div className="text-center">
                    <p className="text-white text-xl font-black">{formatValue(peakValue)}</p>
                    <p className="text-white/30 text-xs mt-0.5">Highest Value</p>
                  </div>
                )}

                {currentStats?.found && currentStats.competitions?.[0] && (
                  <div className="text-center">
                    <p className="text-white text-xl font-black">
                      {currentStats.competitions.reduce((sum, c) => sum + c.stats.goals, 0)}
                      <span className="text-white/40 text-base"> + </span>
                      {currentStats.competitions.reduce((sum, c) => sum + c.stats.assists, 0)}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">Goals + Assists 25/26</p>
                  </div>
                )}
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                {/* Personal */}
                <div>
                  <p className="text-white/25 text-xs uppercase tracking-widest mb-2 font-semibold">Personal Info</p>
                  <div className="space-y-1.5">
                    {profile.placeOfBirth?.city && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Birthplace</span>
                        <span className="text-white text-sm">
                          {profile.placeOfBirth.city}{profile.placeOfBirth.country ? `, ${profile.placeOfBirth.country}` : ''}
                        </span>
                      </div>
                    )}
                    {profile.height && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Height</span>
                        <span className="text-white text-sm">{profile.height} cm</span>
                      </div>
                    )}
                    {profile.foot && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Preferred Foot</span>
                        <span className="text-white text-sm capitalize">{profile.foot}</span>
                      </div>
                    )}
                    {profile.agent?.name && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Agent</span>
                        <span className="text-white text-sm">{profile.agent.name}</span>
                      </div>
                    )}
                    {profile.outfitter && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Sponsor</span>
                        <span className="text-white text-sm">{profile.outfitter}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Club */}
                <div>
                  <p className="text-white/25 text-xs uppercase tracking-widest mb-2 font-semibold">Club Info</p>
                  <div className="space-y-1.5">
                    {profile.club?.name && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Club</span>
                        <span className="text-white text-sm">{profile.club.name}</span>
                      </div>
                    )}
                    {profile.club?.joined && !isRetired && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Date Joined</span>
                        <span className="text-white text-sm">{formatDate(profile.club.joined)}</span>
                      </div>
                    )}
                    {profile.club?.contractExpires && !isRetired && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Contracted Until</span>
                        <span className="text-white text-sm">{formatDate(profile.club.contractExpires)}</span>
                      </div>
                    )}
                    {profile.citizenship?.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/40 text-sm">Nationality</span>
                        <span className="text-white text-sm">{profile.citizenship.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Content (all wrapped in single max-w-5xl container) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 profile-animate-in profile-delay-2">

        {/* Tab buttons */}
        <div className="flex gap-8 sm:gap-20 border-b border-white/5 mb-8 mt-2">
          {['overview', 'stats', 'market value', 'trophies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-1 py-3 text-sm font-medium capitalize transition-all duration-300 group ${activeTab === tab
                ? 'text-green-400'
                : 'text-white/40 hover:text-white/90'
                }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5 inline-block">
                {tab}
              </span>
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-green-400 transition-all duration-300 ease-out ${activeTab === tab
                  ? 'w-full opacity-100'
                  : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-50'
                  }`}
              />
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="pb-16 profile-animate-in profile-delay-3">
            {/* Positions */}
            {profile.position && (profile.position.main || profile.position.other?.length > 0) && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-4 bg-green-400 rounded-full" />
                  <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Positions</h2>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {profile.position.main && (
                    <span className="px-4 py-2 bg-green-400/10 border border-green-400/30 rounded-xl text-green-400 text-sm font-medium">
                      {profile.position.main}
                    </span>
                  )}
                  {profile.position.other?.map(pos => (
                    <span key={pos} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm">
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Transfer History */}
            {transfers?.transfers?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-4 bg-green-400 rounded-full" />
                  <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Transfer History</h2>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                  <div className="max-h-[min(28rem,70vh)] overflow-y-auto overscroll-contain">
                    <ul className="divide-y divide-white/[0.06]">
                      {transfers.transfers.map((t, i) => {
                        const fromName = t.clubFrom?.name || '—'
                        const toName = t.clubTo?.name || '—'
                        const hasFee = typeof t.fee === 'number' && t.fee > 0
                        const hasMarketValue = typeof t.marketValue === 'number' && t.marketValue > 0
                        return (
                          <li
                            key={t.id || i}
                            className="flex gap-3 sm:gap-5 px-4 sm:px-5 py-4 hover:bg-white/[0.03] transition-colors"
                          >
                            <div className="shrink-0 w-[4.5rem] sm:w-24 pt-0.5">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-green-400/85 leading-tight">
                                {t.season || '—'}
                              </p>
                              <p className="text-xs text-white/40 mt-1 tabular-nums">{formatDate(t.date)}</p>
                            </div>
                            <div className="flex-1 min-w-0 border-l border-white/[0.08] pl-3 sm:pl-5">
                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <div className="flex items-center gap-2 min-w-0">
                                  {t.clubFrom?.id && (
                                    <img
                                      src={`https://tmssl.akamaized.net/images/wappen/medium/${t.clubFrom.id}.png`}
                                      alt={fromName}
                                      className="w-5 h-5 object-contain flex-shrink-0"
                                      onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                  )}
                                  <span className="text-white/55 text-sm truncate" title={fromName}>{fromName}</span>
                                </div>
                                <span className="text-green-400/50 text-sm flex-shrink-0" aria-hidden>→</span>
                                <div className="flex items-center gap-2 min-w-0">
                                  {t.clubTo?.id && (
                                    <img
                                      src={`https://tmssl.akamaized.net/images/wappen/medium/${t.clubTo.id}.png`}
                                      alt={toName}
                                      className="w-5 h-5 object-contain flex-shrink-0"
                                      onError={(e) => { e.target.style.display = 'none' }}
                                    />
                                  )}
                                  <span className="text-white font-semibold text-sm truncate" title={toName}>{toName}</span>
                                </div>
                              </div>
                              {(hasFee || hasMarketValue) && (
                                <p className="text-xs text-white/40 mt-1.5">
                                  {hasFee ? (
                                    <>Fee: <span className="text-white/50 font-medium">{formatValue(t.fee)}</span></>
                                  ) : (
                                    <span className="text-white/30 italic">Fee: Free</span>
                                  )}
                                  {hasMarketValue && (
                                    <span className="text-white/35 ml-2">· Market Value: {formatValue(t.marketValue)}</span>
                                  )}
                                </p>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Injury History */}
            {injuries?.injuries?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-4 bg-red-400 rounded-full" />
                  <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Recent Injury History</h2>
                </div>

                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                  <div className="grid grid-cols-5 px-5 py-3 border-b border-white/5">
                    <span className="text-white/30 text-xs uppercase tracking-widest">Season</span>
                    <span className="text-white/30 text-xs uppercase tracking-widest col-span-2">Injury Type</span>
                    <span className="text-white/30 text-xs uppercase tracking-widest text-right">Days Out</span>
                    <span className="text-white/30 text-xs uppercase tracking-widest text-right">Games Missed</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {injuries.injuries.map((inj, i) => (
                      <div key={i} className="grid grid-cols-5 px-5 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                        <span className="text-white/50 text-sm">{inj.season || '—'}</span>
                        <span className="text-white/70 text-sm col-span-2 capitalize truncate">{inj.injury || '—'}</span>
                        <span className="text-white/80 text-sm font-medium text-right">{inj.days || '—'}</span>
                        <span className="text-red-400/80 text-sm text-right">{inj.gamesMissed || '0'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Relatives */}
            {profile.relatives?.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-4 bg-green-400 rounded-full" />
                  <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Related Players</h2>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {profile.relatives
                    .filter(rel => rel.profileType === 'player')
                    .map(rel => (
                      <button
                        key={rel.id}
                        onClick={() => navigate(`/player/${rel.id}`)}
                        className="px-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white/60 text-sm hover:border-green-400/30 hover:text-white transition-all"
                      >
                        {rel.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Social Media */}
            {profile.socialMedia?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-4 bg-green-400 rounded-full" />
                  <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Social Media</h2>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {profile.socialMedia.map((url, i) => {
                    const domain = url.includes('instagram') ? 'Instagram' :
                      url.includes('twitter') || url.includes('x.com') ? 'Twitter/X' :
                        url.includes('facebook') ? 'Facebook' :
                          url.includes('tiktok') ? 'TikTok' : 'Website'
                    return (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white/60 text-sm hover:border-green-400/30 hover:text-white transition-all">
                        {domain} ↗
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="pb-16 profile-animate-in profile-delay-3">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-4 bg-green-400 rounded-full" />
              <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Current Season Stats</h2>
            </div>

            {currentStats === null ? (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-8 text-center">
                <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white/40 text-sm">Loading stats...</p>
              </div>
            ) : currentStats?.found && currentStats.competitions?.length > 0 ? (
              <>
                <StatsCompetitions competitions={currentStats.competitions} />
                <RecentMatches matches={recentMatches} clubName={profile.club?.name} />
              </>
            ) : (
              <>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-8 text-center mb-8">
                  <div className="text-4xl mb-3 opacity-30">📊</div>
                  <p className="text-white/50 text-sm mb-2">No current season stats available</p>
                  <p className="text-white/30 text-xs max-w-md mx-auto leading-relaxed">
                    Current season stats only available for top scorers in major leagues as provided by Football-data.org.
                  </p>
                  {isRetired && (
                    <p className="text-white/40 text-xs mt-3 italic">
                      This player is retired.
                    </p>
                  )}
                </div>
                <RecentMatches matches={recentMatches} clubName={profile.club?.name} />
              </>
            )}
          </div>
        )}

        {/* Market Value Tab */}
        {activeTab === 'market value' && (
          <div className="pb-16 profile-animate-in profile-delay-3">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-4 bg-green-400 rounded-full" />
              <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Market Value</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/[0.03] border border-green-400/20 rounded-xl p-5">
                <p className="text-white/40 text-xs mb-1">Current Value</p>
                {hasCurrentMarketValue ? (
                  <p className="text-green-400 text-3xl font-black">{formatValue(currentMarketValueNumber)}</p>
                ) : (
                  <div className="pt-1">
                    <p className={`text-2xl font-black ${isRetired ? 'text-white/70' : 'text-white/40'}`}>
                      {isRetired ? 'Retired' : '—'}
                    </p>
                    <p className="text-white/30 text-xs mt-1">
                      {isRetired ? 'Market value unavailable' : 'No current value'}
                    </p>
                  </div>
                )}
              </div>
              {hasPeakValue && (
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
                  <p className="text-white/40 text-xs mb-1">Peak Value</p>
                  <p className="text-white text-3xl font-black">{formatValue(peakValue)}</p>
                </div>
              )}
            </div>

            {marketValue?.marketValueHistory?.length > 0 ? (
              <>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 mb-6">
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-4 font-bold">Visual History</p>
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={marketValue.marketValueHistory.map(h => ({
                      date: new Date(h.date).getFullYear(),
                      value: (h.marketValue || 0) / 1000000,
                      club: h.clubName,
                      fullDate: h.date
                    }))}>
                      <defs>
                        <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4ade80" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 12 }} tickFormatter={(v) => `€${v}m`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f0f18',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                        formatter={(value) => [`€${value}m`, 'Market Value']}
                        labelFormatter={(label) => `Year: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#4ade80"
                        strokeWidth={2}
                        fill="url(#valueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-3 font-semibold">Full History</p>
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                    <div className="grid grid-cols-4 px-5 py-3 border-b border-white/5">
                      <span className="text-white/30 text-xs uppercase tracking-widest">Date</span>
                      <span className="text-white/30 text-xs uppercase tracking-widest">Club</span>
                      <span className="text-white/30 text-xs uppercase tracking-widest text-right">Value</span>
                      <span className="text-white/30 text-xs uppercase tracking-widest text-right">Change</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[...marketValue.marketValueHistory].reverse().map((entry, i, arr) => {
                        const prev = arr[i + 1]
                        const change = prev ? entry.marketValue - prev.marketValue : null
                        const percentChange = prev && prev.marketValue > 0
                          ? ((change / prev.marketValue) * 100).toFixed(1)
                          : null

                        return (
                          <div key={i} className="grid grid-cols-4 px-5 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                            <span className="text-white/50 text-sm">{formatDate(entry.date)}</span>
                            <span className="text-white/70 text-sm truncate">{entry.clubName || '—'}</span>
                            <span className="text-white text-sm font-medium text-right">{formatValue(entry.marketValue)}</span>
                            <span className={`text-sm font-medium text-right ${change === null ? 'text-white/20' :
                              change > 0 ? 'text-green-400' :
                                change < 0 ? 'text-red-400' :
                                  'text-white/40'
                              }`}>
                              {change === null || percentChange === null ? '—' :
                                change === 0 ? '—' : (() => {
                                  const absPct = Math.abs(Number(percentChange))
                                  const display = absPct > 999 ? '> 999' : absPct.toFixed(1)
                                  return `${change > 0 ? '↑' : '↓'} ${display}%`
                                })()}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-8 text-center">
                <p className="text-white/40 text-sm">No market value history available</p>
              </div>
            )}
          </div>
        )}

        {/* Trophies Tab */}
        {activeTab === 'trophies' && (
          <div className="pb-16 profile-animate-in profile-delay-3">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-4 bg-green-400 rounded-full" />
              <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">Career Achievements</h2>
            </div>

            {achievements?.achievements?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.achievements.map((ach, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 hover:border-green-400/20 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-white font-semibold text-m leading-snug pr-4">{ach.title}</h3>
                      <span className="flex-shrink-0 w-9 h-9 bg-green-400/10 border border-green-400/20 rounded-full flex items-center justify-center text-green-400 font-black text-m">
                        {ach.count}x
                      </span>
                    </div>
                    <div className="space-y-1">
                      {ach.details?.slice(0, 3).map((d, j) => (
                        <p key={j} className="text-white/30 text-sm">
                          {d.season?.name || ''} {d.season?.name && (d.club?.name || d.competition?.name) ? '·' : ''} {(d.club?.name || '').trim() || 'Personal'} {d.competition?.name ? `· ${d.competition.name}` : ''}
                        </p>
                      ))}
                      {ach.details?.length > 3 && (
                        <p className="text-white/20 text-xs">+{ach.details.length - 3} more</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-8 text-center">
                <p className="text-white/20 text-sm">No achievements found</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

function StatsCompetitions({ competitions }) {
  const [activeComp, setActiveComp] = useState(0)
  const current = competitions[activeComp]

  const totals = competitions.reduce((acc, c) => ({
    goals: acc.goals + c.stats.goals,
    assists: acc.assists + c.stats.assists,
    matches: acc.matches + c.stats.playedMatches,
    penalties: acc.penalties + c.stats.penalties,
  }), { goals: 0, assists: 0, matches: 0, penalties: 0 })

  return (
    <>
      {competitions.length > 1 && (
        <div className="bg-gradient-to-br from-green-400/10 to-transparent border border-green-400/20 rounded-xl p-6 mb-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">All Competitions</p>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-white text-3xl font-black">{totals.matches}</p>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Matches</p>
            </div>
            <div>
              <p className="text-green-400 text-3xl font-black">{totals.goals}</p>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Goals</p>
            </div>
            <div>
              <p className="text-white text-3xl font-black">{totals.assists}</p>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Assists</p>
            </div>
            <div>
              <p className="text-white text-3xl font-black">{totals.goals + totals.assists}</p>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Goals + Assists</p>
            </div>
          </div>
        </div>
      )}

      {competitions.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {competitions.map((c, i) => (
            <button
              key={c.competition.id}
              onClick={() => setActiveComp(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${activeComp === i
                ? 'bg-green-400/10 border-green-400/30 text-green-400'
                : 'bg-white/[0.03] border-white/[0.07] text-white/60 hover:text-white hover:border-white/20'
                }`}
            >
              {c.competition.emblem && (
                <img
                  src={c.competition.emblem}
                  alt={c.competition.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              {c.competition.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
        {current.competition?.emblem && (
          <img
            src={current.competition.emblem}
            alt={current.competition.name}
            className="w-10 h-10 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        )}
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">{current.competition?.name}</p>
          <p className="text-white/40 text-xs">{current.season} season</p>
        </div>
        {current.team?.crest && (
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">{current.team.shortName || current.team.name}</span>
            <img
              src={current.team.crest}
              alt={current.team.name}
              className="w-10 h-10 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 text-center">
          <p className="text-white text-4xl font-black mb-1">{current.stats.playedMatches}</p>
          <p className="text-white/40 text-xs uppercase tracking-widest">Matches</p>
        </div>
        <div className="bg-white/[0.03] border border-green-400/20 rounded-xl p-5 text-center">
          <p className="text-green-400 text-4xl font-black mb-1">{current.stats.goals}</p>
          <p className="text-white/40 text-xs uppercase tracking-widest">Goals</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 text-center">
          <p className="text-white text-4xl font-black mb-1">{current.stats.assists}</p>
          <p className="text-white/40 text-xs uppercase tracking-widest">Assists</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 text-center">
          <p className="text-white text-4xl font-black mb-1">{current.stats.penalties}</p>
          <p className="text-white/40 text-xs uppercase tracking-widest">Penalties</p>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 mb-4">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Goal Contributions in {current.competition.name}</p>
        <p className="text-white text-4xl font-black">
          {current.stats.goals + current.stats.assists}
        </p>
        <p className="text-white/50 text-sm mt-2">
          in {current.stats.playedMatches} matches
          {current.stats.playedMatches > 0 && (
            <span className="text-white/30">
              {' '}({((current.stats.goals + current.stats.assists) / current.stats.playedMatches).toFixed(2)} per match)
            </span>
          )}
        </p>
      </div>

      <p className="text-white/35 text-s text-center mt-4">
        Note: Statistics sourced from Football-data.org ©
      </p>
    </>
  )
}

function RecentMatches({ matches, clubName }) {
  if (!matches?.found || !matches.matches?.length) return null

  const formatMatchDate = (dateStr) => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 bg-green-400 rounded-full" />
        <h2 className="text-white/60 text-sm uppercase tracking-widest font-semibold">
          {clubName ? `${clubName} — Recent Matches (All Comps)` : 'Recent Team Matches (All Comps)'}
        </h2>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
        {matches.matches.map((match, i) => {
          const isHome = match.homeTeam.id === matches.teamId
          const ourTeam = isHome ? match.homeTeam : match.awayTeam
          const opponent = isHome ? match.awayTeam : match.homeTeam
          const ourScore = isHome ? match.score?.home : match.score?.away
          const oppScore = isHome ? match.score?.away : match.score?.home

          let result = 'D'
          let resultColor = 'text-white/50 bg-white/10'
          if (match.winner === 'HOME_TEAM' && isHome) {
            result = 'W'
            resultColor = 'text-green-400 bg-green-400/10 border border-green-400/20'
          } else if (match.winner === 'AWAY_TEAM' && !isHome) {
            result = 'W'
            resultColor = 'text-green-400 bg-green-400/10 border border-green-400/20'
          } else if (match.winner === 'DRAW') {
            result = 'D'
            resultColor = 'text-white/60 bg-white/5 border border-white/10'
          } else {
            result = 'L'
            resultColor = 'text-red-400 bg-red-400/10 border border-red-400/20'
          }

          return (
            <div
              key={match.id}
              className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              {/* Result badge */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 ${resultColor}`}>
                {result}
              </div>

              {/* Date + competition */}
              <div className="w-20 flex-shrink-0">
                <p className="text-white/50 text-xs font-semibold">{formatMatchDate(match.date)}</p>
                <p className="text-white/30 text-xs truncate">{match.competition?.code || ''}</p>
              </div>

              {/* Home/Away badge */}
              <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${isHome ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' : 'bg-purple-400/10 text-purple-400 border border-purple-400/20'}`}>
                {isHome ? 'Home' : 'Away'}
              </div>

              {/* Opponent */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-white/40 text-xs flex-shrink-0">vs</span>
                {opponent.crest && (
                  <img
                    src={opponent.crest}
                    alt={opponent.name}
                    className="w-5 h-5 object-contain flex-shrink-0"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                )}
                <span className="text-white text-sm font-medium truncate">{opponent.shortName || opponent.name}</span>
              </div>

              {/* Score - player's team always green */}
              <div className="text-right flex-shrink-0">
                <p className="text-base font-black tabular-nums">
                  <span className="text-green-400">{ourScore ?? '-'}</span>
                  <span className="text-white/30 mx-1">-</span>
                  <span className="text-white/70">{oppScore ?? '-'}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>


    </div>
  )
}

const FUN_FACTS = [
  "Cristiano Ronaldo has scored in every minute of a 90-minute match across his career.",
  "Lionel Messi was diagnosed with growth hormone deficiency at age 11 — Barcelona paid for his treatment.",
  "Erling Haaland's father, Alf-Inge Haaland, also played in the Premier League.",
  "Kylian Mbappé donated his entire 2018 World Cup earnings to charity.",
  "Pelé scored 1,279 goals in 1,363 games — a record recognized by FIFA.",
  "Zlatan Ibrahimović is fluent in five languages: Swedish, Bosnian, English, Spanish, and Italian.",
  "Lamine Yamal became the youngest player to score in a UEFA Euro at age 16.",
  "Vinícius Jr. grew up playing futsal — he didn't switch to 11-a-side until he was 13.",
  "Mohamed Salah scored 32 Premier League goals in 2017/18, a record for a 38-game season.",
  "Kevin De Bruyne was rejected by Genk's academy as a teenager before signing with them anyway.",
  "Robert Lewandowski once scored 5 goals in 9 minutes against Wolfsburg in 2015.",
  "Luka Modrić is the only player besides Messi and Ronaldo to win the Ballon d'Or since 2008.",
  "Neymar's full name is Neymar da Silva Santos Júnior.",
  "The fastest goal ever scored was 2.4 seconds, by Nawaf Al Abed in 2009.",
  "Harry Kane scored on his Premier League debut for Tottenham — he was 21.",
  "Jude Bellingham wore the number 22 at Dortmund as it had been retired in honor of him after he left at 17.",
  "Bukayo Saka taught himself to be left-footed despite being naturally right-footed.",
  "Andrés Iniesta cried for hours after scoring the winning goal in the 2010 World Cup final.",
  "Sergio Ramos has scored more than 100 goals as a defender — a rarity in football history.",
  "Karim Benzema didn't play for France for nearly 6 years between 2015 and 2021.",
  "Phil Foden grew up a Manchester City fan and was a ball boy at the Etihad as a kid.",
  "Antoine Griezmann nearly quit football at 13 after being rejected by every French academy for being too small.",
  "Manchester United and Manchester City share the same city but have only met in one FA Cup Final (2023).",
  "The Champions League anthem is sung in three languages: English, French, and German.",
  "Real Madrid have won the Champions League/European Cup 15 times — more than any other club.",
  "Pep Guardiola was Barcelona's captain before becoming their manager.",
  "Liverpool's 'You'll Never Walk Alone' was originally a song from the 1945 musical Carousel.",
  "The first official football match was played in 1863 in England.",
  "Brazil is the only country to have appeared in every FIFA World Cup.",
  "Ronaldinho once juggled a ball over a Mercedes-Benz in a famous (allegedly faked) commercial.",
]

function LoadingScreen() {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length))

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(prev => {
        let next = Math.floor(Math.random() * FUN_FACTS.length)
        while (next === prev && FUN_FACTS.length > 1) {
          next = Math.floor(Math.random() * FUN_FACTS.length)
        }
        return next
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-white/40 text-sm mb-8">Loading player data...</p>
        <p className="text-white/35 text-s mb-8 italic">First load takes a few extra seconds - loading up the cache!</p>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5">
          <p className="text-green-400 text-xs uppercase tracking-widest mb-3 font-semibold">
            Did You Know? ⚽
          </p>
          <p key={factIndex} className="text-white/70 text-sm leading-relaxed fact-fade">
            {FUN_FACTS[factIndex]}
          </p>
        </div>
      </div>
    </div>
  )
}