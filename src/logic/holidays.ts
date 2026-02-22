import { addDaysUTC, ymd } from './date'

export function easterSundayUTC(year: number): Date{
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19*a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2*e + 2*i - h - k) % 7
  const m = Math.floor((a + 11*h + 22*l) / 451)
  const month = Math.floor((h + l - 7*m + 114) / 31)
  const day = ((h + l - 7*m + 114) % 31) + 1
  return new Date(Date.UTC(year, month-1, day))
}

export function italianNationalHolidays(year:number): Map<string,string>{
  const map = new Map<string,string>()
  const fixed: Array<[number,number,string]> = [
    [1,1,'Capodanno'], [1,6,'Epifania'], [4,25,'Liberazione'], [5,1,'Lavoro'],
    [6,2,'Repubblica'], [8,15,'Ferragosto'], [11,1,'Tutti i Santi'],
    [12,8,'Immacolata'], [12,25,'Natale'], [12,26,'S. Stefano'],
  ]
  for (const [m,d,label] of fixed) map.set(ymd(year,m,d), label)

  const easter = easterSundayUTC(year)
  map.set(ymd(year, easter.getUTCMonth()+1, easter.getUTCDate()), 'Pasqua')
  const easterMon = addDaysUTC(easter, 1)
  map.set(ymd(year, easterMon.getUTCMonth()+1, easterMon.getUTCDate()), 'Pasquetta')
  return map
}
