/** Internal admin login only — not available on public registration */
export const DEMO_ADMIN_EMAIL = 'admin@flunexia.org'
export const DEMO_PASSWORD = 'demo123'

export const demoCredentials = [
  {
    role: 'admin',
    label: 'Admin',
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_PASSWORD,
    hint: 'Platform admin panel — not available on public signup',
  },
  {
    role: 'organizer',
    label: 'Organizer',
    email: 'organizer@flunexia.org',
    password: DEMO_PASSWORD,
    hint: 'Municipalities, associations, schools',
  },
  {
    role: 'provider',
    label: 'Supplier',
    email: 'supplier@flunexia.org',
    password: DEMO_PASSWORD,
    hint: 'Transport, activities, catering, hotels',
  },
]

export function isAdminEmail(email) {
  const normalized = email.trim().toLowerCase()
  return (
    normalized === DEMO_ADMIN_EMAIL ||
    normalized.endsWith('@flunexia.admin') ||
    normalized === 'admin@fluide.org'
  )
}

export const organizerNavItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Create Trip', icon: 'add_circle', href: '/create-trip' },
  { label: 'My Trips', icon: 'map', href: '/trips' },
  { label: 'Requests', icon: 'forum', href: '/requests' },
  { label: 'Profile', icon: 'person', href: '/profile' },
]

export const providerNavItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
  { label: 'Available Trips', icon: 'travel_explore', href: '/trips' },
  { label: 'Requests', icon: 'forum', href: '/requests' },
  { label: 'Profile', icon: 'person', href: '/profile' },
]

export const adminNavItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/admin' },
  { label: 'Users', icon: 'group', href: '/admin#users' },
  { label: 'Trips', icon: 'map', href: '/admin/trips' },
  { label: 'Requests', icon: 'forum', href: '/admin/requests' },
  { label: 'Profile', icon: 'settings', href: '/profile' },
]

export const NEED_TYPE_OPTIONS = [
  'Transport',
  'Accommodation',
  'Food & Catering',
  'Guide & Tour',
  'Equipment',
]

export const ORGANIZATION_TYPES = ['Municipality', 'Association', 'School', 'Local Institution']

export const PROVIDER_TYPES = [...NEED_TYPE_OPTIONS]

export function getNavItemsForRole(role) {
  if (role === 'admin') return adminNavItems
  if (role === 'provider') return providerNavItems
  return organizerNavItems
}

export const accountTypeOptions = [
  {
    value: 'organizer',
    label: 'Organizer',
    emoji: '🟦',
    shortLabel: 'Organize outings',
    description: 'Municipality, association, or school — plan trips and coordinate providers.',
    icon: 'groups',
    accent: 'info',
  },
  {
    value: 'provider',
    label: 'Supplier',
    emoji: '🟩',
    shortLabel: 'Respond to requests',
    description: 'Transport, activity, restaurant, hotel, or local service.',
    icon: 'storefront',
    accent: 'provider',
  },
]

export const homeValuePillars = [
  { icon: 'groups', title: 'Built for local group outings', description: 'School trips, club outings, and community events in one place.' },
  { icon: 'account_balance', title: 'Designed for municipalities, associations, and schools', description: 'A practical tool for teams who coordinate outings locally.' },
  { icon: 'hub', title: 'A simple way to centralize trip organization', description: 'Transport, activities, services, and provider requests — together.' },
]

export const providerDashboardStats = [
  { label: 'Available Requests', value: '8', trend: '3 new today', urgent: true, icon: 'inbox', iconBg: 'amberBg', iconColor: 'amberFg' },
  { label: 'Pending Responses', value: '14', trend: 'Awaiting organizer', icon: 'pending_actions', iconBg: 'infoBg', iconColor: 'infoFg' },
  { label: 'Accepted Offers', value: '42', trend: '+6 this month', trendUp: true, icon: 'check_circle', iconBg: 'secondaryContainer', iconColor: 'onSecondaryContainer' },
  { label: 'Completed Bookings', value: '128', trend: 'Year to date', icon: 'task_alt', iconBg: 'surfaceContainer', iconColor: 'onSurfaceVariant' },
]

export const trips = [
  {
    id: '1',
    title: 'Museum Day Trip',
    location: 'Lyon, France',
    dates: 'Oct 12, 2024',
    needType: 'Transport',
    participants: 24,
    status: 'scheduled',
    wide: true,
    image: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=600&q=80',
    description: 'Educational visit for 24 students to explore ancient civilizations and natural history exhibits.',
    tags: [{ icon: 'location_city', label: 'Metropolitan Area' }, { icon: 'group', label: '24 Participants' }, { icon: 'accessible', label: 'Accessibility' }],
    organizers: ['A', 'B', 'C'],
  },
  {
    id: '2',
    title: 'Senior Community Lunch',
    location: 'City Center',
    dates: 'Oct 15, 2024',
    needType: 'Food & Catering',
    participants: 18,
    status: 'in_progress',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    description: 'Group transport and catering coordination for the Golden Age Club monthly gathering.',
    tags: [{ icon: 'restaurant', label: 'Catering' }, { icon: 'group', label: '18 Participants' }],
    organizers: ['D', 'E'],
  },
  {
    id: '3',
    title: 'School Nature Visit',
    location: 'Green Valley Park',
    dates: 'Oct 20, 2024',
    needType: 'Guide & Tour',
    participants: 32,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    description: 'Outdoor learning experience with guided nature walks and environmental workshops.',
    tags: [{ icon: 'park', label: 'Outdoor' }, { icon: 'group', label: '32 Participants' }],
    organizers: ['F'],
  },
  {
    id: '4',
    title: 'Internal Workshop',
    location: 'HQ Building',
    dates: 'Oct 25, 2024',
    needType: 'Equipment',
    participants: 12,
    status: 'scheduled',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
    description: 'Team-building workshop with facility booking and lunch service.',
    tags: [{ icon: 'business', label: 'Corporate' }, { icon: 'group', label: '12 Participants' }],
    organizers: ['G', 'H'],
  },
]

export const dashboardStats = [
  { label: 'Created Trips', value: '124', trend: '+12% from last month', trendUp: true, icon: 'map', iconBg: 'infoBg', iconColor: 'infoFg' },
  { label: 'Pending Requests', value: '18', trend: '4 urgent actions', trendUp: false, urgent: true, icon: 'pending_actions', iconBg: 'errorContainer', iconColor: 'error' },
  { label: 'Accepted Requests', value: '86', trend: 'Ready to schedule', icon: 'verified', iconBg: 'secondaryContainer', iconColor: 'onSecondaryContainer' },
  { label: 'Completed Requests', value: '412', trend: 'Year to date', icon: 'task_alt', iconBg: 'infoBg', iconColor: 'infoFg' },
]

export const adminStats = [
  { label: 'Total Users', value: '12,482', trend: '8.5% increase', trendUp: true, icon: 'group', iconBg: 'infoBg', iconColor: 'infoFg' },
  { label: 'Total Trips', value: '843', trend: '12.3% vs last month', trendUp: true, icon: 'map', iconBg: 'secondaryContainer', iconColor: 'onSecondaryContainer' },
  { label: 'Total Requests', value: '1,204', trend: '56 pending', urgent: true, icon: 'forum', iconBg: 'infoBg', iconColor: 'infoFg' },
  { label: 'Active Providers', value: '128', trend: '2 awaiting verification', icon: 'storefront', iconBg: 'surfaceContainer', iconColor: 'onSurfaceVariant' },
]

export const requestStats = [
  { label: 'Incoming', value: '12' },
  { label: 'Approved', value: '48', color: 'primary' },
  { label: 'Waiting Action', value: '3', color: 'error' },
  { label: 'Efficiency', value: '94%', icon: 'trending_up' },
]

export const portalRequests = [
  { id: '1', name: 'John Doe', detail: '2 seats - City Center', status: 'pending', initials: 'JD' },
  { id: '2', name: 'Maria Silva', detail: 'Bus rental - Museum', status: 'accepted', initials: 'MS' },
  { id: '3', name: 'Kevin Lee', detail: 'Catering - 45 pax', status: 'rejected', initials: 'KL' },
  { id: '4', name: 'Anna Park', detail: 'Guide service', status: 'completed', initials: 'AP' },
]

export const recentTripsDashboard = [
  { id: '1', title: 'Museum Day Trip', date: 'Oct 12, 2024 • 09:00', status: 'active', image: trips[0].image, avatars: 3 },
  { id: '2', title: 'Senior Community Lunch', date: 'Oct 15, 2024 • 11:30', status: 'scheduled', image: trips[1].image, avatars: 2 },
  { id: '3', title: 'Nature Visit', date: 'Oct 20, 2024 • 08:00', status: 'scheduled', image: trips[2].image, avatars: 4 },
]

export const serviceRequests = [
  { id: '1', trip: 'Museum Day Trip', organizer: "St. Jude's Primary", orgType: 'School', provider: 'GreenBus', needType: 'Transport', needIcon: 'directions_bus', date: 'Oct 12, 2024', status: 'pending', image: trips[0].image, participants: 24 },
  { id: '2', trip: 'Senior Community Lunch', organizer: 'Golden Age Club', orgType: 'Association', provider: 'City Catering Co.', needType: 'Food & Catering', needIcon: 'restaurant', date: 'Oct 15, 2024', status: 'accepted', image: trips[1].image, participants: 18 },
  { id: '3', trip: 'School Nature Visit', organizer: 'Green Valley High', orgType: 'School', provider: 'EcoTransit', needType: 'Guide & Tour', needIcon: 'hiking', date: 'Oct 20, 2024', status: 'completed', image: trips[2].image, participants: 32 },
  { id: '4', trip: 'Internal Workshop', organizer: 'HR Department', orgType: 'Local Institution', provider: 'Metro Facilities', needType: 'Equipment', needIcon: 'backpack', date: 'Oct 25, 2024', status: 'rejected', image: trips[3].image, participants: 12 },
]

export const adminUsers = [
  { id: '1', name: 'Jane Doe', email: 'jane@city.gov', type: 'Admin', status: 'active', initials: 'JD' },
  { id: '2', name: 'Mark Smith', email: 'mark@transport.fr', type: 'Provider', status: 'active', initials: 'MS' },
  { id: '3', name: 'Lisa Chen', email: 'lisa@school.edu', type: 'Manager', status: 'pending', initials: 'LC' },
  { id: '4', name: 'Tom Wilson', email: 'tom@asso.org', type: 'Provider', status: 'active', initials: 'TW' },
]

export const tripsQueue = [
  { title: 'Museum Day Trip', location: 'Lyon, France', date: 'Oct 12', status: 'scheduled' },
  { title: 'Community Lunch', location: 'City Center', date: 'Oct 15', status: 'in_progress' },
  { title: 'Nature Visit', location: 'Green Valley', date: 'Oct 20', status: 'scheduled' },
]

export const adminRecentRequests = [
  { title: 'New Vehicle Audit', from: 'Metro Transit', status: 'new', icon: 'error', iconColor: 'error' },
  { title: 'Contract Renewal', from: 'GreenBus', status: 'processed', icon: 'check_circle', iconColor: 'primary' },
]

export const tripDetails = {
  '1': {
    id: '1',
    title: 'Museum Day Trip',
    ref: 'FL-2904',
    location: 'Lyon, France',
    dates: 'Oct 24, 2024',
    status: 'active',
    image: trips[0].image,
    description:
      'A curated educational outing for students exploring ancient civilizations, natural history exhibits, and an interactive science wing. Includes guided tours and lunch coordination.',
    participants: 24,
    needType: 'Private Bus',
    accessibility: 'High',
    duration: '6h',
    organizer: { name: 'Marie Laurent', role: 'Lead Organizer' },
    offers: [
      { provider: 'GreenBus', description: 'Full-size coach, AC, driver included', price: '€450.00', icon: 'directions_bus' },
      { provider: 'EcoTransit', description: 'Hybrid minibus for 30 seats', price: '€380.00', icon: 'electric_car' },
    ],
    itinerary: [
      { label: 'Pickup Point', detail: 'School Main Gate', type: 'pickup' },
      { label: 'Destination', detail: 'National History Museum', type: 'destination' },
    ],
    timeline: [
      { label: 'Request Created', done: true },
      { label: 'Validated', done: true },
      { label: 'Collecting Quotes', current: true },
      { label: 'Final Confirmation', done: false },
    ],
  },
}

/** Short FAQ for contact page */
export const contactFaqItems = [
  {
    question: 'Who can use Flunexia?',
    answer: 'Organizers plan outings. Suppliers respond with transport, activities, or services.',
  },
  {
    question: 'How do I start?',
    answer: 'Sign up, create a trip, or send us a message — we will guide you from there.',
  },
  {
    question: 'Is payment included?',
    answer: 'No. Flunexia centralizes coordination; payment stays between organizer and supplier.',
  },
]

export const featureCards = [
  { icon: 'directions_bus', title: 'Transport', description: 'Coaches, shuttles, local transport.' },
  { icon: 'hiking', title: 'Activities', description: 'Guides, venues, outdoor programs.' },
  { icon: 'storefront', title: 'Services', description: 'Restaurants, hotels, local partners.' },
]

export const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCVxQZdLwhNILoClqEY-t0y3sJhcy7hklqYkJswQNwNqMF880CTO7OBVfGcfijdHrekciYYO7WBm4p-tIiYeyecHNLJNRABBx9MnAoxSr9KzLNNgxZoy9uPbE7FpS9GmD3jx9afspaOg6XP48V1TdWrobtFfsfAbnrJ1PP_8NuK37-7RoYPrvjAvJfFa96XVesABYEk_MlrTtZDstExYyp1qN7BiVDE_chZ-Wtd_ACL0dk7GPhM45x0hBY_3cDwMjXVwioov_GWZW8h'

export const AUTH_BG_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBrKspASPZl-3MkGYfvNbYNWdZb9Rd7HDUronSncp8FHHoNEuyQqz91Gyfww_oyK_YmMJMjAtBwCjVoJ4fNXH4epV1i-mi6LDDDeX9rgNvDXHsvHB2gz4zNVDUkI2K19ATtM1teAQdVaao4irJJT6Gt6Om99rmhPz1w7kmsmmbXUnq6Hq_xVbW_NScBSYe9FhJT_nPSQPtzkywbsfNIm_usk9dqomgWD4RFffNotBtjrrVYIcWmGRjeUBLwYcv9bJZtZ2eBLG_xoF5S'

export const TRIP_HERO_IMAGE = trips[0].image
