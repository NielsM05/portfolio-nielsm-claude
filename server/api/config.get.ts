import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dataDir = process.env.DATA_DIR
  ?? resolve(process.cwd(), process.env.NODE_ENV === 'production' ? 'data' : 'server/data')

const defaults = {
  cv_url: '',
  about_extra_en: '',
  about_extra_nl: '',
  experience: [] as {
    role_en: string; role_nl: string
    company: string; date_from: string; date_to: string; tag: string
    description_en: string; description_nl: string
  }[],
  giscus_enabled: false,
  giscus_repo: '',
  giscus_repo_id: '',
  giscus_category: '',
  giscus_category_id: '',
}

export default defineEventHandler(async () => {
  try {
    const content = await readFile(resolve(dataDir, 'config.json'), 'utf-8')
    return { ...defaults, ...JSON.parse(content) }
  } catch {
    return defaults
  }
})
