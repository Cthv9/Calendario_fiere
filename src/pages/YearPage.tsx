import { useMemo, useState } from 'react'
import { useYear } from '../hooks/useYear'
import YearGrid from '../components/YearGrid'
import Counters from '../components/Counters'
import Legend from '../components/Legend'
import type { DaySelection } from '../data/models'

function currentYear(){ return new Date().getFullYear() }

// Cycle: empty -> Ferie 1 -> Ferie 0.5 -> ROL 1 -> ROL 0.5 -> empty
function nextState(existingFerie?: DaySelection, existingRol?: DaySelection){
  if (!existingFerie && !existingRol) return { kind: 'FERIE' as const, amount: 1 as const }
  if (existingFerie?.amount === 1) return { kind: 'FERIE' as const, amount: 0.5 as const }
  if (existingFerie?.amount === 0.5) return { kind: 'ROL' as const, amount: 1 as const }
  if (existingRol?.amount === 1) return { kind: 'ROL' as const, amount: 0.5 as const }
  return null
}

export default function YearPage(){
  const [year, setYear] = useState<number>(currentYear())
  const { settings, events, selections, api } = useYear(year)

  const lookup = useMemo(() => {
    const map = new Map<string, {ferie?: DaySelection, rol?: DaySelection}>()
    for (const s of selections){
      const cur = map.get(s.date) ?? {}
      if (s.kind === 'FERIE') cur.ferie = s
      if (s.kind === 'ROL') cur.rol = s
      map.set(s.date, cur)
    }
    return map
  }, [selections])

  if (!settings) return <div className="card">Caricamento…</div>

  async function onToggle(dateYMD: string){
    const cur = lookup.get(dateYMD) ?? {}
    const next = nextState(cur.ferie, cur.rol)

    if (cur.ferie) await api.deleteSelection(settings.year, dateYMD, 'FERIE')
    if (cur.rol) await api.deleteSelection(settings.year, dateYMD, 'ROL')

    if (!next) return
    await api.upsertSelection({ year: settings.year, date: dateYMD, kind: next.kind, amount: next.amount })
  }

  return (
    <div className="grid2">
      <div className="card">
        <div className="row" style={{justifyContent:'space-between', marginBottom:10}}>
          <div>
            <h2 style={{margin:'0 0 4px'}}>Anno {settings.year}</h2>
            <div className="muted small">Griglia stile Excel • click per inserire Ferie/ROL (anche mezze giornate)</div>
          </div>
          <div className="row">
            <div className="field" style={{minWidth:140}}>
              <label>Anno</label>
              <input type="number" value={year} onChange={(e)=> setYear(Number(e.target.value))} />
            </div>
            <button className="primary" onClick={() => api.refresh()}>Aggiorna</button>
          </div>
        </div>

        <YearGrid settings={settings} events={events} selections={selections} onToggle={onToggle} />
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        <Counters settings={settings} selections={selections} />
        <Legend />
        <div className="card">
          <h3 style={{margin:'0 0 10px'}}>Note rapide</h3>
          <ul className="muted small" style={{margin:'0 0 0 18px'}}>
            <li>Eventi = overlay informativo (fiere, inventari, chiusure): non bloccano nulla.</li>
            <li>Trasferimento dati: Backup → Export/Import JSON.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
