export interface MoodBoardData {
  mood: string
  palette: [string, string, string, string]
  genre: string
  activity: string
  quote: string
}

export interface ImpactItem {
  score: number
  reason: string
}

export interface ImpactScoreData {
  commute: ImpactItem
  outdoor_dining: ImpactItem
  exercise: ImpactItem
  sleep: ImpactItem
  mood: ImpactItem
}
