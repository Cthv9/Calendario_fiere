import { useEffect, useMemo, useState } from 'react'
import { db, getOrCreateYearSettings } from '../data/db'
import type { DaySelection, EventItem, YearSettings } from '../data/models'

export function useYear(year: number){
  const [settings, setSettings] = useState<YearSettings | null>(null)
  const [events, setEvents] = useState<EventItem[]>([])
  const [selections, setSelections] = useState<DaySelection[]>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const s = await getOrCreateYearSettings(year)
      const ev = await db.events.where('year').equals(year).toArray()
      const sel = await db.selections.where('year').equals(year).toArray()
      if (!alive) return
      setSettings(s); setEvents(ev); setSelections(sel)
    })()
    return () => { alive = false }
  }, [year])

  const api = useMemo(() => ({
    async saveSettings(next: YearSettings){ await db.settings.put(next); setSettings(next) },
    async refresh(){
      setEvents(await db.events.where('year').equals(year).toArray())
      setSelections(await db.selections.where('year').equals(year).toArray())
    },
    async upsertEvent(ev: EventItem){
      await db.events.put(ev)
      setEvents(await db.events.where('year').equals(year).toArray())
    },
    async deleteEvent(id: string){
      await db.events.delete(id)
      setEvents(await db.events.where('year').equals(year).toArray())
    },
    async upsertSelection(sel: DaySelection){
      await db.selections.put(sel)
      setSelections(await db.selections.where('year').equals(year).toArray())
    },
    async deleteSelection(year: number, date: string, kind: DaySelection['kind']){
      await db.selections.delete([year, date, kind])
      setSelections(await db.selections.where('year').equals(year).toArray())
    },
  }), [year])

  return { settings, events, selections, api }
}
