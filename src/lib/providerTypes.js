import { PROVIDER_TYPES } from '../data/mockData'

export function getApprovedProviderTypes(user) {
  if (!user) return []
  if (Array.isArray(user.providerTypes) && user.providerTypes.length) {
    return user.providerTypes.filter((type) => PROVIDER_TYPES.includes(type))
  }
  if (user.providerType && PROVIDER_TYPES.includes(user.providerType)) {
    return [user.providerType]
  }
  return []
}

export function getPendingProviderTypes(user) {
  if (!user?.pendingProviderTypes?.length) return []
  return user.pendingProviderTypes.filter((type) => PROVIDER_TYPES.includes(type))
}

export function getSelectedProviderTypes(user) {
  return [...new Set([...getApprovedProviderTypes(user), ...getPendingProviderTypes(user)])]
}

export function formatProviderTypesLabel(user) {
  const approved = getApprovedProviderTypes(user)
  const pending = getPendingProviderTypes(user)
  if (!approved.length && !pending.length) return '—'
  const parts = []
  if (approved.length) parts.push(approved.join(', '))
  if (pending.length) parts.push(`Pending: ${pending.join(', ')}`)
  return parts.join(' · ')
}
