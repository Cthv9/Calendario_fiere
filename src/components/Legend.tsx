export default function Legend(){
  return (
    <div className="card">
      <h3 style={{margin:'0 0 10px'}}>Legenda</h3>
      <div className="legend">
        <span className="pill">Click: Vuoto → Ferie 1 → Ferie 0.5 → ROL 1 → ROL 0.5 → Vuoto</span>
        <span className="pill"><strong>X</strong> Ferie</span>
        <span className="pill"><strong>R</strong> ROL</span>
        <span className="pill"><strong>½</strong> Mezza giornata</span>
        <span className="pill"><strong>F</strong> Fiera</span>
        <span className="pill"><strong>I</strong> Inventario</span>
        <span className="pill"><strong>A</strong> Chiusura/azienda</span>
      </div>
      <p className="muted small" style={{margin:'10px 0 0'}}>Gli eventi sono solo informativi: non bloccano l’inserimento di Ferie/ROL.</p>
    </div>
  )
}
