require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const TM_BASE = 'http://localhost:8000'
const cache = {}

// Generic helper to fetch from Transfermarkt and cache it
async function fetchTM(path, cacheKey, res) {
  if (cache[cacheKey]) return res.json(cache[cacheKey])
  try {
    const response = await fetch(`${TM_BASE}${path}`)
    const data = await response.json()
    cache[cacheKey] = data
    res.json(data)
  } catch (err) {
    console.log('Error:', err)
    res.status(500).json({ error: 'Failed to fetch data' })
  }
}

app.get('/api/players/search', async (req, res) => {
  const { query } = req.query
  if (!query) return res.json([])
  if (cache[`search_${query}`]) return res.json(cache[`search_${query}`])

  try {
    const response = await fetch(`${TM_BASE}/players/search/${query}`)
    const data = await response.json()
    const results = data.results || []
    cache[`search_${query}`] = results
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Failed to search players' })
  }
})

app.get('/api/players/:id/profile', (req, res) =>
  fetchTM(`/players/${req.params.id}/profile`, `profile_${req.params.id}`, res))

app.get('/api/players/:id/market_value', (req, res) =>
  fetchTM(`/players/${req.params.id}/market_value`, `mv_${req.params.id}`, res))

app.get('/api/players/:id/achievements', (req, res) =>
  fetchTM(`/players/${req.params.id}/achievements`, `ach_${req.params.id}`, res))

app.get('/api/players/:id/stats', (req, res) =>
  fetchTM(`/players/${req.params.id}/stats`, `stats_${req.params.id}`, res))

app.get('/api/players/:id/transfers', (req, res) =>
  fetchTM(`/players/${req.params.id}/transfers`, `transfers_${req.params.id}`, res))

app.get('/api/players/:id/jersey_numbers', (req, res) =>
  fetchTM(`/players/${req.params.id}/jersey_numbers`, `jersey_${req.params.id}`, res))

app.get('/api/players/:id/injuries', (req, res) =>
  fetchTM(`/players/${req.params.id}/injuries`, `inj_${req.params.id}`, res))

// ============ FOOTBALL-DATA.ORG STATS ============

const FD_KEY = process.env.FOOTBALL_DATA_KEY
const FD_BASE = 'https://api.football-data.org/v4'

// Top 5 leagues + Champions League
const COMPETITIONS = ['PL', 'PD', 'BL1', 'SA', 'FL1', 'CL']

// Cache the actual leaderboards (one-time fetch, refresh every hour)
let scorersCache = null
let scorersCachedAt = 0
const CACHE_TTL = 60 * 60 * 1000  // 1 hour in milliseconds

async function getAllScorers() {
  if (scorersCache && (Date.now() - scorersCachedAt) < CACHE_TTL) {
    return scorersCache
  }

  console.log('Fetching fresh scorers from football-data.org...')
  const responses = await Promise.all(
    COMPETITIONS.map(code =>
      fetch(`${FD_BASE}/competitions/${code}/scorers?limit=100`, {
        headers: { 'X-Auth-Token': FD_KEY }
      }).then(r => r.ok ? r.json() : null).catch(() => null)
    )
  )

  scorersCache = responses
  scorersCachedAt = Date.now()
  return responses
}

const statsCache = {}

app.get('/api/stats/search/:name', async (req, res) => {
  const name = req.params.name.toLowerCase().trim()

  if (statsCache[name]) {
    return res.json(statsCache[name])
  }

  try {
    const responses = await getAllScorers()

    const allMatches = []

    for (const data of responses) {
      if (!data || !data.scorers) continue

      const match = data.scorers.find(s => {
        const playerName = s.player?.name?.toLowerCase() || ''
        return playerName.includes(name) || name.includes(playerName)
      })

      if (match) {
        allMatches.push({
          competition: data.competition,
          season: '2025/26',
          player: {
            name: match.player.name,
            nationality: match.player.nationality,
            position: match.player.position,
          },
          team: match.team,
          stats: {
            goals: match.goals || 0,
            assists: match.assists || 0,
            penalties: match.penalties || 0,
            playedMatches: match.playedMatches || 0,
          }
        })
      }
    }

    if (allMatches.length === 0) {
      const result = { found: false }
      statsCache[name] = result
      return res.json(result)
    }

    const result = {
      found: true,
      competitions: allMatches,
    }

    statsCache[name] = result
    res.json(result)
  } catch (err) {
    console.log('Football-data error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// ============ TEAM RECENT MATCHES ============

// Strip accents/umlauts: "München" -> "Munchen", "Atlético" -> "Atletico"
function normalize(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

// Manual aliases for known cross-API name differences
const TEAM_ALIASES = {
  'bayern munich': ['bayern munchen', 'fc bayern'],
  'man city': ['manchester city'],
  'man utd': ['manchester united'],
  'man united': ['manchester united'],
  'inter milan': ['internazionale', 'inter'],
  'atletico madrid': ['atletico de madrid', 'club atletico de madrid'],
  'spurs': ['tottenham', 'tottenham hotspur'],
  'wolves': ['wolverhampton'],
  'psg': ['paris saint-germain', 'paris sg'],
  'leverkusen': ['bayer leverkusen', 'bayer 04 leverkusen'],
}

async function findTeamIdByName(teamName) {
  if (!teamName) return null
  const target = normalize(teamName)
  const responses = await getAllScorers()

  // Build search terms: original target + any known aliases
  const searchTerms = [target, ...(TEAM_ALIASES[target] || [])]

  // Pass 1: exact match on normalized full or short name
  for (const data of responses) {
    if (!data?.scorers) continue
    for (const scorer of data.scorers) {
      const t = scorer.team
      if (!t) continue
      const fullName = normalize(t.name)
      const shortName = normalize(t.shortName)
      if (searchTerms.some(term => fullName === term || shortName === term)) {
        return t.id
      }
    }
  }

  // Pass 2: word-based matching (all meaningful words from search must be in team name)
  for (const term of searchTerms) {
    const termWords = term.split(/\s+/).filter(w => w.length >= 4)
    if (termWords.length === 0) continue

    for (const data of responses) {
      if (!data?.scorers) continue
      for (const scorer of data.scorers) {
        const t = scorer.team
        if (!t) continue
        const combined = `${normalize(t.name)} ${normalize(t.shortName)}`
        if (termWords.every(w => combined.includes(w))) {
          return t.id
        }
      }
    }
  }

  return null
}

const teamMatchesCache = {}

app.get('/api/team/matches', async (req, res) => {
  const { name } = req.query
  if (!name) return res.json({ found: false })

  const cacheKey = name.toLowerCase().trim()
  if (teamMatchesCache[cacheKey]) {
    return res.json(teamMatchesCache[cacheKey])
  }

  try {
    const teamId = await findTeamIdByName(name)
    if (!teamId) {
      const result = { found: false, reason: 'team_not_found' }
      teamMatchesCache[cacheKey] = result
      return res.json(result)
    }

    const response = await fetch(
      `${FD_BASE}/teams/${teamId}/matches?status=FINISHED&limit=10`,
      { headers: { 'X-Auth-Token': FD_KEY } }
    )

    if (!response.ok) {
      return res.json({ found: false, reason: 'api_error' })
    }

    const data = await response.json()
    const matches = (data.matches || [])
      .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
      .slice(0, 5)
      .map(m => ({
        id: m.id,
        date: m.utcDate,
        competition: m.competition,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        score: m.score?.fullTime,
        winner: m.score?.winner,
      }))

    const result = { found: true, teamId, matches }
    teamMatchesCache[cacheKey] = result
    res.json(result)
  } catch (err) {
    console.log('Team matches error:', err)
    res.status(500).json({ error: 'Failed to fetch matches' })
  }
})

app.listen(3001, () => console.log('Server running on port 3001'))