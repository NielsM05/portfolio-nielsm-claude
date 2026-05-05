import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface BlogPost { id: number; [key: string]: unknown }

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const posts = await readData<BlogPost>('blog')
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) throw createError({ statusCode: 404, message: 'Post niet gevonden' })
  posts[idx] = { ...posts[idx], ...body, id }
  await writeData('blog', posts)
  return posts[idx]
})
