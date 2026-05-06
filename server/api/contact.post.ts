import { Resend } from 'resend'
import { emailTemplate, h1Italic, label, p, divider, callout } from '../utils/email'

export default defineEventHandler(async (event) => {
  const { name, email, message } = await readBody(event)

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw createError({ statusCode: 400, message: 'Alle velden zijn verplicht' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Ongeldig emailadres' })
  }
  if (message.trim().length < 10) {
    throw createError({ statusCode: 400, message: 'Bericht is te kort' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw createError({ statusCode: 500, message: 'Email service niet geconfigureerd' })

  const resend = new Resend(apiKey)

  const html = emailTemplate({
    subject: `Nieuw bericht van ${name}`,
    content: `
      ${h1Italic('Nieuw', 'bericht.')}
      ${label('Via portfoliocontact')}
      ${divider()}
      ${label('Naam')}
      ${p(name)}
      ${label('Email')}
      ${p(`<a href="mailto:${email}" style="color:#c0392b;">${email}</a>`)}
      ${label('Bericht')}
      ${callout(message.replace(/\n/g, '<br>'))}
    `,
  })

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM ?? 'no-reply@nielsm.dev',
    to: process.env.CONTACT_TO ?? 'niels@nielsm.dev',
    replyTo: email,
    subject: `Nieuw bericht van ${name}`,
    html,
  })

  if (error) throw createError({ statusCode: 500, message: 'Versturen mislukt, probeer het opnieuw' })

  return { ok: true }
})
