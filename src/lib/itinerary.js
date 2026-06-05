/** @typedef {'transfer' | 'stay'} ItineraryLegType */

/**
 * @typedef {Object} ItineraryLeg
 * @property {string} id
 * @property {ItineraryLegType} type
 * @property {string} [date] ISO date YYYY-MM-DD
 * @property {string} [time] HH:mm
 * @property {string} [pickup]
 * @property {string} [destination]
 * @property {string} [location]
 * @property {number | string} [durationDays]
 * @property {string} [detail]
 */

export const BOOKING_MODES = {
  MULTI: 'multi_provider',
  BUNDLED: 'bundled',
}

export const BOOKING_MODE_OPTIONS = [
  {
    value: BOOKING_MODES.MULTI,
    label: 'Multiple providers',
    description: 'Separate requests for transport, hotel, catering, etc.',
    icon: 'hub',
  },
  {
    value: BOOKING_MODES.BUNDLED,
    label: 'Full package (one provider)',
    description: 'Hotel or partner handles transport, stay, and transfers in one booking.',
    icon: 'hotel',
  },
]

let legCounter = 0

export function createLeg(type = 'transfer') {
  legCounter += 1
  return {
    id: `leg-${Date.now()}-${legCounter}`,
    type,
    date: '',
    time: '',
    pickup: '',
    destination: '',
    location: '',
    durationDays: '',
    detail: '',
  }
}

export function isLegFilled(leg) {
  if (!leg) return false
  if (leg.type === 'stay') {
    return Boolean(String(leg.location || '').trim())
  }
  return Boolean(String(leg.pickup || '').trim() || String(leg.destination || '').trim())
}

export function getFilledLegs(legs) {
  return (legs || []).filter(isLegFilled)
}

export function serializeLegsForApi(legs) {
  return getFilledLegs(legs).map((leg) => {
    if (leg.type === 'stay') {
      const duration = Number(leg.durationDays)
      return {
        type: 'stay',
        location: String(leg.location || '').trim(),
        durationDays: Number.isFinite(duration) && duration > 0 ? duration : undefined,
        detail: String(leg.detail || '').trim() || undefined,
      }
    }
    return {
      type: 'transfer',
      date: leg.date || undefined,
      time: leg.time || undefined,
      pickup: String(leg.pickup || '').trim(),
      destination: String(leg.destination || '').trim(),
    }
  })
}

/** Normalize API / legacy itinerary items into display legs. */
export function normalizeItinerary(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((item, idx) => {
    if (item.type === 'transfer' || item.type === 'stay') {
      return {
        id: item.id || `api-leg-${idx}`,
        type: item.type,
        date: item.date || '',
        time: item.time || '',
        pickup: item.pickup || '',
        destination: item.destination || '',
        location: item.location || '',
        durationDays: item.durationDays ?? '',
        detail: item.detail || '',
      }
    }
    const legacyType = item.type === 'pickup' ? 'transfer' : item.type === 'destination' ? 'transfer' : 'stay'
    return {
      id: `legacy-${idx}`,
      type: legacyType,
      date: '',
      time: '',
      pickup: item.type === 'pickup' ? item.detail || item.label || '' : item.label || '',
      destination: item.type === 'destination' ? item.detail || '' : '',
      location: item.type !== 'pickup' && item.type !== 'destination' ? item.detail || item.label || '' : item.detail || '',
      durationDays: '',
      detail: item.label || '',
    }
  })
}

export function formatLegDateTime(date, time, locale) {
  if (!date) return time || ''
  const parsed = new Date(`${date}T${time || '00:00'}`)
  if (Number.isNaN(parsed.getTime())) return [date, time].filter(Boolean).join(' ')
  const datePart = parsed.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  if (!time) return datePart
  const timePart = parsed.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return `${datePart} · ${timePart}`
}

export function formatItinerarySummary(legs, locale = undefined) {
  const filled = getFilledLegs(normalizeItinerary(legs))
  if (!filled.length) return ''
  return filled
    .map((leg) => {
      if (leg.type === 'stay') {
        const days = Number(leg.durationDays)
        const duration = Number.isFinite(days) && days > 0 ? `${days} day${days === 1 ? '' : 's'}` : ''
        return [duration && `${duration} at ${leg.location}`, leg.detail].filter(Boolean).join(' — ')
      }
      const when = formatLegDateTime(leg.date, leg.time, locale)
      const route = [leg.pickup, leg.destination].filter(Boolean).join(' → ')
      return [when, route].filter(Boolean).join(': ')
    })
    .join('\n')
}

export function bundledRequestMessage(trip) {
  const types = (trip.needTypes || []).join(', ')
  const summary = formatItinerarySummary(trip.itinerary)
  const lines = [
    'Full package request — one provider handles all services for this group booking.',
    types && `Services needed: ${types}.`,
    summary && `Itinerary:\n${summary}`,
  ].filter(Boolean)
  return lines.join('\n\n')
}
