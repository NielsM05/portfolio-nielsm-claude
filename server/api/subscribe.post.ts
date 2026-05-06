import { Resend } from 'resend'
import { emailTemplate, h1Italic, p, btn, callout } from '../utils/email'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Ongeldig emailadres' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) throw createError({ statusCode: 500, message: 'Email service niet geconfigureerd' })

  const resend = new Resend(apiKey)

  const { data, error } = await resend.contacts.create({
    email: email.toLowerCase(),
    audienceId,
    unsubscribed: false,
  })

  if (error) {
    if ((error as any).statusCode === 409) return { ok: true }
    throw createError({ statusCode: 500, message: 'Inschrijven mislukt' })
  }

  const siteUrl = process.env.SITE_URL ?? 'https://nielsm.dev'
  const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${data!.id}`

  const html = emailTemplate({
    subject: 'Je bent ingeschreven',
    content: `
      ${h1Italic('Welkom', 'aan boord.')}
      ${p('Je bent ingeschreven op de blog van Niels Maes. Je ontvangt voortaan een mail wanneer er een nieuwe post verschijnt.')}
      ${callout('Je emailadres wordt uitsluitend bewaard bij <strong style="color:#f0f0f0;">Resend</strong> (SOC 2 gecertificeerd) en wordt nooit gedeeld met derden.')}
      ${btn('Bekijk de blog', `${siteUrl}/blog`)}
    `,
    footerLinks: [{ label: 'Uitschrijven', href: unsubscribeUrl }],
  })

  await resend.emails.send({
    from: process.env.CONTACT_FROM ?? 'no-reply@nielsm.dev',
    to: email,
    subject: 'Je bent ingeschreven op de blog van Niels Maes',
    html,
  })

  return { ok: true }
})
