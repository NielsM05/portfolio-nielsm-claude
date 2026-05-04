type Locale = 'en' | 'nl'

const translations = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      events: 'Events',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Cybersecurity Specialist — Available for work',
      line1: 'I KEEP',
      line2: 'ATTACKERS',
      line3: 'OUT.',
      sub: 'Penetration tester, security architect and ethical hacker. I find the weaknesses before the attackers do.',
      btn1: 'My work',
      btn2: 'Get in touch',
    },
    chapters: ['Identification', 'Proof of work', 'Capabilities', 'Activity', 'Connection'],
    about: {
      intro: 'I am <em>Niels Maes</em> — a cybersecurity specialist who believes the best defense starts with thinking like an attacker.',
      p1: 'With years of experience in both offensive and defensive security, I help companies, governments, and individuals make their digital environment demonstrably safer. No generic advice — concrete findings, clear reports, and actionable solutions.',
      p2: 'My specialty lies in web applications, network security, and social engineering assessments. I think like an attacker, but work as a trusted advisor.',
    },
    skills: {
      sub: 'A combination of offensive and defensive techniques — built through years of hands-on experience and continuous learning.',
      groups: ['Offensive', 'Defensive', 'Tools', 'Code'],
    },
    events: {
      eyebrow: 'Blog & Events',
      title: 'What I',
      titleEm: 'share',
      sub: 'Talks, workshops, and insights — also available via',
      linkedin: 'View on LinkedIn →',
    },
    contact: {
      big: 'Ready to<br>work <em>together?</em>',
      p1: 'Whether you need a pentest, are looking for advice on your security architecture, or just have a question — I respond within 24 hours.',
      p2: 'Based in Bruges, available remote and on-site.',
      labelName: 'Name',
      labelEmail: 'Email',
      labelMessage: 'Message',
      placeholderName: 'Your name',
      placeholderMessage: 'Tell me how I can help...',
      submit: 'Send message →',
    },
    footer: {
      location: '© {{ year }} — BRUGES, BELGIUM',
    },
    project: {
      back: '← Back to portfolio',
      collaborators: 'Collaborators',
      photos: 'Photos',
      details: 'Details',
      viewProject: 'View project →',
      readMore: 'Read more →',
    },
  },
  nl: {
    nav: {
      about: 'Over',
      projects: 'Projecten',
      skills: 'Skills',
      events: 'Events',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Cybersecurity Specialist — Beschikbaar voor werk',
      line1: 'IK HOUD',
      line2: 'AANVALLERS',
      line3: 'BUITEN.',
      sub: 'Penetration tester, security architect en ethisch hacker. Ik vind de zwakheden voordat de aanvallers dat doen.',
      btn1: 'Mijn werk',
      btn2: 'Neem contact op',
    },
    chapters: ['Identificatie', 'Bewijs van werk', 'Capaciteiten', 'Activiteit', 'Verbinding'],
    about: {
      intro: 'Ik ben <em>Niels Maes</em> — een cybersecurity specialist die gelooft dat de beste verdediging begint met denken als een aanvaller.',
      p1: 'Met jaren ervaring in zowel offensieve als defensieve security help ik bedrijven, overheden en individuen hun digitale omgeving aantoonbaar veiliger te maken. Geen generieke adviezen — concrete bevindingen, duidelijke rapportages en haalbare oplossingen.',
      p2: 'Mijn specialiteit ligt in webapplicaties, netwerksecurity en social engineering assessments. Ik denk als een aanvaller, maar werk als een trusted advisor.',
    },
    skills: {
      sub: 'Een combinatie van offensieve en defensieve technieken — opgebouwd door jarenlange praktijkervaring en continue bijscholing.',
      groups: ['Offensief', 'Defensief', 'Tools', 'Code'],
    },
    events: {
      eyebrow: 'Blog & Events',
      title: 'Wat ik',
      titleEm: 'deel',
      sub: 'Spreekbeurten, workshops en inzichten — ook te volgen via',
      linkedin: 'Bekijk op LinkedIn →',
    },
    contact: {
      big: 'Klaar om<br>samen te <em>werken?</em>',
      p1: 'Of je nu een pentest nodig hebt, advies zoekt over je security-architectuur, of gewoon een vraag hebt — ik reageer binnen 24 uur.',
      p2: 'Gebaseerd in Brugge, beschikbaar remote en on-site.',
      labelName: 'Naam',
      labelEmail: 'Email',
      labelMessage: 'Bericht',
      placeholderName: 'Jouw naam',
      placeholderMessage: 'Vertel me hoe ik kan helpen...',
      submit: 'Verstuur bericht →',
    },
    footer: {
      location: '© {{ year }} — BRUGGE, BELGIË',
    },
    project: {
      back: '← Terug naar portfolio',
      collaborators: 'Medewerkers',
      photos: "Foto's",
      details: 'Details',
      viewProject: 'Bekijk project →',
      readMore: 'Lees meer →',
    },
  },
}

export function useLocale() {
  const locale = useState<Locale>('locale', () => 'en')
  const t = computed(() => translations[locale.value])
  function toggle() {
    locale.value = locale.value === 'en' ? 'nl' : 'en'
  }
  return { locale, t, toggle }
}
