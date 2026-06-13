/** Shared UI copy for marketing / info pages */

export const MARKETING_PAGE_UI = {
  en: {
    breadcrumbHome: 'Home',
    trustHeading: 'Built for institutions and trusted suppliers',
    trustItems: [
      { icon: 'account_balance', label: 'Municipalities' },
      { icon: 'school', label: 'Schools' },
      { icon: 'groups', label: 'Associations' },
      { icon: 'verified_user', label: 'Verified suppliers' },
    ],
    sidebarContact: 'Need help?',
    sidebarContactBody: 'Our team replies within two business days.',
    sidebarEmail: 'Write to us',
    documentLabel: 'Official information',
  },
  fr: {
    breadcrumbHome: 'Accueil',
    trustHeading: 'Conçu pour les institutions et les prestataires de confiance',
    trustItems: [
      { icon: 'account_balance', label: 'Collectivités' },
      { icon: 'school', label: 'Établissements scolaires' },
      { icon: 'groups', label: 'Associations' },
      { icon: 'verified_user', label: 'Prestataires vérifiés' },
    ],
    sidebarContact: 'Besoin d’aide ?',
    sidebarContactBody: 'Notre équipe répond sous deux jours ouvrés.',
    sidebarEmail: 'Nous écrire',
    documentLabel: 'Information officielle',
  },
}

export const CONTACT_PAGE_UI = {
  en: {
    badge: 'Support',
    title: 'Contact us',
    subtitle:
      'Organizer, supplier, or partner — tell us about your project. Flunexia will respond as soon as possible.',
    highlights: [
      { icon: 'schedule', title: 'Response time', text: 'Within 2 business days' },
      { icon: 'handshake', title: 'Partnerships', text: 'Territories, schools & associations' },
      { icon: 'support_agent', title: 'Dedicated support', text: 'Demo and onboarding available' },
    ],
    formTitle: 'Send a message',
    formSubtitle: 'All fields marked below are required for us to reply.',
    faqTitle: 'Frequently asked questions',
    loginHint: 'Already have an account? Log in',
  },
  fr: {
    badge: 'Assistance',
    title: 'Nous contacter',
    subtitle:
      'Organisateur, prestataire ou partenaire — décrivez votre besoin. Flunexia vous répond dans les meilleurs délais.',
    highlights: [
      { icon: 'schedule', title: 'Délai de réponse', text: 'Sous 2 jours ouvrés' },
      { icon: 'handshake', title: 'Partenariats', text: 'Territoires, écoles et associations' },
      { icon: 'support_agent', title: 'Accompagnement', text: 'Démo et mise en route disponibles' },
    ],
    formTitle: 'Envoyer un message',
    formSubtitle: 'Les champs ci-dessous nous permettent de vous répondre rapidement.',
    faqTitle: 'Questions fréquentes',
    loginHint: 'Vous avez déjà un compte ? Se connecter',
  },
}
