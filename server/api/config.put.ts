import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { requireAuth } from '../utils/auth'

const dataDir = process.env.DATA_DIR
  ?? resolve(process.cwd(), process.env.NODE_ENV === 'production' ? 'data' : 'server/data')

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  let existing: Record<string, unknown> = {}
  try {
    const content = await readFile(resolve(dataDir, 'config.json'), 'utf-8')
    existing = JSON.parse(content)
  } catch {}
  const updated = { ...existing, ...body }
  await mkdir(dataDir, { recursive: true })
  await writeFile(resolve(dataDir, 'config.json'), JSON.stringify(updated, null, 2), 'utf-8')
  return updated
})
