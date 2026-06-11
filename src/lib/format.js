import { fromApiNeedTypes } from './needTypes'

const NEED_TYPE_ICONS = {
  Transport: 'directions_bus',
  Accommodation: 'hotel',
  'Food & Catering': 'restaurant',
  'Guide & Tour': 'hiking',
  Equipment: 'backpack',
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

function getApiOrigin() {
  return (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '')
}

/** Resolve a trip cover URL from API fields. Returns null when no image is set. */
export function resolveTripImageUrl(trip) {
  if (!trip || typeof trip === 'string') return null
  const raw = trip.image ?? trip.coverImage ?? trip.imageUrl ?? trip.photo
  if (!raw) return null
  if (typeof raw === 'object' && raw.url) {
    return String(raw.url)
  }
  const value = String(raw).trim()
  if (!value) return null
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value
  }
  const apiOrigin = getApiOrigin()
  return `${apiOrigin}${value.startsWith('/') ? value : `/${value}`}`
}

/** @deprecated Prefer TripCover component — returns URL or null (no stock fallback). */
export function getTripImage(trip) {
  return resolveTripImageUrl(trip)
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

export function formatBillingAddress(address) {
  if (!address) return null
  const parts = [address.line1, address.postalCode, address.city, address.country].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

export function countApprovedDocuments(documents = []) {
  return documents.filter((doc) => doc.status === 'approved').length
}

export function documentCategoryLabel(category) {
  const labels = {
    insurance: 'Insurance',
    registration: 'Registration',
    certification: 'Certification',
    other: 'Other',
  }
  return labels[category] || category || 'Document'
}

/** Adapts a backend Trip document to the shape TripListingCard expects. */
export function tripToCard(trip) {
  if (!trip) return null
  const id = trip._id || trip.id
  const tags = []
  if (trip.category) tags.push({ icon: 'category', label: trip.category })
  if (trip.location) tags.push({ icon: 'location_city', label: trip.location })
  if (typeof trip.joinedCount === 'number' && typeof trip.participants === 'number') {
    tags.push({ icon: 'group', label: `${trip.joinedCount}/${trip.participants} Joined` })
  } else if (typeof trip.participants === 'number') {
    tags.push({ icon: 'group', label: `${trip.participants} Participants` })
  }
  if (trip.entryFee != null) {
    tags.push({
      icon: 'payments',
      label: trip.entryFee > 0 ? formatPrice(trip.entryFee, trip.entryFeeCurrency || 'EUR') : 'Free',
    })
  }
  if (trip.tripNote) tags.push({ icon: 'info', label: trip.tripNote })
  if (trip.accessibility) tags.push({ icon: 'accessible', label: trip.accessibility })

  const organizerInitial = initialsFromName(trip.organizer?.name || '').slice(0, 1)

  return {
    id,
    title: trip.title,
    location: trip.location,
    status: trip.status,
    image: resolveTripImageUrl(trip),
    dates: formatDateRange(trip.startDate, trip.endDate),
    description: trip.description,
    tags,
    organizers: organizerInitial ? [organizerInitial] : [],
    needTypes: fromApiNeedTypes(trip.needTypes),
  }
}
