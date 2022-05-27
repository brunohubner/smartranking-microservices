import { MatchHistory } from "./match-history.interface"

export interface RankingResponse {
    player?: string
    position?: number
    score?: number
    matchHistory?: MatchHistory
}
