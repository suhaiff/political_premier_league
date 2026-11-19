import { getMatchFormatLabels, matchFormats, type DeliveryOutcome, type MatchConfiguration, type MatchFormatId } from "@/lib/ppl-data"

export const legalBallLimit = (configuration: MatchConfiguration) => configuration.oversPerInnings * configuration.ballsPerOver

export const isLegalDelivery = (outcome: DeliveryOutcome) => outcome !== "WIDE" && outcome !== "NO_BALL"

export function advanceLegalBallCount(currentLegalBalls: number, outcome: DeliveryOutcome, configuration: MatchConfiguration) {
  if (!isLegalDelivery(outcome)) return Math.max(0, Math.min(currentLegalBalls, legalBallLimit(configuration)))
  return Math.max(0, Math.min(currentLegalBalls + 1, legalBallLimit(configuration)))
}

export function hasInningsEnded(legalBalls: number, wickets: number, configuration: MatchConfiguration) {
  return legalBalls >= legalBallLimit(configuration) || wickets >= configuration.maximumWickets
}

export function canBowlerStartAnotherOver(oversAlreadyBowled: number, configuration: MatchConfiguration) {
  return oversAlreadyBowled < configuration.maximumBowlerOvers
}

export function isPowerplayBall(legalBalls: number, configuration: MatchConfiguration) {
  return legalBalls < configuration.powerplayOvers * configuration.ballsPerOver
}

export function validateMatchConfiguration(configuration: MatchConfiguration): string | null {
  if (!Number.isInteger(configuration.oversPerInnings) || configuration.oversPerInnings < 1 || configuration.oversPerInnings > 50) return "Overs per innings must be between 1 and 50."
  if (!Number.isInteger(configuration.ballsPerOver) || configuration.ballsPerOver < 1 || configuration.ballsPerOver > 12) return "Balls per over must be between 1 and 12."
  if (!Number.isInteger(configuration.maximumWickets) || configuration.maximumWickets < 1 || configuration.maximumWickets > 10) return "Maximum wickets must be between 1 and 10."
  if (!Number.isInteger(configuration.powerplayOvers) || configuration.powerplayOvers < 0 || configuration.powerplayOvers > configuration.oversPerInnings) return "Powerplay overs cannot exceed innings overs."
  if (!Number.isInteger(configuration.maximumBowlerOvers) || configuration.maximumBowlerOvers < 1 || configuration.maximumBowlerOvers > configuration.oversPerInnings) return "Bowler overs must be between 1 and the innings limit."
  if (!configuration.superOverAvailable && configuration.tieBreaker === "SUPER_OVER") return "Choose another tie-breaker when Super Over is disabled."
  return null
}

export function resolveMatchConfiguration(formatId: MatchFormatId, tournamentDefaults: MatchConfiguration, overrides: Partial<MatchConfiguration> = {}): MatchConfiguration {
  const preset = matchFormats[formatId]
  const base = formatId === tournamentDefaults.formatId ? tournamentDefaults : {
    ...preset,
    ballsPerOver: tournamentDefaults.ballsPerOver,
    maximumWickets: tournamentDefaults.maximumWickets,
    superOverAvailable: tournamentDefaults.superOverAvailable,
    tieBreaker: tournamentDefaults.tieBreaker,
  }
  const resolved = { ...base, ...overrides, formatId }
  return { ...resolved, ...getMatchFormatLabels(resolved.oversPerInnings) }
}
