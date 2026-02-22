export function pad2(n: number){ return String(n).padStart(2,'0') }

export function ymd(year:number, month1:number, day:number){
  return `${year}-${pad2(month1)}-${pad2(day)}`
}
export function parseYMD(s: string){
  const [y,m,d] = s.split('-').map(Number)
  return { y, m, d }
}
export function toDate(s: string){
  const {y,m,d} = parseYMD(s)
  return new Date(Date.UTC(y, m-1, d))
}
export function isWeekendUTC(d: Date){
  const wd = d.getUTCDay()
  return wd === 0 || wd === 6
}
export function addDaysUTC(d: Date, delta: number){
  const nd = new Date(d.getTime())
  nd.setUTCDate(nd.getUTCDate() + delta)
  return nd
}
