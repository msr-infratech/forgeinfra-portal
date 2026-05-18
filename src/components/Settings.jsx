import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import styles from './Dashboard.module.css'

// ── Profile form ──────────────────────────────────────────────────────────────

function ProfileSection({ user, token, onUpdated }) {
  const [form, setForm] = useState({
    full_name: user.full_name || '',
    email: user.email,
    current_password: '',
    new_password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    setLoading(true); setError(''); setSuccess('')
    try {
      const payload = {}
      if (form.full_name !== user.full_name) payload.full_name = form.full_name
      if (form.email !== user.email)         payload.email     = form.email
      if (form.new_password) {
        if (!form.current_password) { setError('Enter your current password to change it'); setLoading(false); return }
        payload.current_password = form.current_password
        payload.new_password     = form.new_password
      }
      if (!Object.keys(payload).length) { setSuccess('Nothing to update'); setLoading(false); return }

      const updated = await api.admin.updateProfile(token, payload)
      onUpdated(updated)
      setSuccess('Profile updated successfully')
      setForm(f => ({ ...f, current_password: '', new_password: '' }))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 460 }}>
      <div className={styles.sectionTitle} style={{ marginBottom: 20 }}>My profile</div>

      <div className={styles.field}>
        <label className={styles.label}>Full name</label>
        <input className={styles.input} value={form.full_name} onChange={set('full_name')} placeholder="Your name" />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input className={styles.input} type="email" value={form.email} onChange={set('email')} />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', margin: '20px 0' }} />
      <div style={{ fontSize: 13, color: 'var(--tx-2)', marginBottom: 16, fontWeight: 500 }}>Change password</div>

      <div className={styles.field}>
        <label className={styles.label}>Current password</label>
        <input className={styles.input} type="password" value={form.current_password} onChange={set('current_password')} placeholder="Required to change password" />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>New password</label>
        <input className={styles.input} type="password" value={form.new_password} onChange={set('new_password')} placeholder="Min. 8 characters" />
      </div>

      {error   && <div className={styles.error}>{error}</div>}
      {success && <div style={{ fontSize: 13, color: '#22c55e', marginBottom: 14, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--r)' }}>{success}</div>}

      <button className="btn btn-solid" style={{ padding: '10px 24px' }} onClick={submit} disabled={loading}>
        {loading ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  )
}

// ── Users management ──────────────────────────────────────────────────────────

function UserRow({ u, currentUserId, token, onUpdated, onDeleted }) {
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ full_name: u.full_name || '', email: u.email, is_admin: u.is_admin, new_password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const save = async () => {
    setLoading(true); setError('')
    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        is_admin: form.is_admin,
      }
      if (form.new_password) payload.new_password = form.new_password
      const updated = await api.admin.updateUser(token, u.id, payload)
      onUpdated(updated)
      setEditMode(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const deactivate = async () => {
    if (!confirm(`Deactivate ${u.email}?`)) return
    try { await api.admin.deleteUser(token, u.id); onDeleted(u.id) }
    catch (e) { alert(e.message) }
  }

  if (editMode) {
    return (
      <div style={{ padding: '16px 20px', background: 'var(--bg-card-h)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label className={styles.label}>Name</label>
            <input className={styles.input} value={form.full_name} onChange={set('full_name')} />
          </div>
          <div>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className={styles.label}>New password (optional)</label>
            <input className={styles.input} type="password" value={form.new_password} onChange={set('new_password')} placeholder="Leave blank to keep" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
            <input type="checkbox" id={`admin-${u.id}`} checked={form.is_admin} onChange={set('is_admin')} style={{ accentColor: 'var(--accent)' }} />
            <label htmlFor={`admin-${u.id}`} style={{ fontSize: 13, cursor: 'pointer' }}>Admin</label>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-solid" style={{ fontSize: 12, padding: '7px 16px' }} onClick={save} disabled={loading}>
            {loading ? '…' : 'Save'}
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 16px' }} onClick={() => { setEditMode(false); setError('') }}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.row}>
      <div className={styles.rowMain}>
        <div className={styles.rowName}>{u.full_name || '—'}</div>
        <div className={styles.rowMeta}>{u.email}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {u.is_admin && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid rgba(6,182,212,0.2)', padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin</span>}
        <span className={u.is_active ? styles.active : styles.inactive}>{u.is_active ? 'Active' : 'Inactive'}</span>
      </div>
      <div className={styles.rowActions}>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setEditMode(true)}>Edit</button>
        {u.id !== currentUserId && u.is_active && (
          <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px', color: '#ef4444', borderColor: '#ef4444' }} onClick={deactivate}>Deactivate</button>
        )}
      </div>
    </div>
  )
}

function UsersSection({ token, currentUserId }) {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm]         = useState({ email: '', password: '', full_name: '', is_admin: false })
  const [creating, setCreating] = useState(false)
  const [error, setError]       = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  useEffect(() => {
    api.admin.listUsers(token)
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const createUser = async () => {
    setCreating(true); setError('')
    try {
      const u = await api.admin.createUser(token, form)
      setUsers(prev => [u, ...prev])
      setShowCreate(false)
      setForm({ email: '', password: '', full_name: '', is_admin: false })
    } catch (e) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Users</div>
        <button className="btn btn-solid" style={{ fontSize: 12, padding: '7px 16px' }} onClick={() => setShowCreate(s => !s)}>
          {showCreate ? 'Cancel' : '+ New user'}
        </button>
      </div>

      {showCreate && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-h)', borderRadius: 'var(--r-lg)', padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className={styles.label}>Full name</label>
              <input className={styles.input} value={form.full_name} onChange={set('full_name')} placeholder="Jane Doe" />
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" value={form.email} onChange={set('email')} placeholder="jane@company.com" />
            </div>
            <div>
              <label className={styles.label}>Password</label>
              <input className={styles.input} type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 22 }}>
              <input type="checkbox" id="new-is-admin" checked={form.is_admin} onChange={set('is_admin')} style={{ accentColor: 'var(--accent)' }} />
              <label htmlFor="new-is-admin" style={{ fontSize: 13, cursor: 'pointer' }}>Admin privileges</label>
            </div>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button className="btn btn-solid" style={{ padding: '9px 20px', fontSize: 13 }} onClick={createUser} disabled={creating}>
            {creating ? 'Creating…' : 'Create user →'}
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : (
        <div className={styles.list}>
          {users.map(u => (
            <UserRow
              key={u.id}
              u={u}
              currentUserId={currentUserId}
              token={token}
              onUpdated={updated => setUsers(prev => prev.map(x => x.id === updated.id ? updated : x))}
              onDeleted={id => setUsers(prev => prev.map(x => x.id === id ? { ...x, is_active: false } : x))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Settings page ─────────────────────────────────────────────────────────────

export default function Settings({ onBack }) {
  const { user, token, logout } = useAuth()
  const [currentUser, setCurrentUser] = useState(user)
  const [tab, setTab] = useState('profile')

  const TAB_STYLE = (active) => ({
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    color: active ? 'var(--accent)' : 'var(--tx-2)',
    transition: 'all 0.15s',
  })

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLogo}>
          <div className={styles.hex} />
          <span className={styles.brand}>ForgeInfra</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{currentUser?.email}</span>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={logout}>Logout</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageLabel}>Settings</div>
            <h1 className={styles.pageTitle}>Account & Users</h1>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={onBack}>
            ← Back to dashboard
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 28, gap: 4 }}>
          <button style={TAB_STYLE(tab === 'profile')} onClick={() => setTab('profile')}>My profile</button>
          {currentUser?.is_admin && (
            <button style={TAB_STYLE(tab === 'users')} onClick={() => setTab('users')}>Users</button>
          )}
        </div>

        {tab === 'profile' && (
          <ProfileSection user={currentUser} token={token} onUpdated={setCurrentUser} />
        )}
        {tab === 'users' && currentUser?.is_admin && (
          <UsersSection token={token} currentUserId={currentUser.id} />
        )}
      </div>
    </div>
  )
}
