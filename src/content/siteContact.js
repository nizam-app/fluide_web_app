/** Official Flunexia contact email */
export const CONTACT_EMAIL = 'contact@flunexia.fr'

/** One-click channels — update here if URLs change */
export const WHATSAPP_NUMBER = '+33766726271'
export const WHATSAPP_URL = 'https://wa.me/33766726271'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/flunexia'

export function getWhatsAppUrl(locale = 'en') {
  const text = locale === 'fr' ? 'Bonjour Flunexia' : 'Hello Flunexia'
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`
}

/** Footer contact line — English first, French when locale is fr */
export const FOOTER_CONTACT = {
  en: {
    sectionTitle: 'Contact',
    emailIntro: 'Partnerships, demos and institutional support.',
    hint: 'We typically respond within two business days.',
    emailClickHint: 'Click the email to open our contact page.',
    formLink: 'Send a message',
    whatsappLabel: 'Chat on WhatsApp',
    linkedinLabel: 'LinkedIn',
  },
  fr: {
    sectionTitle: 'Contact',
    emailIntro: 'Partenariats, démonstrations et accompagnement institutionnel.',
    hint: 'Réponse habituelle sous deux jours ouvrés.',
    emailClickHint: "Cliquez sur l'e-mail pour accéder à notre page contact.",
    formLink: 'Envoyer un message',
    whatsappLabel: 'Discuter sur WhatsApp',
    linkedinLabel: 'LinkedIn',
  },
}

/** Contact page sidebar — WhatsApp & LinkedIn cards */
export const CONTACT_CHANNELS = {
  en: {
    whatsappTitle: 'Chat on WhatsApp',
    whatsappSubtitle: 'Quick questions — we reply as soon as we can.',
    whatsappCta: 'Open WhatsApp',
    whatsappHint: 'Opens WhatsApp on your phone or desktop.',
    linkedinTitle: 'LinkedIn',
    linkedinSubtitle: 'Follow Flunexia and connect with our team.',
    linkedinCta: 'View on LinkedIn',
    linkedinHint: 'Opens our LinkedIn profile in a new tab.',
  },
  fr: {
    whatsappTitle: 'Discuter sur WhatsApp',
    whatsappSubtitle: 'Une question rapide — nous répondons dès que possible.',
    whatsappCta: 'Ouvrir WhatsApp',
    whatsappHint: 'Ouvre WhatsApp sur votre téléphone ou ordinateur.',
    linkedinTitle: 'LinkedIn',
    linkedinSubtitle: 'Suivez Flunexia et échangez avec notre équipe.',
    linkedinCta: 'Voir sur LinkedIn',
    linkedinHint: 'Ouvre notre profil LinkedIn dans un nouvel onglet.',
  },
}

/** Portal footer (organizer & supplier) — English copy per buyer request */
export const PORTAL_FOOTER = {
  supportHint: 'Support',
  emailIntro: 'Questions about your account or a trip?',
  legalAbout: 'About',
  legalPrivacy: 'Privacy',
  legalTerms: 'Terms',
}
