import { Resend } from 'resend'
import { readData, writeData } from '../../utils/db'
import { requireAuth } from '../../utils/auth'
import { emailTemplate, h1Italic, label, p, btn, callout } from '../../utils/email'

interface BlogPost {
  id: number
  date_iso: string
  date_en: string
  date_nl: string
  title_en: string
  title_nl: string
  summary_en: string
  summary_nl: string
  blocks: unknown[]
  content_en: string
  content_nl: string
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody(event)
  const posts = await readData<BlogPost>('blog')
  const newPost: BlogPost = {
    id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    date_iso: body.date_iso ?? '',
    date_en: body.date_en ?? '',
    date_nl: body.date_nl ?? '',
    title_en: body.title_en ?? '',
    title_nl: body.title_nl ?? '',
    summary_en: body.summary_en ?? '',
    summary_nl: body.summary_nl ?? '',
    blocks: body.blocks ?? [],
    likes: 0,
    content_en: '',
    content_nl: '',
  }
  posts.push(newPost)
  await writeData('blog', posts)

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (apiKey && audienceId && newPost.title_en) {
    const resend = new Resend(apiKey)
    const { data } = await resend.contacts.list({ audienceId })
    const active = (data?.data ?? []).filter(c => !c.unsubscribed)
    if (active.length) {
      const siteUrl = process.env.SITE_URL ?? 'https://nielsm.dev'
      const postUrl = `${siteUrl}/blog/${newPost.id}`
      await Promise.allSettled(active.map(contact => {
        const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${contact.id}`
        const html = emailTemplate({
          subject: `Nieuwe post: ${newPost.title_en}`,
          content: `
            ${label('Nieuwe blogpost')}
            ${h1Italic(newPost.title_en.split(' ').slice(0, -1).join(' ') || newPost.title_en, newPost.title_en.split(' ').slice(-1)[0] || '')}
            ${newPost.summary_en ? callout(newPost.summary_en) : ''}
            ${p(`Er is een nieuwe post verschenen op de blog van Niels Maes.`)}
            ${btn('Lees de post', postUrl)}
          `,
          footerLinks: [{ label: 'Uitschrijven', href: unsubscribeUrl }],
        })
        return resend.emails.send({
          from: process.env.CONTACT_FROM ?? 'no-reply@nielsm.dev',
          to: contact.email,
          subject: `Nieuwe post: ${newPost.title_en}`,
          html,
        })
      }))
    }
  }

  return newPost
})
