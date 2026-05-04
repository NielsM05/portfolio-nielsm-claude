import { readData } from '../../utils/db'

interface Project { id: number; [key: string]: unknown }

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const projects = await readData<Project>('projects')
  const project = projects.find(p => p.id === id)
  if (!project) throw createError({ statusCode: 404, message: 'Project niet gevonden' })
  return project
})
