import { formatPrice } from './format'

const MS_DAY = 86_400_000
const URGENT_WINDOW_DAYS = 14
const UPCOMING_WINDOW_DAYS = 60

function requestId(request) {
  return String(request?._id || request?.id || '')
}

function tripStartMs(trip) {
  if (!trip?.startDate) return null
  const ms = new Date(trip.startDate).getTime()
  return Number.isFinite(ms) ? ms : null
}

function offerRequestId(offer) {
  return String(offer?.request?._id || offer?.request?.id || offer?.request || '')
}

export function computeProviderKpis({ requests = [], offers = [], unreadCount = 0 } = {}) {
  const now = Date.now()
  const activeOffers = offers.filter((o) => o.status !== 'withdrawn')
  const decidedOffers = activeOffers.filter((o) => o.status === 'accepted' || o.status === 'rejected')
  const acceptedOffers = activeOffers.filter((o) => o.status === 'accepted')

  const acceptanceRate =
    decidedOffers.length > 0
      ? Math.round((acceptedOffers.length / decidedOffers.length) * 100)
      : null

  const revenueByCurrency = acceptedOffers.reduce((acc, offer) => {
    const code = (offer.currency || 'EUR').toUpperCase()
    acc[code] = (acc[code] || 0) + Number(offer.price || 0)
    return acc
  }, {})
  const revenueEntries = Object.entries(revenueByCurrency)
  const revenueDisplay =
    revenueEntries.length === 0
      ? '—'
      : revenueEntries.length === 1
        ? formatPrice(revenueEntries[0][1], revenueEntries[0][0])
        : revenueEntries.map(([code, amount]) => formatPrice(amount, code)).join(' · ')

  const quotedRequestIds = new Set(activeOffers.map(offerRequestId).filter(Boolean))

  const urgentRequests = requests.filter((req) => {
    if (req.status !== 'pending') return false
    const start = tripStartMs(req.trip)
    const startsSoon = start != null && start >= now && start - now <= URGENT_WINDOW_DAYS * MS_DAY
    const awaitingQuote = !quotedRequestIds.has(requestId(req))
    return startsSoon || awaitingQuote
  }).length

  const requestsById = Object.fromEntries(requests.map((r) => [requestId(r), r]))
  const upcomingDepartures = acceptedOffers.filter((offer) => {
    const req = requestsById[offerRequestId(offer)]
    const start = tripStartMs(req?.trip)
    return start != null && start >= now && start - now <= UPCOMING_WINDOW_DAYS * MS_DAY
  }).length

  const organizerMap = new Map()
  for (const req of requests) {
    const org = req.organizer
    if (!org) continue
    const id = String(org._id || org.id || org.email || '')
    if (!id) continue
    organizerMap.set(id, org.organizationType || org.name || 'Client')
  }
  const orgTypes = [...new Set([...organizerMap.values()])]
  const communitiesHint =
    organizerMap.size === 0
      ? 'No clients yet'
      : orgTypes.length <= 2
        ? orgTypes.join(' · ')
        : `${orgTypes.slice(0, 2).join(' · ')} +${orgTypes.length - 2}`

  return {
    requestsReceived: requests.length,
    quotesSent: activeOffers.length,
    acceptanceRate,
    revenueDisplay,
    unreadCount,
    urgentRequests,
    upcomingDepartures,
    clientCommunities: organizerMap.size,
    communitiesHint,
  }
}
