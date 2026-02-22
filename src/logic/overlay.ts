import type { EventItem } from '../data/models'
import { toDate } from './date'

export function eventsForDay(events: EventItem[], dateYMD: string){
  const d = toDate(dateYMD).getTime()
  return events.filter(ev => {
    const a = toDate(ev.start).getTime()
    const b = toDate(ev.end).getTime()
    return d >= a && d <= b
  })
}

export function badgeForEventType(type: EventItem['type']){
  switch(type){
    case 'FIERA': return 'F'
    case 'INVENTARIO': return 'I'
    case 'CHIUSURA': return 'A'
    default: return '•'
  }
}
