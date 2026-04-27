import { BRAND } from '../config'

const BASE = BRAND.apiUrl

async function request(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'API error')
  return data
}

export const api = {
  register: (email, password, full_name) =>
    request('POST', '/api/auth/register', { email, password, full_name }),

  login: (email, password) =>
    request('POST', '/api/auth/login', { email, password }),

  me: (token) =>
    request('GET', '/api/auth/me', null, token),

  clients: {
    list: (token) => request('GET', '/api/clients/', null, token),
    create: (token, data) => request('POST', '/api/clients/', data, token),
    delete: (token, id) => request('DELETE', `/api/clients/${id}`, null, token),
  },

  licences: {
    list: (token) => request('GET', '/api/licences/', null, token),
    create: (token, data) => request('POST', '/api/licences/', data, token),
    revoke: (token, id) => request('POST', `/api/licences/${id}/revoke`, {}, token),
  },

  bootstrap: {
    generate: (token, clientId) =>
      request('POST', `/api/bootstrap/generate/${clientId}`, {}, token),
  },
}
