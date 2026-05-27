const NEED_TYPE_ICONS = {
  Transport: 'directions_bus',
  Activity: 'hiking',
  Restaurant: 'restaurant',
  Hotel: 'hotel',
  'Other Service': 'business',
}

export function getNeedTypeIcon(needType) {
  return NEED_TYPE_ICONS[needType] || 'category'
}

export function formatDateRange(startDate, endDate) {
  if (!startDate) return '—'
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  const fmt = (d) =>
    d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

  if (!end || end.getTime() === start.getTime()) {
    return fmt(start)
  }
  return `${fmt(start)} → ${fmt(end)}`
}

export function formatDateShort(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(date) {
  if (!date) return '—'
  const d = new Date(date)
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString(
    undefined,
    { hour: '2-digit', minute: '2-digit' },
  )}`
}

export function formatPrice(amount, currency = 'EUR') {
  if (amount === undefined || amount === null) return '—'
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount} ${currency}`
  }
}

export function initialsFromName(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function getTripImage(trip) {
  if (!trip?.image) return 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=600&q=80'
  if (trip.image.startsWith('http')) return trip.image
  // local upload URL — prefix the API origin
  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '')
  return `${apiOrigin}${trip.image.startsWith('/') ? trip.image : `/${trip.image}`}`
}

export function getOrganizationLabel(user) {
  if (!user) return ''
  if (user.role === 'organizer' && user.organizationType) return user.organizationType
  if (user.role === 'provider' && user.providerType) return user.providerType
  return ''
}

export function statusLabel(status) {
  if (!status) return ''
  return status
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Adapts a backend Trip document to the shape TripListingCard expects. */
export function tripToCard(trip) {
  if (!trip) return null
  const id = trip._id || trip.id
  const tags = []
  if (trip.location) tags.push({ icon: 'location_city', label: trip.location })
  if (typeof trip.participants === 'number') tags.push({ icon: 'group', label: `${trip.participants} Participants` })
  if (trip.accessibility) tags.push({ icon: 'accessible', label: trip.accessibility })

  const organizerInitial = initialsFromName(trip.organizer?.name || '').slice(0, 1)

  return {
    id,
    title: trip.title,
    status: trip.status,
    image: getTripImage(trip),
    dates: formatDateRange(trip.startDate, trip.endDate),
    description: trip.description,
    tags,
    organizers: organizerInitial ? [organizerInitial] : [],
    needTypes: trip.needTypes || [],
  }
}
