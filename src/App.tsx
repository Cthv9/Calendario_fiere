import { NavLink, Route, Routes } from 'react-router-dom'
import YearPage from './pages/YearPage'
import SettingsPage from './pages/SettingsPage'
import EventsPage from './pages/EventsPage'
import BackupPage from './pages/BackupPage'

export default function App(){
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span style={{display:'inline-flex', width:10, height:10, borderRadius:999, background:'var(--accent)'}} />
          <span>Schema Ferie</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Anno</NavLink>
          <NavLink to="/eventi" className={({isActive}) => isActive ? 'active' : ''}>Eventi</NavLink>
          <NavLink to="/impostazioni" className={({isActive}) => isActive ? 'active' : ''}>Impostazioni</NavLink>
          <NavLink to="/backup" className={({isActive}) => isActive ? 'active' : ''}>Backup</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<YearPage />} />
          <Route path="/eventi" element={<EventsPage />} />
          <Route path="/impostazioni" element={<SettingsPage />} />
          <Route path="/backup" element={<BackupPage />} />
        </Routes>
      </main>
    </div>
  )
}
