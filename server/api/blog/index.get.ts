import { readData } from '../../utils/db'

interface BlogPost { id: number; date_iso?: string; [key: string]: unknown }

export default defineEventHandler(async () => {
  const posts = await readData<BlogPost>('blog')
  return posts.sort((a, b) => (b.date_iso ?? '').localeCompare(a.date_iso ?? ''))
})
