import { create } from "zustand"
import { resolveMatchConfiguration, validateMatchConfiguration } from "@/lib/match-rules"
import { candidates as initialCandidates, DEFAULT_MATCH_FORMAT, fixtures as initialFixtures, getMatchFormatLabels, matchFormats, matchRecords, teams as initialTeams, type Candidate, type Fixture, type MatchConfiguration, type MatchFormatId, type MatchState, type Team } from "@/lib/ppl-data"

type Bid = { candidate: string; team: string; amount: number; time: string }
type AppState = {
  teams: Team[]
  candidates: Candidate[]
  fixtures: Fixture[]
  tournamentConfig: MatchConfiguration
  matchFormatOverrides: Record<string, MatchFormatId>
  matchRuleOverrides: Record<string, Partial<MatchConfiguration>>
  matchStateOverrides: Record<string, MatchState>
  bidHistory: Bid[]
  activeCandidate: number
  currentBid: number
  highestTeam: number
  paused: boolean
  toast: string
  updateTeam: (id: number, patch: Partial<Team>) => void
  addTeam: (team: Team) => void
  addCandidate: (candidate: Candidate) => void
  updateCandidate: (id: number, patch: Partial<Candidate>) => void
  setTournamentFormat: (formatId: MatchFormatId) => void
  updateTournamentConfig: (patch: Partial<MatchConfiguration>) => void
  setFixtureFormat: (fixtureId: string, formatId: MatchFormatId | null) => void
  updateFixtureRules: (fixtureId: string, patch: Partial<MatchConfiguration>) => void
  addFixture: (fixture: Fixture, formatId?: MatchFormatId) => void
  startMatch: (fixtureId: string) => void
  bid: (teamId: number, increment: number) => void
  resolveAuction: (status: "Sold" | "Unsold", teamId?: number) => void
  setActiveCandidate: (id: number) => void
  togglePaused: () => void
  notify: (message: string) => void
  clearToast: () => void
}

export const usePplStore = create<AppState>((set, get) => ({
  teams: initialTeams.map((team) => ({ ...team })),
  candidates: initialCandidates.map((candidate) => ({ ...candidate })),
  fixtures: initialFixtures.map((fixture) => ({ ...fixture })),
  tournamentConfig: { ...matchFormats[DEFAULT_MATCH_FORMAT] },
  matchFormatOverrides: {},
  matchRuleOverrides: {},
  matchStateOverrides: {},
  bidHistory: [
    { candidate: "Mira Sen", team: "Coastal Royals", amount: 12.4, time: "14:32:08" },
    { candidate: "Arjun Mehta", team: "Northern Hawks", amount: 10.8, time: "14:28:41" },
    { candidate: "Kabir Rao", team: "Capital Chargers", amount: 9.6, time: "14:23:16" },
  ],
  activeCandidate: 4,
  currentBid: 2,
  highestTeam: 0,
  paused: false,
  toast: "",
  updateTeam: (id, patch) => set((state) => ({ teams: state.teams.map((team) => team.id === id ? { ...team, ...patch } : team) })),
  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  addCandidate: (candidate) => set((state) => ({ candidates: [...state.candidates, candidate] })),
  updateCandidate: (id, patch) => set((state) => ({ candidates: state.candidates.map((candidate) => candidate.id === id ? { ...candidate, ...patch } : candidate) })),
  setTournamentFormat: (formatId) => {
    const current = get().tournamentConfig
    const preset = matchFormats[formatId]
    set({ tournamentConfig: { ...preset, ballsPerOver: current.ballsPerOver, maximumWickets: current.maximumWickets, superOverAvailable: current.superOverAvailable, tieBreaker: current.tieBreaker }, toast: `Tournament default changed to ${preset.label}.` })
  },
  updateTournamentConfig: (patch) => {
    const current = get().tournamentConfig
    const merged = { ...current, ...patch }
    const normalized = patch.oversPerInnings === undefined ? merged : { ...merged, powerplayOvers: Math.min(merged.powerplayOvers, merged.oversPerInnings), maximumBowlerOvers: Math.min(merged.maximumBowlerOvers, merged.oversPerInnings) }
    const next = { ...normalized, ...getMatchFormatLabels(normalized.oversPerInnings) }
    const error = validateMatchConfiguration(next)
    if (error) return set({ toast: error })
    set({ tournamentConfig: next, toast: "Tournament match rules updated." })
  },

  setFixtureFormat: (fixtureId, formatId) => {
    const state = get()
    const fixture = state.fixtures.find((item) => item.id === fixtureId)
    const currentState = state.matchStateOverrides[fixtureId] ?? matchRecords[fixtureId]?.state ?? fixture?.status
    if (!fixture || currentState !== "UPCOMING") return set({ toast: "Match format is locked after match start." })
    const { [fixtureId]: _removedFormat, ...remainingFormats } = state.matchFormatOverrides
    const { [fixtureId]: _removedRules, ...remainingRules } = state.matchRuleOverrides
    if (!formatId) {
      set({ fixtures: state.fixtures.map((item) => item.id === fixtureId ? { ...item, formatId: undefined } : item), matchFormatOverrides: remainingFormats, matchRuleOverrides: remainingRules, toast: "Match now inherits the tournament default." })
      return
    }
    const configuration = resolveMatchConfiguration(formatId, state.tournamentConfig)
    set({ fixtures: state.fixtures.map((item) => item.id === fixtureId ? { ...item, formatId } : item), matchFormatOverrides: { ...remainingFormats, [fixtureId]: formatId }, matchRuleOverrides: { ...remainingRules, [fixtureId]: configuration }, toast: `${matchFormats[formatId].shortLabel} format selected for this match.` })
  },

  updateFixtureRules: (fixtureId, patch) => {
    const state = get()
    const fixture = state.fixtures.find((item) => item.id === fixtureId)
    const currentState = state.matchStateOverrides[fixtureId] ?? matchRecords[fixtureId]?.state ?? fixture?.status
    if (!fixture || currentState !== "UPCOMING") return set({ toast: "Match rules are locked after match start." })
    const formatId = state.matchFormatOverrides[fixtureId] ?? fixture.formatId ?? state.tournamentConfig.formatId
    const current = resolveMatchConfiguration(formatId, state.tournamentConfig, state.matchRuleOverrides[fixtureId])
    const merged = { ...current, ...patch }
    const normalized = patch.oversPerInnings === undefined ? merged : { ...merged, powerplayOvers: Math.min(merged.powerplayOvers, merged.oversPerInnings), maximumBowlerOvers: Math.min(merged.maximumBowlerOvers, merged.oversPerInnings) }
    const next = { ...normalized, ...getMatchFormatLabels(normalized.oversPerInnings) }
    const error = validateMatchConfiguration(next)
    if (error) return set({ toast: error })
    set({ matchRuleOverrides: { ...state.matchRuleOverrides, [fixtureId]: next }, toast: "Individual match rules updated." })
  },
  addFixture: (fixture, formatId) => {
    const state = get()
    if (fixture.home === fixture.away) return set({ toast: "Select two different teams for a fixture." })
    if (state.fixtures.some((item) => item.id === fixture.id)) return set({ toast: "Fixture ID already exists." })
    const newFixture = { ...fixture, ...(formatId ? { formatId } : {}) }
    const formatConfig = formatId ? resolveMatchConfiguration(formatId, state.tournamentConfig) : undefined
    set({ fixtures: [...state.fixtures, newFixture], ...(formatId && formatConfig ? { matchFormatOverrides: { ...state.matchFormatOverrides, [fixture.id]: formatId }, matchRuleOverrides: { ...state.matchRuleOverrides, [fixture.id]: formatConfig } } : {}), toast: `${matchFormats[formatId ?? state.tournamentConfig.formatId].shortLabel} fixture created.` })
  },
  startMatch: (fixtureId) => {
    const state = get()
    const fixture = state.fixtures.find((item) => item.id === fixtureId)
    const currentState = state.matchStateOverrides[fixtureId] ?? matchRecords[fixtureId]?.state ?? fixture?.status
    if (!fixture || currentState !== "UPCOMING") return set({ toast: "Only upcoming matches can be started." })
    const formatId = state.matchFormatOverrides[fixtureId] ?? fixture.formatId ?? state.tournamentConfig.formatId
    const configuration = resolveMatchConfiguration(formatId, state.tournamentConfig, state.matchRuleOverrides[fixtureId])
    set({ matchStateOverrides: { ...state.matchStateOverrides, [fixtureId]: "TOSS" }, matchFormatOverrides: { ...state.matchFormatOverrides, [fixtureId]: formatId }, matchRuleOverrides: { ...state.matchRuleOverrides, [fixtureId]: configuration }, toast: "Match moved to toss. Format and rules are now locked." })
  },
  bid: (teamId, increment) => {
    const state = get()
    const team = state.teams.find((item) => item.id === teamId)
    if (!team || team.purse < state.currentBid + increment) return set({ toast: "This franchise does not have enough purse remaining." })
    const candidate = state.candidates.find((item) => item.id === state.activeCandidate)
    const amount = Number((state.currentBid + increment).toFixed(1))
    set({ currentBid: amount, highestTeam: teamId, bidHistory: [{ candidate: candidate?.name ?? "Candidate", team: team.name, amount, time: "14:38:12" }, ...state.bidHistory], toast: `${team.name} bid ${`₹ ${amount.toFixed(1)}L`}` })
  },
  resolveAuction: (status, teamId) => {
    const state = get()
    const candidate = state.candidates.find((item) => item.id === state.activeCandidate)
    if (!candidate) return
    const selectedTeam = state.teams.find((team) => team.id === (teamId ?? state.highestTeam))
    const sold = status === "Sold" && selectedTeam
    set({
      candidates: state.candidates.map((item) => item.id === candidate.id ? { ...item, status, ...(sold ? { teamId: selectedTeam.id, price: state.currentBid } : {}) } : item),
      teams: sold ? state.teams.map((team) => team.id === selectedTeam.id ? { ...team, purse: Number((team.purse - state.currentBid).toFixed(1)) } : team) : state.teams,
      toast: sold ? `${candidate.name} sold to ${selectedTeam.name}` : `${candidate.name} marked unsold`,
      currentBid: 0,
      highestTeam: 0,
    })
  },
  setActiveCandidate: (id) => set({ activeCandidate: id, currentBid: get().candidates.find((candidate) => candidate.id === id)?.basePrice ?? 0, highestTeam: 0 }),
  togglePaused: () => set((state) => ({ paused: !state.paused, toast: state.paused ? "Auction resumed" : "Auction paused" })),
  notify: (message) => set({ toast: message }),
  clearToast: () => set({ toast: "" }),
}))
