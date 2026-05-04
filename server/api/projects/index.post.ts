import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'

interface Collaborator { name: string; linkedinUrl: string }

interface Project {
  id: number
  category: string
  title: string
  description: string
  content: string
  externalLink: string
  photos: string[]
  collaborators: Collaborator[]
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const projects = await readData<Project>('projects')
  const newProject: Project = {
    id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    category: body.category ?? '',
    title: body.title ?? '',
    description: body.description ?? '',
    content: body.content ?? '',
    externalLink: body.externalLink ?? '',
    photos: body.photos ?? [],
    collaborators: body.collaborators ?? [],
  }
  projects.push(newProject)
  await writeData('projects', projects)
  return newProject
})
