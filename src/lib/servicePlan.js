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
export const DEFAULT_SERVICE_STEP_COUNT = 3

export function createEmptyServicePlan() {
  return {
    serviceDate: '',
    timeFrom: '',
    timeTo: '',
    selectedTypes: [],
    needs: {},
  }
}

export function createEmptyServicePlanSteps(count = DEFAULT_SERVICE_STEP_COUNT) {
  return Array.from({ length: count }, () => createEmptyServicePlan())
}

function planStepFromApi(step) {
  if (!step?.needs?.length) {
    return {
      serviceDate: step?.serviceDate || '',
      timeFrom: step?.timeFrom || '',
      timeTo: step?.timeTo || '',
      selectedTypes: [],
      needs: {},
    }
  }
  const selectedTypes = step.needs.map((item) => fromApiNeedType(item.needType) || item.needType)
  const needs = {}
  for (const item of step.needs) {
    const key = fromApiNeedType(item.needType) || item.needType
    needs[key] = {
      pickup: item.pickup || '',
      destination: item.destination || '',
      venueName: item.venueName || '',
      details: item.details || '',
    }
  }
  return {
    serviceDate: step.serviceDate || '',
    timeFrom: step.timeFrom || '',
    timeTo: step.timeTo || '',
    selectedTypes: [...new Set(selectedTypes)],
    needs,
  }
}

export function getServicePlanStepsFromTrip(trip) {
  const plan = trip?.servicePlan
  if (!plan) return createEmptyServicePlanSteps()

  if (plan.steps?.length) {
    const steps = plan.steps.map(planStepFromApi)
    while (steps.length < DEFAULT_SERVICE_STEP_COUNT) {
      steps.push(createEmptyServicePlan())
    }
    return steps.slice(0, DEFAULT_SERVICE_STEP_COUNT)
  }

  if (plan.needs?.length) {
    const legacy = planStepFromApi(plan)
    return [legacy, ...createEmptyServicePlanSteps(DEFAULT_SERVICE_STEP_COUNT - 1)]
  }

  return createEmptyServicePlanSteps()
}

/** @deprecated use getServicePlanStepsFromTrip */
export function normalizeServicePlanFromTrip(trip) {
  return getServicePlanStepsFromTrip(trip)[0]
}

export function serializeServicePlanStepForApi(step) {
  if (!step?.selectedTypes?.length) return null
  return {
    serviceDate: step.serviceDate?.trim() || undefined,
    timeFrom: step.timeFrom?.trim() || undefined,
    timeTo: step.timeTo?.trim() || undefined,
    needs: step.selectedTypes.map((needType) => {
      const detail = step.needs[needType] || {}
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

export function serializeServicePlanStepsForApi(steps) {
  const serializedSteps = (steps || [])
    .map(serializeServicePlanStepForApi)
    .filter(Boolean)
  if (!serializedSteps.length) return undefined
  return { steps: serializedSteps }
}

/** @deprecated use serializeServicePlanStepsForApi */
export function serializeServicePlanForApi(plan) {
  const step = serializeServicePlanStepForApi(plan)
  if (!step) return undefined
  return step
}

export function collectNeedTypesFromSteps(steps) {
  const types = new Set()
  for (const step of steps || []) {
    for (const type of step.selectedTypes || []) {
      types.add(type)
    }
  }
  return [...types]
}

export function servicePlanStepsToItineraryLegs(steps) {
  const legs = []
  for (const plan of steps || []) {
    legs.push(...servicePlanToItineraryLegs(plan))
  }
  return legs
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

function formatStepSchedule(step) {
  const lines = []
  if (step.serviceDate) lines.push(`Date: ${step.serviceDate}`)
  if (step.timeFrom || step.timeTo) {
    lines.push(`Time: ${step.timeFrom || '—'} to ${step.timeTo || '—'}`)
  }
  return lines
}

function formatStepNeedLines(step, uiNeedType) {
  const need = step.needs?.[uiNeedType]
  if (!need) return []
  const lines = []
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
  return lines
}

export function formatServiceNeedMessage(servicePlan, uiNeedType) {
  if (!servicePlan) return ''

  const apiSteps = servicePlan.steps?.length
    ? servicePlan.steps
    : servicePlan.needs?.length
      ? [servicePlan]
      : []

  const blocks = []
  for (let index = 0; index < apiSteps.length; index += 1) {
    const step = apiSteps[index]
    const apiType = toApiNeedType(uiNeedType)
    const need =
      step.needs?.find(
        (item) => item.needType === uiNeedType || toApiNeedType(item.needType) === apiType,
      ) || null

    if (!need && !step.serviceDate) continue

    const lines = [...formatStepSchedule(step)]
    if (need) {
      const uiType = fromApiNeedType(need.needType) || need.needType
      lines.push(...formatStepNeedLines({ needs: { [uiType]: need } }, uiType))
    }
    if (lines.length) {
      blocks.push(apiSteps.length > 1 ? `Step ${index + 1}\n${lines.join('\n')}` : lines.join('\n'))
    }
  }

  return blocks.join('\n\n')
}

export function formatServicePlanSummary(servicePlan) {
  if (!servicePlan) return ''

  const apiSteps = servicePlan.steps?.length
    ? servicePlan.steps
    : servicePlan.needs?.length
      ? [servicePlan]
      : []

  return apiSteps
    .map((step, index) => {
      const types = step.needs?.map((need) => fromApiNeedType(need.needType) || need.needType) || []
      const uniqueTypes = [...new Set(types)]
      const parts = uniqueTypes
        .map((uiType) => {
          const lines = [
            ...formatStepSchedule({
              serviceDate: step.serviceDate,
              timeFrom: step.timeFrom,
              timeTo: step.timeTo,
            }),
            ...formatStepNeedLines(
              {
                needs: {
                  [uiType]: step.needs.find(
                    (need) => (fromApiNeedType(need.needType) || need.needType) === uiType,
                  ),
                },
              },
              uiType,
            ),
          ]
          return lines.join('\n')
        })
        .filter(Boolean)
      if (!parts.length) return ''
      const body = parts.join('\n\n')
      return apiSteps.length > 1 ? `Step ${index + 1}\n${body}` : body
    })
    .filter(Boolean)
    .join('\n\n')
}

export function getAddressQueriesFromStep(step) {
  const queries = []
  const transport = step.needs?.Transport
  if (transport?.destination?.trim()) queries.push(transport.destination.trim())
  if (transport?.pickup?.trim()) queries.push(transport.pickup.trim())
  const hotel = step.needs?.Accommodation
  if (hotel?.venueName?.trim()) queries.push(hotel.venueName.trim())
  const restaurant = step.needs?.['Food & Catering']
  if (restaurant?.venueName?.trim()) queries.push(restaurant.venueName.trim())
  return queries
}
