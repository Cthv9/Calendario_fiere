import type { DaySelection, YearSettings } from '../data/models'
import { sumSelections } from '../logic/counting'

export default function Counters({ settings, selections }:{ settings: YearSettings, selections: DaySelection[] }){
  const ferieUsed = sumSelections(settings, selections, 'FERIE')
  const rolUsed = sumSelections(settings, selections, 'ROL')
  const ferieRem = settings.ferieTotal - ferieUsed
  const rolRem = settings.rolTotal - rolUsed

  return (
    <div className="card">
      <h3 style={{margin:'0 0 10px'}}>Contatori</h3>
      <div className="row">
        <span className="pill"><strong>Ferie</strong>&nbsp;Disp.: {settings.ferieTotal}</span>
        <span className="pill"><strong>Usate</strong>: {ferieUsed}</span>
        <span className="pill"><strong>Residue</strong>: <span style={{color: ferieRem < 0 ? 'var(--danger)' : 'var(--ok)'}}>{ferieRem}</span></span>
      </div>
      <div style={{height:10}} />
      <div className="row">
        <span className="pill"><strong>ROL</strong>&nbsp;Disp.: {settings.rolTotal}</span>
        <span className="pill"><strong>Usate</strong>: {rolUsed}</span>
        <span className="pill"><strong>Residue</strong>: <span style={{color: rolRem < 0 ? 'var(--danger)' : 'var(--ok)'}}>{rolRem}</span></span>
      </div>
      <div style={{height:12}} />
      <div className="muted small">Regola conteggio: {settings.countWeekends ? 'include weekend' : 'esclude weekend'} • {settings.countHolidays ? 'include festività' : 'esclude festività'}</div>
    </div>
  )
}
