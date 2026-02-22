import { useMemo, useState } from 'react'
import { useYear } from '../hooks/useYear'
import type { EventItem, EventType } from '../data/models'

function uid(){
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

const TYPE_LABEL: Record<EventType,string> = {
  FIERA: 'Fiera',
  INVENTARIO: 'Inventario',
  CHIUSURA: 'Chiusura aziendale',
  ALTRO: 'Altro'
}

export default function EventsPage(){
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const { settings, events, api } = useYear(year)

  const [draft, setDraft] = useState<Omit<EventItem,'id'|'year'>>({
    type: 'FIERA',
    title: '',
    location: '',
    start: `${year}-01-01`,
    end: `${year}-01-01`,
    note: '',
  })

  const sorted = useMemo(() => [...events].sort((a,b)=> a.start.localeCompare(b.start)), [events])

  if (!settings) return <div className="card">Caricamento…</div>

  async function addEvent(){
    if (!draft.title.trim()) return alert('Inserisci un titolo')
    const ev: EventItem = { id: uid(), year: settings.year, ...draft }
    await api.upsertEvent(ev)
    setDraft({ ...draft, title:'', location:'', note:'' })
  }

  return (
    <div className="grid2">
      <div className="card">
        <h2 style={{margin:'0 0 10px'}}>Eventi — Anno {settings.year}</h2>

        <div className="row" style={{marginBottom:12}}>
          <div className="field">
            <label>Anno</label>
            <input type="number" value={year} onChange={(e)=> setYear(Number(e.target.value))} />
          </div>
          <button onClick={() => api.refresh()}>Aggiorna</button>
        </div>

        <div className="row" style={{marginBottom:12}}>
          <div className="field">
            <label>Tipo</label>
            <select value={draft.type} onChange={(e)=> setDraft({...draft, type: e.target.value as EventType})}>
              <option value="FIERA">Fiera</option>
              <option value="INVENTARIO">Inventario</option>
              <option value="CHIUSURA">Chiusura aziendale</option>
              <option value="ALTRO">Altro</option>
            </select>
          </div>
          <div className="field" style={{minWidth:240}}>
            <label>Titolo</label>
            <input value={draft.title} onChange={(e)=> setDraft({...draft, title: e.target.value})} placeholder="Es. Fiera Cannes" />
          </div>
          <div className="field">
            <label>Luogo (opz.)</label>
            <input value={draft.location ?? ''} onChange={(e)=> setDraft({...draft, location: e.target.value})} placeholder="Città" />
          </div>
        </div>

        <div className="row" style={{marginBottom:12}}>
          <div className="field">
            <label>Dal</label>
            <input type="date" value={draft.start} onChange={(e)=> setDraft({...draft, start: e.target.value})} />
          </div>
          <div className="field">
            <label>Al</label>
            <input type="date" value={draft.end} onChange={(e)=> setDraft({...draft, end: e.target.value})} />
          </div>
          <div className="field" style={{flex:'1 1 280px', minWidth:280}}>
            <label>Note (opz.)</label>
            <input value={draft.note ?? ''} onChange={(e)=> setDraft({...draft, note: e.target.value})} placeholder="Note" />
          </div>
          <button className="primary" onClick={addEvent}>Aggiungi</button>
        </div>

        <hr style={{border:'none', borderTop:'1px solid var(--border)', margin:'12px 0'}} />

        {sorted.length === 0 ? (
          <div className="muted">Nessun evento per questo anno.</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {sorted.map(ev => (
              <div key={ev.id} className="card" style={{padding:12, background:'#0b1226'}}>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <div>
                    <div style={{fontWeight:800}}>{TYPE_LABEL[ev.type]} — {ev.title}</div>
                    <div className="muted small">{ev.start} → {ev.end}{ev.location ? ` • ${ev.location}` : ''}</div>
                    {ev.note ? <div className="muted small" style={{marginTop:6}}>{ev.note}</div> : null}
                  </div>
                  <button className="danger" onClick={() => api.deleteEvent(ev.id)}>Elimina</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{margin:'0 0 10px'}}>Suggerimenti</h3>
        <ul className="muted small" style={{margin:'0 0 0 18px'}}>
          <li>Per fiere/inventari/chiusure usa un range (Dal/Al). Se dura 1 giorno: Dal = Al.</li>
          <li>In seguito possiamo aggiungere “duplica eventi dall’anno precedente”.</li>
        </ul>
      </div>
    </div>
  )
}
