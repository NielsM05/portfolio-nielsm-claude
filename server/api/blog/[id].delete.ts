import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface BlogPost { id: number; [key: string]: unknown }

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const posts = await readData<BlogPost>('blog')
  const filtered = posts.filter(p => p.id !== id)
  if (filtered.length === posts.length) throw createError({ statusCode: 404, message: 'Post niet gevonden' })
  await writeData('blog', filtered)
  return { ok: true }
})
