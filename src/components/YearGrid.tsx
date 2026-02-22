import type { DaySelection, EventItem, YearSettings } from '../data/models'
import { italianNationalHolidays } from '../logic/holidays'
import { isWeekendUTC, toDate, ymd } from '../logic/date'
import { eventsForDay, badgeForEventType } from '../logic/overlay'

type Props = {
  settings: YearSettings
  events: EventItem[]
  selections: DaySelection[]
  onToggle: (dateYMD: string) => void
}

const MONTHS_IT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']

function daysInMonth(year:number, month1:number){
  return new Date(Date.UTC(year, month1, 0)).getUTCDate()
}
function selectionFor(selections: DaySelection[], year:number, dateYMD:string){
  const ferie = selections.find(s => s.year===year && s.date===dateYMD && s.kind==='FERIE')
  const rol = selections.find(s => s.year===year && s.date===dateYMD && s.kind==='ROL')
  return { ferie, rol }
}

export default function YearGrid({ settings, events, selections, onToggle }: Props){
  const holidayMap = italianNationalHolidays(settings.year)

  return (
    <div className="yearWrap">
      <table className="year">
        <thead>
          <tr>
            <th>Giorno</th>
            {MONTHS_IT.map((m)=> <th key={m}>{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({length:31}).map((_, idx) => {
            const day = idx + 1
            return (
              <tr key={day}>
                <td>{day}</td>
                {Array.from({length:12}).map((__, mi) => {
                  const month1 = mi + 1
                  const dim = daysInMonth(settings.year, month1)
                  const valid = day <= dim
                  const dateY = valid ? ymd(settings.year, month1, day) : ''
                  const d = valid ? toDate(dateY) : null
                  const weekend = valid && d ? isWeekendUTC(d) : false
                  const holiday = valid && dateY ? holidayMap.has(dateY) : false
                  const dayEvents = valid ? eventsForDay(events, dateY) : []
                  const anyEvent = dayEvents.length > 0
                  const { ferie, rol } = valid ? selectionFor(selections, settings.year, dateY) : { ferie: undefined, rol: undefined }

                  let cls = 'dayCell'
                  if (!valid) cls += ' disabled'
                  else {
                    if (weekend) cls += ' bg-weekend'
                    if (holiday) cls += ' bg-holiday'
                    if (anyEvent) cls += ' bg-event'
                  }

                  const titleParts:string[] = []
                  if (valid && holiday) titleParts.push(`Festività: ${holidayMap.get(dateY)}`)
                  if (valid && dayEvents.length) titleParts.push(...dayEvents.map(e => `${e.type}: ${e.title}${e.location ? ' ('+e.location+')' : ''}`))
                  if (valid && ferie) titleParts.push(`Ferie: ${ferie.amount}`)
                  if (valid && rol) titleParts.push(`ROL: ${rol.amount}`)

                  return (
                    <td key={mi}>
                      <div className={cls} title={titleParts.join('\n')} onClick={() => { if (valid) onToggle(dateY) }}>
                        <div className="badges">
                          {dayEvents.slice(0,3).map(ev => <span key={ev.id} className="badge">{badgeForEventType(ev.type)}</span>)}
                          {dayEvents.length > 3 ? <span className="badge">+{dayEvents.length-3}</span> : null}
                        </div>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>
                          {ferie ? (
                            <span className={ferie.amount === 0.5 ? 'sel sub' : 'sel'}>{ferie.amount === 0.5 ? 'X½' : 'X'}</span>
                          ) : rol ? (
                            <span className={rol.amount === 0.5 ? 'sel sub' : 'sel'}>{rol.amount === 0.5 ? 'R½' : 'R'}</span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
