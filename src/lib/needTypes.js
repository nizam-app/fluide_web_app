/**
 * UI labels (buyer-facing) map to backend API enum values until the API is updated.
 */
import { BOOKING_MODES, normalizeItinerary } from './itinerary'

export const NEED_TYPE_TO_API = {
  Transportation: 'Transport',
  Accommodation: 'Hotel',
  Restaurants: 'Restaurant',
  'Guided Tours': 'Activity',
  'Activities & Leisure': 'Activity',
  Tickets: 'Other Service',
  'Shuttles & Transfers': 'Transport',
  'Educational Activities': 'Activity',
  Events: 'Other Service',
  Other: 'Other Service',
  // Legacy UI keys
  Transport: 'Transport',
  'Food & Catering': 'Restaurant',
  'Guide & Tour': 'Activity',
  Equipment: 'Other Service',
}

export const NEED_TYPE_FROM_API = {
  Transport: 'Transportation',
  Hotel: 'Accommodation',
  Restaurant: 'Restaurants',
  Activity: 'Guided Tours',
  'Other Service': 'Other',
}

export function toApiNeedType(label) {
  if (!label) return label
  return NEED_TYPE_TO_API[label] ?? label
}

export function fromApiNeedType(value) {
  if (!value) return value
  return NEED_TYPE_FROM_API[value] ?? value
}

export function toApiNeedTypes(types) {
  const apiTypes = (types || []).map(toApiNeedType)
  return [...new Set(apiTypes)]
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
    servicePlan: trip.servicePlan || null,
  }
}

export function normalizeRequest(request) {
  if (!request) return request
  return {
    ...request,
    needType: fromApiNeedType(request.needType),
  }
}
