import { readData } from '../../utils/db'

interface Event { id: number; date_iso?: string; [key: string]: unknown }

export default defineEventHandler(async () => {
  const events = await readData<Event>('events')
  return events.sort((a, b) => (b.date_iso ?? '').localeCompare(a.date_iso ?? ''))
})
