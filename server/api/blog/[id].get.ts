import { readData } from '../../utils/db'

interface BlogPost { id: number; [key: string]: unknown }

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const posts = await readData<BlogPost>('blog')
  const post = posts.find(p => p.id === id)
  if (!post) throw createError({ statusCode: 404, message: 'Post niet gevonden' })
  return post
})
