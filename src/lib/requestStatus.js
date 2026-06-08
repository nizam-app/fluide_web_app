export const DISPLAY_STATUS_LABELS = {
  pending: 'Pending',
  offers_received: 'Offers Received',
  under_negotiation: 'Under Negotiation',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Canceled',
}

export function getRequestDisplayStatus(request) {
  if (request?.displayStatus) return request.displayStatus
  const status = request?.status
  if (status === 'cancelled') return 'cancelled'
  if (status === 'completed') return 'completed'
  if (status === 'accepted') return 'confirmed'
  if (status === 'rejected') return 'cancelled'
  return 'pending'
}

export function getRequestDisplayLabel(request) {
  return request?.displayStatusLabel || DISPLAY_STATUS_LABELS[getRequestDisplayStatus(request)] || 'Pending'
}

export function computeCostPerParticipant(budgetEstimate, participants) {
  const budget = Number(budgetEstimate)
  const count = Number(participants)
  if (!Number.isFinite(budget) || !Number.isInteger(count) || count < 1) return null
  return Math.round((budget / count) * 100) / 100
}
