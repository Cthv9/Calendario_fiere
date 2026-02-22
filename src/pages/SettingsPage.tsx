import { useState } from 'react'
import { useYear } from '../hooks/useYear'

export default function SettingsPage(){
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const { settings, api } = useYear(year)

  if (!settings) return <div className="card">Caricamento…</div>

  return (
    <div className="card">
      <h2 style={{margin:'0 0 10px'}}>Impostazioni anno</h2>

      <div className="row" style={{marginBottom:12}}>
        <div className="field">
          <label>Anno</label>
          <input type="number" value={year} onChange={(e)=> setYear(Number(e.target.value))} />
        </div>
      </div>

      <div className="row" style={{marginBottom:12}}>
        <div className="field">
          <label>Ferie disponibili</label>
          <input type="number" value={settings.ferieTotal} onChange={(e)=> api.saveSettings({...settings, ferieTotal: Number(e.target.value)})} />
        </div>
        <div className="field">
          <label>ROL disponibili</label>
          <input type="number" value={settings.rolTotal} onChange={(e)=> api.saveSettings({...settings, rolTotal: Number(e.target.value)})} />
        </div>
      </div>

      <div className="row">
        <label className="pill" style={{cursor:'pointer'}}>
          <input type="checkbox" checked={settings.countWeekends} onChange={(e)=> api.saveSettings({...settings, countWeekends: e.target.checked})} style={{marginRight:8}} />
          Conta anche weekend
        </label>

        <label className="pill" style={{cursor:'pointer'}}>
          <input type="checkbox" checked={settings.countHolidays} onChange={(e)=> api.saveSettings({...settings, countHolidays: e.target.checked})} style={{marginRight:8}} />
          Conta anche festività nazionali
        </label>
      </div>

      <p className="muted small" style={{marginTop:12}}>
        Festività nazionali + Pasqua/Pasquetta vengono calcolate automaticamente.
      </p>
    </div>
  )
}
