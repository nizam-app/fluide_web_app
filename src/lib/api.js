import { clearAuthSession, loadToken } from './authStorage'
import {
  normalizeRequest,
  normalizeTrip,
  toApiNeedType,
  toApiNeedTypes,
} from './needTypes'

function mapTripPayload(payload) {
  if (!payload?.needTypes) return payload
  return { ...payload, needTypes: toApiNeedTypes(payload.needTypes) }
}

function mapRequestPayload(payload) {
  if (!payload?.needType) return payload
  return { ...payload, needType: toApiNeedType(payload.needType) }
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, { status, details, body } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
    this.body = body
  }
}

const sessionExpiredListeners = new Set()
export function onSessionExpired(handler) {
  sessionExpiredListeners.add(handler)
  return () => sessionExpiredListeners.delete(handler)
}

function notifySessionExpired() {
  for (const handler of sessionExpiredListeners) {
    try {
      handler()
    } catch {
      // ignore
    }
  }
}

function buildUrl(path, query) {
  const url = new URL(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function request(method, path, { body, query, token: overrideToken, headers, formData, timeoutMs = 30000 } = {}) {
  const token = overrideToken !== undefined ? overrideToken : loadToken()
  const finalHeaders = { ...(headers || {}) }
  let payload

  if (formData) {
    payload = formData
  } else if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  let response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body: payload,
      signal: controller.signal,
    })
  } catch (cause) {
    if (cause?.name === 'AbortError') {
      throw new ApiError('Request timed out — the server took too long to respond. Try again.', {
        status: 0,
        body: { cause: 'timeout' },
      })
    }
    throw new ApiError('Network error — cannot reach the Flunexia API.', { status: 0, body: { cause: cause?.message } })
  } finally {
    window.clearTimeout(timeoutId)
  }

  const text = await response.text()
  let json = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      // keep as null; we'll surface the raw text in the error message below
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearAuthSession()
      notifySessionExpired()
    }
    throw new ApiError(json?.message || text || response.statusText || 'Request failed', {
      status: response.status,
      details: json?.details,
      body: json,
    })
  }

  return json
}

const api = {
  baseUrl: API_URL,

  health: () => request('GET', '/health'),

  auth: {
    register: (payload) => request('POST', '/auth/register', { body: payload }),
    login: (payload) => request('POST', '/auth/login', { body: payload }),
    logout: () => request('POST', '/auth/logout'),
    me: () => request('GET', '/auth/me'),
    bootstrapAdmin: (payload) => request('POST', '/auth/bootstrap-admin', { body: payload }),
  },

  users: {
    me: () => request('GET', '/users/me'),
    updateProfile: (payload) => request('PATCH', '/users/me', { body: payload }),
    updatePassword: (payload) => request('PATCH', '/users/me/password', { body: payload }),
    uploadAvatar: (file) => {
      const formData = new FormData()
      formData.append('image', file)
      return request('POST', '/users/me/avatar', { formData })
    },
    deleteAccount: (password) => request('DELETE', '/users/me', { body: { password } }),
  },

  trips: {
    list: async (query) => {
      const result = await request('GET', '/trips', { query })
      if (result?.trips) {
        result.trips = result.trips.map(normalizeTrip)
      }
      return result
    },
    get: async (id) => {
      const result = await request('GET', `/trips/${id}`)
      if (result?.trip) {
        result.trip = normalizeTrip(result.trip)
      }
      return result
    },
    create: (payload, file) => {
      const body = mapTripPayload(payload)
      if (file) {
        const formData = new FormData()
        for (const [key, value] of Object.entries(body)) {
          if (value === undefined || value === null || value === '') continue
          if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof File))) {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, String(value))
          }
        }
        formData.append('image', file)
        return request('POST', '/trips', { formData })
      }
      return request('POST', '/trips', { body })
    },
    update: (id, payload) => request('PATCH', `/trips/${id}`, { body: mapTripPayload(payload) }),
    delete: (id) => request('DELETE', `/trips/${id}`),
    uploadImage: (id, file) => {
      const formData = new FormData()
      formData.append('image', file)
      return request('POST', `/trips/${id}/image`, { formData })
    },
    duplicate: (id) => request('POST', `/trips/${id}/duplicate`),
    recommendedProviders: (id) => request('GET', `/trips/${id}/recommended-providers`),
  },

  requests: {
    list: async (query) => {
      const result = await request('GET', '/requests', { query })
      if (result?.requests) {
        result.requests = result.requests.map(normalizeRequest)
      }
      return result
    },
    get: async (id) => {
      const result = await request('GET', `/requests/${id}`)
      if (result?.request) {
        result.request = normalizeRequest(result.request)
      }
      return result
    },
    create: (payload) => request('POST', '/requests', { body: mapRequestPayload(payload) }),
    update: (id, payload) => request('PATCH', `/requests/${id}`, { body: mapRequestPayload(payload) }),
    delete: (id) => request('DELETE', `/requests/${id}`),
    updateStatus: (id, status) => request('PATCH', `/requests/${id}/status`, { body: { status } }),
    addMessage: (id, body) => request('POST', `/requests/${id}/messages`, { body: { body } }),
    history: (id) => request('GET', `/requests/${id}/history`),
    listOffers: (requestId) => request('GET', `/requests/${requestId}/offers`),
    createOffer: (requestId, payload) =>
      request('POST', `/requests/${requestId}/offers`, { body: payload }),
  },

  offers: {
    list: (query) => request('GET', '/offers', { query }),
    get: (id) => request('GET', `/offers/${id}`),
    updateStatus: (id, status) => request('PATCH', `/offers/${id}/status`, { body: { status } }),
  },

  admin: {
    stats: () => request('GET', '/admin/stats'),
    listUsers: (query) => request('GET', '/admin/users', { query }),
    createUser: (payload) => request('POST', '/admin/users', { body: payload }),
    updateUserStatus: (id, status) =>
      request('PATCH', `/admin/users/${id}/status`, { body: { status } }),
    listTrips: async (query) => {
      const result = await request('GET', '/admin/trips', { query })
      if (result?.trips) {
        result.trips = result.trips.map(normalizeTrip)
      }
      return result
    },
    listRequests: async (query) => {
      const result = await request('GET', '/admin/requests', { query })
      if (result?.requests) {
        result.requests = result.requests.map(normalizeRequest)
      }
      return result
    },
    listOffers: (query) => request('GET', '/admin/offers', { query }),
    updateRequest: (id, payload) => request('PATCH', `/requests/${id}`, { body: payload }),
    deleteRequest: (id) => request('DELETE', `/requests/${id}`),
  },

  contact: {
    submit: (payload) => request('POST', '/contact', { body: payload }),
    list: (query) => request('GET', '/contact', { query }),
    updateStatus: (id, status) => request('PATCH', `/contact/${id}/status`, { body: { status } }),
  },

  utils: {
    destinationImage: (q) => request('GET', '/utils/destination-image', { query: { q } }),
    destinationImageProxyUrl: (q) => {
      if (!q) return ''
      const url = new URL(`${API_URL}/utils/destination-image/proxy`)
      url.searchParams.set('q', String(q).trim())
      return url.toString()
    },
  },

  favorites: {
    list: () => request('GET', '/favorites'),
    add: (providerId) => request('POST', `/favorites/${providerId}`),
    remove: (providerId) => request('DELETE', `/favorites/${providerId}`),
  },
}

export default api
