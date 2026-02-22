import Dexie, { type Table } from 'dexie'
import type { DaySelection, EventItem, YearSettings } from './models'

class AppDB extends Dexie {
  settings!: Table<YearSettings, number>
  events!: Table<EventItem, string>
  selections!: Table<DaySelection, [number, string, string]>

  constructor(){
    super('schema-ferie-db')
    this.version(1).stores({
      settings: 'year',
      events: 'id, year, type, start, end',
      selections: '[year+date+kind], year, date, kind'
    })
  }
}

export const db = new AppDB()

export async function getOrCreateYearSettings(year: number): Promise<YearSettings>{
  const existing = await db.settings.get(year)
  if (existing) return existing
  const created: YearSettings = { year, ferieTotal: 0, rolTotal: 0, countWeekends: false, countHolidays: false }
  await db.settings.put(created)
  return created
}
