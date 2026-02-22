export type EventType = 'FIERA' | 'INVENTARIO' | 'CHIUSURA' | 'ALTRO'

export type EventItem = {
  id: string
  year: number
  type: EventType
  title: string
  location?: string
  start: string // YYYY-MM-DD
  end: string   // YYYY-MM-DD (inclusive)
  note?: string
}

export type SelectionKind = 'FERIE' | 'ROL'

export type DaySelection = {
  year: number
  date: string // YYYY-MM-DD
  kind: SelectionKind
  amount: 1 | 0.5
}

export type YearSettings = {
  year: number
  ferieTotal: number
  rolTotal: number
  countWeekends: boolean
  countHolidays: boolean
}

export type BackupBlob = {
  version: number
  exportedAt: string
  settings: YearSettings[]
  events: EventItem[]
  selections: DaySelection[]
}
