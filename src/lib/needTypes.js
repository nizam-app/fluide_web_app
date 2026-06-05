/**
 * UI labels (buyer-facing) map to backend API enum values until the API is updated.
 */
import { BOOKING_MODES, normalizeItinerary } from './itinerary'

export const NEED_TYPE_TO_API = {
  Transport: 'Transport',
  Accommodation: 'Hotel',
  'Food & Catering': 'Restaurant',
  'Guide & Tour': 'Activity',
  Equipment: 'Other Service',
}

export const NEED_TYPE_FROM_API = Object.fromEntries(
  Object.entries(NEED_TYPE_TO_API).map(([ui, api]) => [api, ui]),
)

export function toApiNeedType(label) {
  if (!label) return label
  return NEED_TYPE_TO_API[label] ?? label
}

export function fromApiNeedType(value) {
  if (!value) return value
  return NEED_TYPE_FROM_API[value] ?? value
}

export function toApiNeedTypes(types) {
  return (types || []).map(toApiNeedType)
}

export function fromApiNeedTypes(types) {
  return (types || []).map(fromApiNeedType)
}

export function normalizeTrip(trip) {
  if (!trip) return trip
  return {
    ...trip,
    needTypes: fromApiNeedTypes(trip.needTypes),
    itinerary: normalizeItinerary(trip.itinerary),
    bookingMode: trip.bookingMode === BOOKING_MODES.BUNDLED ? BOOKING_MODES.BUNDLED : BOOKING_MODES.MULTI,
  }
}

export function normalizeRequest(request) {
  if (!request) return request
  return {
    ...request,
    needType: fromApiNeedType(request.needType),
  }
}
