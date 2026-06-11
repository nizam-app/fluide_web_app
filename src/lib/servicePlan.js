import { fromApiNeedType, toApiNeedType } from './needTypes'

export const SERVICE_NEED_CONFIG = {
  Transport: {
    label: 'Transfer',
    pickupLabel: 'Pick up',
    destinationLabel: 'Destination',
  },
  Accommodation: {
    label: 'Hotel',
    venueLabel: 'Hotel name',
    venuePlaceholder: 'Hotel KiVA',
  },
  'Food & Catering': {
    label: 'Restaurant',
    venueLabel: 'Restaurant name',
    venuePlaceholder: 'Resto KiVA',
  },
  Equipment: {
    label: 'Equipment',
    detailsLabel: 'Equipment needed',
    detailsPlaceholder: 'Wheelchair, walking stick',
  },
}

export const CREATE_TRIP_SERVICE_OPTIONS = Object.keys(SERVICE_NEED_CONFIG)

export function createEmptyServicePlan() {
  return {
    serviceDate: '',
    timeFrom: '',
    timeTo: '',
    selectedTypes: [],
    needs: {},
  }
}

export function normalizeServicePlanFromTrip(trip) {
  if (!trip?.servicePlan?.needs?.length) return createEmptyServicePlan()
  const selectedTypes = trip.servicePlan.needs.map((item) => fromApiNeedType(item.needType) || item.needType)
  const needs = {}
  for (const item of trip.servicePlan.needs) {
    const key = fromApiNeedType(item.needType) || item.needType
    needs[key] = {
      pickup: item.pickup || '',
      destination: item.destination || '',
      venueName: item.venueName || '',
      details: item.details || '',
    }
  }
  return {
    serviceDate: trip.servicePlan.serviceDate || '',
    timeFrom: trip.servicePlan.timeFrom || '',
    timeTo: trip.servicePlan.timeTo || '',
    selectedTypes: [...new Set(selectedTypes)],
    needs,
  }
}

export function serializeServicePlanForApi(plan) {
  if (!plan?.selectedTypes?.length) return undefined
  return {
    serviceDate: plan.serviceDate?.trim() || undefined,
    timeFrom: plan.timeFrom?.trim() || undefined,
    timeTo: plan.timeTo?.trim() || undefined,
    needs: plan.selectedTypes.map((needType) => {
      const detail = plan.needs[needType] || {}
      return {
        needType,
        pickup: detail.pickup?.trim() || undefined,
        destination: detail.destination?.trim() || undefined,
        venueName: detail.venueName?.trim() || undefined,
        details: detail.details?.trim() || undefined,
      }
    }),
  }
}

export function servicePlanToItineraryLegs(plan) {
  const legs = []
  const transport = plan.needs?.Transport
  if (transport && (transport.pickup?.trim() || transport.destination?.trim())) {
    legs.push({
      type: 'transfer',
      date: plan.serviceDate || undefined,
      time: plan.timeFrom || undefined,
      pickup: transport.pickup?.trim() || '',
      destination: transport.destination?.trim() || '',
    })
  }
  const hotel = plan.needs?.Accommodation
  if (hotel?.venueName?.trim()) {
    legs.push({
      type: 'stay',
      location: hotel.venueName.trim(),
      detail: plan.serviceDate ? `Service date: ${plan.serviceDate}` : undefined,
    })
  }
  return legs
}

export function formatServiceNeedMessage(servicePlan, uiNeedType) {
  if (!servicePlan) return ''
  const apiType = toApiNeedType(uiNeedType)
  const need =
    servicePlan.needs?.find(
      (item) => item.needType === uiNeedType || toApiNeedType(item.needType) === apiType,
    ) || null

  const lines = []
  if (servicePlan.serviceDate) lines.push(`Date: ${servicePlan.serviceDate}`)
  if (servicePlan.timeFrom || servicePlan.timeTo) {
    lines.push(`Time: ${servicePlan.timeFrom || '—'} to ${servicePlan.timeTo || '—'}`)
  }

  if (need) {
    if (need.pickup || need.destination) {
      lines.push(`Transfer: ${[need.pickup, need.destination].filter(Boolean).join(' → ')}`)
    }
    if (need.venueName) {
      const label = uiNeedType === 'Food & Catering' ? 'Restaurant' : 'Hotel'
      lines.push(`${label}: ${need.venueName}`)
    }
    if (need.details) {
      lines.push(`Equipment: ${need.details}`)
    }
  }

  return lines.join('\n')
}

export function formatServicePlanSummary(servicePlan) {
  if (!servicePlan?.needs?.length) return ''
  return servicePlan.needs
    .map((need) => {
      const uiType = fromApiNeedType(need.needType) || need.needType
      return formatServiceNeedMessage(servicePlan, uiType)
    })
    .filter(Boolean)
    .join('\n\n')
}
