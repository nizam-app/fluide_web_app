import { fromApiNeedType, toApiNeedType } from './needTypes'

/** @type {'transfer' | 'venue' | 'details'} */
export const SERVICE_FIELD_KIND = {
  TRANSFER: 'transfer',
  VENUE: 'venue',
  DETAILS: 'details',
}

const LEGACY_NEED_TYPE_KEYS = {
  Transport: 'Transportation',
  'Food & Catering': 'Restaurants',
  'Guide & Tour': 'Guided Tours',
  Equipment: 'Other',
}

export const SERVICE_NEED_CONFIG = {
  Transportation: {
    label: 'Transportation',
    fieldKind: SERVICE_FIELD_KIND.TRANSFER,
    pickupLabel: 'Pick up',
    destinationLabel: 'Destination',
  },
  Accommodation: {
    label: 'Accommodation',
    fieldKind: SERVICE_FIELD_KIND.VENUE,
    venuePlaceholder: 'Hotel KiVA',
  },
  Restaurants: {
    label: 'Restaurants',
    fieldKind: SERVICE_FIELD_KIND.VENUE,
    venuePlaceholder: 'Resto KiVA',
  },
  'Guided Tours': {
    label: 'Guided Tours',
    fieldKind: SERVICE_FIELD_KIND.DETAILS,
    detailsPlaceholder: 'City walking tour, museum guide…',
  },
  'Activities & Leisure': {
    label: 'Activities & Leisure',
    fieldKind: SERVICE_FIELD_KIND.DETAILS,
    detailsPlaceholder: 'Kayaking, team games, leisure park…',
  },
  Tickets: {
    label: 'Tickets',
    fieldKind: SERVICE_FIELD_KIND.DETAILS,
    detailsPlaceholder: 'Museum entry, show tickets…',
  },
  'Shuttles & Transfers': {
    label: 'Shuttles & Transfers',
    fieldKind: SERVICE_FIELD_KIND.TRANSFER,
    pickupLabel: 'Pick up',
    destinationLabel: 'Destination',
  },
  'Educational Activities': {
    label: 'Educational Activities',
    fieldKind: SERVICE_FIELD_KIND.DETAILS,
    detailsPlaceholder: 'Workshop, school visit, training…',
  },
  Events: {
    label: 'Events',
    fieldKind: SERVICE_FIELD_KIND.DETAILS,
    detailsPlaceholder: 'Conference, ceremony, group event…',
  },
  Other: {
    label: 'Other',
    fieldKind: SERVICE_FIELD_KIND.DETAILS,
    detailsPlaceholder: 'Describe what you need',
  },
}

export const CREATE_TRIP_SERVICE_OPTIONS = Object.keys(SERVICE_NEED_CONFIG)
export const INITIAL_SERVICE_STEP_COUNT = 1

export function normalizeNeedTypeKey(needType) {
  if (!needType) return needType
  return LEGACY_NEED_TYPE_KEYS[needType] || needType
}

export function createEmptyServicePlan() {
  return {
    serviceDate: '',
    timeFrom: '',
    timeTo: '',
    selectedTypes: [],
    needs: {},
  }
}

export function createEmptyServicePlanSteps(count = INITIAL_SERVICE_STEP_COUNT) {
  return Array.from({ length: Math.max(count, 1) }, () => createEmptyServicePlan())
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
  const selectedTypes = step.needs.map(
    (item) => normalizeNeedTypeKey(fromApiNeedType(item.needType) || item.needType),
  )
  const needs = {}
  for (const item of step.needs) {
    const key = normalizeNeedTypeKey(fromApiNeedType(item.needType) || item.needType)
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
    return plan.steps.map(planStepFromApi)
  }

  if (plan.needs?.length) {
    return [planStepFromApi(plan)]
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

const TRANSFER_NEED_TYPES = new Set(['Transportation', 'Shuttles & Transfers', 'Transport'])

export function servicePlanToItineraryLegs(plan) {
  const legs = []
  for (const needType of plan.selectedTypes || []) {
    const detail = plan.needs?.[needType]
    if (!detail) continue
    if (TRANSFER_NEED_TYPES.has(needType) && (detail.pickup?.trim() || detail.destination?.trim())) {
      legs.push({
        type: 'transfer',
        date: plan.serviceDate || undefined,
        time: plan.timeFrom || undefined,
        pickup: detail.pickup?.trim() || '',
        destination: detail.destination?.trim() || '',
      })
    }
    if (needType === 'Accommodation' && detail.venueName?.trim()) {
      legs.push({
        type: 'stay',
        location: detail.venueName.trim(),
        detail: plan.serviceDate ? `Service date: ${plan.serviceDate}` : undefined,
      })
    }
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
  const config = SERVICE_NEED_CONFIG[uiNeedType]
  const lines = []
  if (config?.fieldKind === SERVICE_FIELD_KIND.TRANSFER && (need.pickup || need.destination)) {
    lines.push(`${config.label}: ${[need.pickup, need.destination].filter(Boolean).join(' → ')}`)
  }
  if (config?.fieldKind === SERVICE_FIELD_KIND.VENUE && need.venueName) {
    lines.push(`${config.label}: ${need.venueName}`)
  }
  if (config?.fieldKind === SERVICE_FIELD_KIND.DETAILS && need.details) {
    lines.push(`${config.label}: ${need.details}`)
  }
  return lines
}

function stepNeedsMatchingApiType(step, apiNeedType) {
  return (step.needs || []).filter((item) => {
    const uiType = normalizeNeedTypeKey(fromApiNeedType(item.needType) || item.needType)
    return uiType === apiNeedType || toApiNeedType(uiType) === apiNeedType || item.needType === apiNeedType
  })
}

export function formatServiceNeedMessage(servicePlan, uiNeedType) {
  if (!servicePlan) return ''

  const apiSteps = servicePlan.steps?.length
    ? servicePlan.steps
    : servicePlan.needs?.length
      ? [servicePlan]
      : []

  const apiType = toApiNeedType(uiNeedType)
  const blocks = []
  for (let index = 0; index < apiSteps.length; index += 1) {
    const step = apiSteps[index]
    const matchingNeeds = stepNeedsMatchingApiType(step, apiType)
    if (!matchingNeeds.length && !step.serviceDate) continue

    const lines = [...formatStepSchedule(step)]
    for (const need of matchingNeeds) {
      const uiType = normalizeNeedTypeKey(fromApiNeedType(need.needType) || need.needType)
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
      const types = step.needs?.map((need) => normalizeNeedTypeKey(fromApiNeedType(need.needType) || need.needType)) || []
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
                    (need) => normalizeNeedTypeKey(fromApiNeedType(need.needType) || need.needType) === uiType,
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
  for (const needType of step.selectedTypes || []) {
    const config = SERVICE_NEED_CONFIG[needType]
    const detail = step.needs?.[needType]
    if (!detail || !config) continue
    if (config.fieldKind === SERVICE_FIELD_KIND.TRANSFER) {
      if (detail.destination?.trim()) queries.push(detail.destination.trim())
      if (detail.pickup?.trim()) queries.push(detail.pickup.trim())
    }
    if (config.fieldKind === SERVICE_FIELD_KIND.VENUE && detail.venueName?.trim()) {
      queries.push(detail.venueName.trim())
    }
  }
  return queries
}
