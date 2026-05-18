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
  // ── Auth ──────────────────────────────────────────────────────────────────
  register: (email, password, full_name) =>
    request('POST', '/api/auth/register', { email, password, full_name }),

  login: (email, password) =>
    request('POST', '/api/auth/login', { email, password }),

  refresh: (refresh_token) =>
    request('POST', '/api/auth/refresh', { refresh_token }),

  me: (token) =>
    request('GET', '/api/auth/me', null, token),

  // ── Clients ───────────────────────────────────────────────────────────────
  clients: {
    list:   (token)       => request('GET',    '/api/clients/',       null,  token),
    create: (token, data) => request('POST',   '/api/clients/',       data,  token),
    update: (token, id, data) => request('PATCH', `/api/clients/${id}`, data, token),
    delete: (token, id)   => request('DELETE', `/api/clients/${id}`,  null,  token),
  },

  // ── Licences ──────────────────────────────────────────────────────────────
  licences: {
    list:   (token)       => request('GET',  '/api/licences/',              null,   token),
    create: (token, data) => request('POST', '/api/licences/',              data,   token),
    revoke: (token, id, reason) =>
      request('POST', `/api/licences/${id}/revoke`, { reason: reason || null }, token),
  },

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  bootstrap: {
    generate: (token, clientId) =>
      request('POST', `/api/bootstrap/generate/${clientId}`, {}, token),
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  admin: {
    listUsers:    (token)           => request('GET',    '/api/admin/users',        null,    token),
    createUser:   (token, data)     => request('POST',   '/api/admin/users',        data,    token),
    updateUser:   (token, id, data) => request('PATCH',  `/api/admin/users/${id}`,  data,    token),
    deleteUser:   (token, id)       => request('DELETE', `/api/admin/users/${id}`,  null,    token),
    updateProfile:(token, data)     => request('PATCH',  '/api/auth/me',            data,    token),
  },

  // ── Jobs ──────────────────────────────────────────────────────────────────
  jobs: {
    list: (token) =>
      request('GET', '/api/jobs/', null, token),

    listForClient: (token, clientId) =>
      request('GET', `/api/jobs/client/${clientId}`, null, token),

    highstate: (token, clientId) =>
      request('POST', `/api/jobs/highstate/${clientId}`, {}, token),

    acceptKey: (token, clientId) =>
      request('POST', `/api/jobs/accept-key/${clientId}`, {}, token),

    ping: (token, clientId) =>
      request('POST', `/api/jobs/ping/${clientId}`, {}, token),

    sendEmail: (token, clientId) =>
      request('POST', `/api/jobs/send-bootstrap-email/${clientId}`, {}, token),
  },
}
