import type { DaySelection, YearSettings } from '../data/models'
import { isWeekendUTC, toDate } from './date'
import { italianNationalHolidays } from './holidays'

export function isCountableDay(settings: YearSettings, dateYMD: string){
  const holidayMap = italianNationalHolidays(settings.year)
  const d = toDate(dateYMD)
  if (!settings.countWeekends && isWeekendUTC(d)) return false
  if (!settings.countHolidays && holidayMap.has(dateYMD)) return false
  return true
}

export function sumSelections(settings: YearSettings, selections: DaySelection[], kind: 'FERIE' | 'ROL'){
  let total = 0
  for (const s of selections){
    if (s.kind !== kind) continue
    if (isCountableDay(settings, s.date)) total += s.amount
  }
  return total
}
