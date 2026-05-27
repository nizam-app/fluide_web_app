import { clearAuthSession, loadToken } from './authStorage'

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

async function request(method, path, { body, query, token: overrideToken, headers, formData } = {}) {
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

  let response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body: payload,
    })
  } catch (cause) {
    throw new ApiError('Network error — cannot reach the Flunexia API.', { status: 0, body: { cause: cause?.message } })
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
  },

  trips: {
    list: (query) => request('GET', '/trips', { query }),
    get: (id) => request('GET', `/trips/${id}`),
    create: (payload) => request('POST', '/trips', { body: payload }),
    update: (id, payload) => request('PATCH', `/trips/${id}`, { body: payload }),
    delete: (id) => request('DELETE', `/trips/${id}`),
    uploadImage: (id, file) => {
      const formData = new FormData()
      formData.append('image', file)
      return request('POST', `/trips/${id}/image`, { formData })
    },
  },

  requests: {
    list: (query) => request('GET', '/requests', { query }),
    get: (id) => request('GET', `/requests/${id}`),
    create: (payload) => request('POST', '/requests', { body: payload }),
    updateStatus: (id, status) => request('PATCH', `/requests/${id}/status`, { body: { status } }),
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
    listTrips: (query) => request('GET', '/admin/trips', { query }),
    listRequests: (query) => request('GET', '/admin/requests', { query }),
    listOffers: (query) => request('GET', '/admin/offers', { query }),
  },

  contact: {
    submit: (payload) => request('POST', '/contact', { body: payload }),
    list: (query) => request('GET', '/contact', { query }),
    updateStatus: (id, status) => request('PATCH', `/contact/${id}/status`, { body: { status } }),
  },
}

export default api
