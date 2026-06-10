export function readCachedProvider(id) {
  try {
    const raw = sessionStorage.getItem(`provider:${id}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function cacheProviderProfile(provider) {
  const providerId = provider?._id || provider
  if (!providerId) return
  try {
    sessionStorage.setItem(`provider:${providerId}`, JSON.stringify(provider))
  } catch {
    // Ignore quota or privacy mode errors.
  }
}
