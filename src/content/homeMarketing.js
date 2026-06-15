/** Buyer-approved home hero copy — brand split so spacing stays correct in EN/FR */
export const HOME_HERO = {
  en: {
    titleBefore: 'Save time on ',
    titleHighlight: 'group trip coordination',
    introBefore: 'With',
    introAfter:
      ', centralize transport, activities, and services in one place. Fewer emails, less complexity — more visibility and control.',
    ctaCreate: 'Create a trip',
    ctaDemo: 'Request a demo',
    services: { transport: 'Transport', activities: 'Activities', services: 'Services' },
  },
  fr: {
    titleBefore: 'Gagnez du temps sur ',
    titleHighlight: 'la coordination des voyages de groupe',
    introBefore: 'Avec',
    introAfter:
      ', centralisez les transports, les activités et les services en un seul endroit. Moins d’e-mails, moins de complexité : plus de visibilité et de contrôle.',
    ctaCreate: 'Créer un voyage',
    ctaDemo: 'Demander une démo',
    services: { transport: 'Transport', activities: 'Activités', services: 'Services' },
  },
}

/**
 * Home hero looping visual — storyboard slides (bus → hotel → restaurant → visit → app).
 * `src` paths live in /public/hero. Swap `HOME_HERO_VIDEO` in once the final MP4 loop exists.
 */
export const HOME_HERO_VIDEO = '' // e.g. '/hero/flunexia-loop.mp4' — when set, plays instead of slides

export const HOME_HERO_SLIDES = {
  en: [
    { src: '/hero/hero-bus.jpg', icon: 'directions_bus', label: 'Transport', alt: 'Travelers boarding a modern coach', caption: 'Organize your group travel with ease.' },
    { src: '/hero/hero-hotel.jpg', icon: 'hotel', label: 'Lodging', alt: 'A group arriving at a hotel', caption: 'Find the right accommodation in a few clicks.' },
    { src: '/hero/hero-restaurant.jpg', icon: 'restaurant', label: 'Dining', alt: 'A group sharing a meal at a restaurant', caption: 'Transport, lodging and dining — all in one place.' },
    { src: '/hero/hero-visit.jpg', icon: 'museum', label: 'Activities', alt: 'A guided tour in front of a monument', caption: 'Connect with trusted suppliers near you.' },
    { src: '/hero/hero-app.jpg', icon: 'smartphone', label: 'Anywhere', alt: 'A phone showing the Flunexia app', caption: 'Coordinate every trip from your phone.' },
  ],
  fr: [
    { src: '/hero/hero-bus.jpg', icon: 'directions_bus', label: 'Transport', alt: 'Un groupe montant dans un autocar moderne', caption: 'Organisez vos déplacements de groupe en toute simplicité.' },
    { src: '/hero/hero-hotel.jpg', icon: 'hotel', label: 'Hébergement', alt: 'Un groupe arrivant à un hôtel', caption: 'Trouvez l’hébergement idéal en quelques clics.' },
    { src: '/hero/hero-restaurant.jpg', icon: 'restaurant', label: 'Restauration', alt: 'Un groupe partageant un repas au restaurant', caption: 'Transport, hébergement et restauration — au même endroit.' },
    { src: '/hero/hero-visit.jpg', icon: 'museum', label: 'Activités', alt: 'Une visite guidée devant un monument', caption: 'Connectez-vous aux prestataires de confiance près de chez vous.' },
    { src: '/hero/hero-app.jpg', icon: 'smartphone', label: 'Partout', alt: 'Un téléphone affichant l’application Flunexia', caption: 'Coordonnez chaque voyage depuis votre téléphone.' },
  ],
}

/** Install app banner — brand split for translate-safe spacing */
export const INSTALL_APP = {
  en: {
    badge: 'Mobile app',
    titleBefore: 'Use',
    titleAfter: ' on your phone',
    description: 'Install the app in seconds — coordinate trips from anywhere.',
    installCta: 'Install app',
    installingCta: 'Installing…',
    openPhoneCta: 'Open on phone',
    orScan: 'or scan the QR code →',
    scanLabel: 'Scan to install',
    scanHint: 'Point your camera at the code',
    perks: [
      { icon: 'bolt', label: 'One-tap access from your home screen' },
      { icon: 'sync', label: 'Always on the latest version' },
    ],
    iosTitle: 'iPhone / iPad',
    iosStep1: 'Tap Share in Safari',
    iosStep2: 'Choose Add to Home Screen',
  },
  fr: {
    badge: 'Application mobile',
    titleBefore: 'Utilisez',
    titleAfter: ' sur votre téléphone',
    description:
      'Installez l’application en quelques secondes — coordonnez vos voyages où que vous soyez.',
    installCta: 'Installer l’application',
    installingCta: 'Installation…',
    openPhoneCta: 'Ouvrir sur téléphone',
    orScan: 'ou scannez le code QR →',
    scanLabel: 'Scanner pour installer',
    scanHint: 'Pointez votre appareil photo vers le code',
    perks: [
      { icon: 'bolt', label: 'Accès en un geste depuis l’écran d’accueil' },
      { icon: 'sync', label: 'Toujours sur la dernière version' },
    ],
    iosTitle: 'iPhone / iPad',
    iosStep1: 'Appuyez sur Partager dans Safari',
    iosStep2: 'Choisissez Sur l’écran d’accueil',
  },
}

export const FOOTER = {
  en: {
    tagline: 'Optimize your organization, our priority.',
    missionLead: 'First',
    missionRest:
      'B2B platform for group travel coordination – designed for municipalities, schools, and associations.',
    trustLine: 'Secure platform · GDPR-aware · Trusted suppliers',
    copyrightAfter: '. All rights reserved.',
    infoTitle: 'Information',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Impact Report', href: '/impact' },
    ],
  },
  fr: {
    tagline: 'Optimiser votre organisation, notre priorité.',
    missionLead: 'Première',
    missionRest:
      'plateforme B2B pour la coordination de voyages de groupe – conçue pour les municipalités, les écoles et les associations.',
    trustLine: 'Plateforme sécurisée · Conforme RGPD · Prestataires de confiance',
    copyrightAfter: '. Tous droits réservés.',
    infoTitle: 'Informations',
    links: [
      { label: 'À propos de nous', href: '/about' },
      { label: "Conditions d'utilisation", href: '/terms' },
      { label: 'Politique de confidentialité', href: '/privacy' },
      { label: "Rapport d'impact", href: '/impact' },
    ],
  },
}

/** Buyer-approved copy for the home “Three steps” section */
export const HOME_STEPS = {
  en: [
    {
      icon: 'add_circle',
      title: 'Create a trip',
      description: 'Set your departure: date, place, and needs.',
    },
    {
      icon: 'send',
      title: 'Get responses',
      description: 'Receive and compare offers in one place.',
    },
    {
      icon: 'check_circle',
      title: 'Confirm',
      description: 'Validate an offer and centralize all information.',
    },
  ],
  fr: [
    {
      icon: 'add_circle',
      title: 'Créer un voyage',
      description: 'Définissez votre sortie : date, lieu et besoins.',
    },
    {
      icon: 'send',
      title: 'Obtenir des réponses',
      description: 'Recevez et comparez les offres en un seul endroit.',
    },
    {
      icon: 'check_circle',
      title: 'Confirmer',
      description: 'Validez une offre et centralisez toutes les informations.',
    },
  ],
}

export const HOME_STEPS_SECTION = {
  en: {
    heading: 'Three steps',
    subheading: "From idea to booking, it's all very simple.",
  },
  fr: {
    heading: 'Trois étapes',
    subheading: "De l'idée à la réservation, en toute simplicité.",
  },
}
