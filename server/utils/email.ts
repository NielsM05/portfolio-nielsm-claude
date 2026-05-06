const BG      = '#0a0a0a'
const SURFACE = '#111111'
const BORDER  = '#1e1e1e'
const ACCENT  = '#c0392b'
const TEXT    = '#707070'
const WHITE   = '#f0f0f0'

const DISPLAY = "'Playfair Display', Georgia, serif"
const MONO    = "'JetBrains Mono', 'Courier New', monospace"
const BODY    = "'Syne', 'Helvetica Neue', Arial, sans-serif"

export function emailTemplate({ subject, content, footerLinks = [] }: {
  subject: string
  content: string
  footerLinks?: { label: string; href: string }[]
}): string {
  const footer = footerLinks.map(l =>
    `<a href="${l.href}" style="color:${ACCENT};text-decoration:none;font-family:${MONO};font-size:9px;letter-spacing:0.15em;text-transform:uppercase;">${l.label}</a>`
  ).join(`<span style="color:${BORDER};margin:0 12px;">|</span>`)

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>${subject}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=JetBrains+Mono:wght@400&family=Syne:wght@400&display=swap" rel="stylesheet">
  <style>
    body { margin:0; padding:0; background-color:${BG}; }
    a { color:${ACCENT}; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${BG};">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:${BG};">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

          <!-- NAV -->
          <tr>
            <td style="padding-bottom:28px;border-bottom:1px solid ${BORDER};">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <a href="https://nielsm.dev" style="text-decoration:none;">
                      <span style="font-family:${DISPLAY};font-size:20px;font-weight:900;color:${WHITE};letter-spacing:-0.02em;">Niels Maes</span>
                    </a>
                  </td>
                  <td align="right">
                    <span style="font-family:${MONO};font-size:8px;color:${ACCENT};letter-spacing:0.2em;text-transform:uppercase;">Cybersecurity</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:44px 0 36px 0;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding-top:24px;border-top:1px solid ${BORDER};">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <span style="font-family:${MONO};font-size:8px;color:${TEXT};letter-spacing:0.1em;">© ${new Date().getFullYear()} NIELSM.DEV — BRUGGE, BELGIË</span>
                  </td>
                  ${footer ? `<td align="right">${footer}</td>` : ''}
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function h1(text: string): string {
  return `<h1 style="margin:0 0 20px 0;font-family:${DISPLAY};font-size:40px;font-weight:900;color:${WHITE};line-height:0.95;letter-spacing:-0.02em;">${text}</h1>`
}

export function h1Italic(normal: string, italic: string): string {
  return `<h1 style="margin:0 0 20px 0;font-family:${DISPLAY};font-size:40px;font-weight:900;color:${WHITE};line-height:0.95;letter-spacing:-0.02em;">
    ${normal}<br><em style="color:${ACCENT};font-style:italic;">${italic}</em>
  </h1>`
}

export function p(text: string): string {
  return `<p style="margin:0 0 16px 0;font-family:${BODY};font-size:14px;line-height:1.8;color:${TEXT};">${text}</p>`
}

export function label(text: string): string {
  return `<p style="margin:0 0 16px 0;font-family:${MONO};font-size:9px;color:${ACCENT};letter-spacing:0.2em;text-transform:uppercase;">${text}</p>`
}

export function btn(text: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px;">
    <tr>
      <td style="background-color:${ACCENT};">
        <a href="${href}" style="display:inline-block;padding:14px 32px;font-family:${MONO};font-size:9px;font-weight:700;color:${WHITE};text-decoration:none;letter-spacing:0.15em;text-transform:uppercase;">${text} →</a>
      </td>
    </tr>
  </table>`
}

export function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${BORDER};margin:28px 0;">`
}

export function highlight(text: string): string {
  return `<span style="color:${WHITE};">${text}</span>`
}

export function callout(text: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;">
    <tr>
      <td style="background-color:${SURFACE};border-left:3px solid ${ACCENT};padding:16px 20px;">
        <p style="margin:0;font-family:${BODY};font-size:13px;line-height:1.7;color:${TEXT};">${text}</p>
      </td>
    </tr>
  </table>`
}
