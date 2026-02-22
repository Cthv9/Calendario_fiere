import { useState } from 'react'
import { db } from '../data/db'
import type { BackupBlob } from '../data/models'

export default function BackupPage(){
  const [status, setStatus] = useState<string>('')

  async function exportJSON(){
    const settings = await db.settings.toArray()
    const events = await db.events.toArray()
    const selections = await db.selections.toArray()
    const blob: BackupBlob = { version: 1, exportedAt: new Date().toISOString(), settings, events, selections }

    const data = new Blob([JSON.stringify(blob, null, 2)], {type:'application/json'})
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = `schema-ferie-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setStatus('Export completato.')
  }

  async function importJSON(file: File){
    const txt = await file.text()
    const parsed = JSON.parse(txt) as BackupBlob
    if (!parsed || parsed.version !== 1) throw new Error('Formato backup non riconosciuto')
    await db.transaction('rw', db.settings, db.events, db.selections, async () => {
      await db.settings.clear()
      await db.events.clear()
      await db.selections.clear()
      await db.settings.bulkPut(parsed.settings)
      await db.events.bulkPut(parsed.events)
      await db.selections.bulkPut(parsed.selections)
    })
    setStatus('Import completato. Ricarica la pagina per vedere i dati.')
  }

  async function wipeAll(){
    if (!confirm('Vuoi davvero cancellare TUTTI i dati locali?')) return
    await db.transaction('rw', db.settings, db.events, db.selections, async () => {
      await db.settings.clear()
      await db.events.clear()
      await db.selections.clear()
    })
    setStatus('Dati cancellati.')
  }

  return (
    <div className="card">
      <h2 style={{margin:'0 0 10px'}}>Backup</h2>
      <div className="row" style={{marginBottom:12}}>
        <button className="primary" onClick={exportJSON}>Export JSON</button>

        <label className="pill" style={{cursor:'pointer'}}>
          <input
            type="file"
            accept="application/json"
            style={{display:'none'}}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (!f) return
              importJSON(f).catch(err => setStatus(String(err?.message ?? err)))
            }}
          />
          Import JSON
        </label>

        <button className="danger" onClick={wipeAll}>Cancella dati locali</button>
      </div>

      {status ? <div className="muted small">{status}</div> : <div className="muted small">I dati sono salvati localmente (IndexedDB) sul dispositivo.</div>}
    </div>
  )
}
