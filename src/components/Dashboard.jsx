import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import styles from './Dashboard.module.css'
import Settings from './Settings'

// ── Helpers ───────────────────────────────────────────────────────────────────

const PLAN_PRICE = { starter: 490, business: 1490, enterprise: 0 }

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  if (m > 0) return `${m}m ago`
  return 'just now'
}

const JOB_TYPE_LABEL = {
  highstate:  'Highstate',
  accept_key: 'Accept Key',
  test_ping:  'Ping',
}

const JOB_STATUS_COLOR = {
  pending: 'var(--tx-3)',
  running: 'var(--accent)',
  success: '#22c55e',
  failed:  '#ef4444',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue} style={accent ? { color: 'var(--accent)' } : {}}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

function JobStatusBadge({ status }) {
  const color = JOB_STATUS_COLOR[status] || 'var(--tx-3)'
  const isRunning = status === 'running'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, color,
      background: `${color}18`, border: `1px solid ${color}30`,
      padding: '2px 8px', borderRadius: 20,
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0,
        animation: isRunning ? 'pulse 1.2s infinite' : 'none',
      }} />
      {status}
    </span>
  )
}

function JobRow({ job, clientName, expanded, onToggle }) {
  let resultObj = null
  if (job.result) {
    try { resultObj = JSON.parse(job.result) } catch {}
  }

  return (
    <div className={styles.jobRow}>
      <div className={styles.jobMain} onClick={onToggle} style={{ cursor: resultObj ? 'pointer' : 'default' }}>
        <JobStatusBadge status={job.status} />
        <span className={styles.jobClient}>{clientName}</span>
        <span className={styles.jobType}>{JOB_TYPE_LABEL[job.type] || job.type}</span>
        <span className={styles.jobTime}>{timeAgo(job.created_at)}</span>
        {resultObj && (
          <span style={{ fontSize: 11, color: 'var(--tx-3)', marginLeft: 'auto' }}>
            {expanded ? '▲ hide' : '▼ details'}
          </span>
        )}
      </div>
      {expanded && resultObj && (
        <pre className={styles.jobResult}>{JSON.stringify(resultObj, null, 2)}</pre>
      )}
    </div>
  )
}

function ClientRow({ client, licence, lastJob, onBootstrap, onRevoke, onAcceptKey, onHighstate, onPing, onSendEmail }) {
  const [loading, setLoading] = useState(null)

  const run = (action, fn) => async () => {
    setLoading(action)
    try { await fn() } finally { setLoading(null) }
  }

  return (
    <div className={styles.row}>
      <div className={styles.rowMain}>
        <div className={styles.rowName}>{client.name}</div>
        <div className={styles.rowMeta}>
          {client.email} · <span className={styles.plan}>{client.plan}</span>
          {client.gitea_branch && (
            <span style={{ color: 'var(--tx-3)', marginLeft: 6, fontSize: 11 }}>
              @ {client.gitea_branch}
            </span>
          )}
        </div>
      </div>

      <div className={styles.rowStatus}>
        <span className={client.is_active ? styles.active : styles.inactive}>
          {client.is_active ? 'Active' : 'Inactive'}
        </span>
        {lastJob && (
          <span style={{ marginLeft: 8 }}>
            <JobStatusBadge status={lastJob.status} />
          </span>
        )}
      </div>

      <div className={styles.rowActions}>
        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px' }}
          disabled={loading === 'acceptKey'}
          onClick={run('acceptKey', onAcceptKey)}
          title="Accept minion key"
        >
          {loading === 'acceptKey' ? '…' : 'Accept Key'}
        </button>

        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px', color: 'var(--accent)', borderColor: 'var(--accent)' }}
          disabled={loading === 'highstate'}
          onClick={run('highstate', onHighstate)}
          title="Run state.apply"
        >
          {loading === 'highstate' ? '…' : 'Highstate'}
        </button>

        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px' }}
          disabled={loading === 'ping'}
          onClick={run('ping', onPing)}
          title="test.ping"
        >
          {loading === 'ping' ? '…' : 'Ping'}
        </button>

        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px' }}
          onClick={onBootstrap}
          title="Show bootstrap command"
        >
          Bootstrap
        </button>

        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px' }}
          disabled={loading === 'email'}
          onClick={run('email', onSendEmail)}
          title="Send bootstrap email"
        >
          {loading === 'email' ? '…' : '✉'}
        </button>

        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 12px', color: '#ef4444', borderColor: '#ef4444' }}
          onClick={onRevoke}
          title="Revoke licence"
        >
          Revoke
        </button>
      </div>
    </div>
  )
}

function NewClientModal({ token, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', plan: 'starter' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const client = await api.clients.create(token, form)
      await api.licences.create(token, { client_id: client.id, plan: form.plan, duration_days: 365 })
      onCreated(client)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>New client</div>
        <div className={styles.field}>
          <label className={styles.label}>Company name</label>
          <input className={styles.input} value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Acme Corp" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input className={styles.input} type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} placeholder="cto@acme.com" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Plan</label>
          <select className={styles.input} value={form.plan}
            onChange={e => setForm({ ...form, plan: e.target.value })}>
            <option value="starter">Starter — €490/yr · 10 nodes</option>
            <option value="business">Business — €1 490/yr · 100 nodes</option>
            <option value="enterprise">Enterprise — Custom</option>
          </select>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className="btn btn-solid" style={{ width: '100%', padding: 12 }}
          onClick={submit} disabled={loading}>
          {loading ? 'Creating…' : 'Create client + licence →'}
        </button>
      </div>
    </div>
  )
}

function BootstrapModal({ command, clientEmail, token, clientId, onClose }) {
  const [emailSent, setEmailSent] = useState(false)
  const [sending, setSending] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(command)
  }

  const sendEmail = async () => {
    setSending(true)
    try {
      await api.jobs.sendEmail(token, clientId)
      setEmailSent(true)
    } catch (e) {
      alert(e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Bootstrap command</div>
        <p className={styles.modalSub}>
          Paste this command as root on the client's server, or send it by email.
        </p>
        <div className={styles.bootstrapCmd} onClick={copy}>
          {command}
          <span className={styles.copyHint}>click to copy</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Close</button>
          <button className="btn btn-solid" style={{ flex: 1 }} onClick={sendEmail} disabled={sending || emailSent}>
            {emailSent ? '✓ Sent' : sending ? 'Sending…' : `✉ Email to client`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, token, logout } = useAuth()
  const [clients,  setClients]  = useState([])
  const [licences, setLicences] = useState([])
  const [jobs,     setJobs]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showNewClient,  setShowNewClient]  = useState(false)
  const [bootstrapData,  setBootstrapData]  = useState(null)
  const [expandedJob,    setExpandedJob]    = useState(null)
  const [showSettings,   setShowSettings]   = useState(false)

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />
  }

  // ── Data fetching ─────────────────────────────────────────────────────────

  const loadJobs = useCallback(async () => {
    try {
      const j = await api.jobs.list(token)
      setJobs(j)
    } catch {}
  }, [token])

  useEffect(() => {
    Promise.all([
      api.clients.list(token),
      api.licences.list(token),
      api.jobs.list(token),
    ]).then(([c, l, j]) => {
      setClients(c)
      setLicences(l)
      setJobs(j)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [token])

  // Auto-refresh jobs every 5s when there's a pending/running job
  useEffect(() => {
    const hasActive = jobs.some(j => j.status === 'pending' || j.status === 'running')
    if (!hasActive) return
    const id = setInterval(loadJobs, 5000)
    return () => clearInterval(id)
  }, [jobs, loadJobs])

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleBootstrap = async (client) => {
    const data = await api.bootstrap.generate(token, client.id)
    setBootstrapData({ command: data.command, clientId: client.id, clientEmail: client.email })
  }

  const handleRevoke = async (clientId) => {
    const licence = licences.find(l => l.client_id === clientId && l.is_active)
    if (!licence) return alert('No active licence found')
    if (!confirm('Revoke this licence? The client will no longer be able to run states.')) return
    try {
      await api.licences.revoke(token, licence.id)
      setLicences(prev => prev.map(l => l.id === licence.id ? { ...l, is_active: false } : l))
    } catch (e) { alert(e.message) }
  }

  const addJob = (job) => setJobs(prev => [job, ...prev])

  const handleAcceptKey = async (clientId) => {
    try { addJob(await api.jobs.acceptKey(token, clientId)) }
    catch (e) { alert(e.message) }
  }

  const handleHighstate = async (clientId) => {
    try { addJob(await api.jobs.highstate(token, clientId)) }
    catch (e) { alert(e.message) }
  }

  const handlePing = async (clientId) => {
    try { addJob(await api.jobs.ping(token, clientId)) }
    catch (e) { alert(e.message) }
  }

  const handleSendEmail = async (clientId) => {
    await api.jobs.sendEmail(token, clientId)
  }

  // ── Derived stats ─────────────────────────────────────────────────────────

  const activeClients  = clients.filter(c => c.is_active).length
  const activeLicences = licences.filter(l => l.is_active).length
  const revenue = licences
    .filter(l => l.is_active)
    .reduce((sum, l) => {
      const client = clients.find(c => c.id === l.client_id)
      return sum + (PLAN_PRICE[client?.plan] || 0)
    }, 0)

  const lastJobPerClient = jobs.reduce((acc, job) => {
    if (!acc[job.client_id]) acc[job.client_id] = job
    return acc
  }, {})

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLogo}>
          <div className={styles.hex} />
          <span className={styles.brand}>ForgeInfra</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setShowSettings(true)}>Settings</button>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={logout}>Logout</button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Page title */}
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageLabel}>Dashboard</div>
            <h1 className={styles.pageTitle}>Clients & Jobs</h1>
          </div>
          <button className="btn btn-solid" onClick={() => setShowNewClient(true)}>
            + New client
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <StatCard label="Total clients"   value={clients.length} />
          <StatCard label="Active clients"  value={activeClients}  accent />
          <StatCard label="Active licences" value={activeLicences} accent />
          <StatCard label="Revenue / yr"    value={revenue ? `€${revenue.toLocaleString()}` : '—'} />
        </div>

        {/* Clients */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Clients</div>
          {loading ? (
            <div className={styles.empty}>Loading…</div>
          ) : clients.length === 0 ? (
            <div className={styles.empty}>No clients yet — create your first one.</div>
          ) : (
            <div className={styles.list}>
              {clients.map(c => (
                <ClientRow
                  key={c.id}
                  client={c}
                  licence={licences.find(l => l.client_id === c.id && l.is_active)}
                  lastJob={lastJobPerClient[c.id]}
                  onBootstrap={() => handleBootstrap(c)}
                  onRevoke={() => handleRevoke(c.id)}
                  onAcceptKey={() => handleAcceptKey(c.id)}
                  onHighstate={() => handleHighstate(c.id)}
                  onPing={() => handlePing(c.id)}
                  onSendEmail={() => handleSendEmail(c.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Jobs feed */}
        <div className={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className={styles.sectionTitle} style={{ marginBottom: 0 }}>Recent jobs</div>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={loadJobs}
            >
              Refresh
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className={styles.empty}>
              No jobs yet — run a Highstate or Accept Key to get started.
            </div>
          ) : (
            <div className={styles.list}>
              {jobs.slice(0, 50).map(job => {
                const client = clients.find(c => c.id === job.client_id)
                return (
                  <JobRow
                    key={job.id}
                    job={job}
                    clientName={client?.name || job.client_id}
                    expanded={expandedJob === job.id}
                    onToggle={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showNewClient && (
        <NewClientModal
          token={token}
          onClose={() => setShowNewClient(false)}
          onCreated={c => setClients(prev => [...prev, c])}
        />
      )}

      {bootstrapData && (
        <BootstrapModal
          command={bootstrapData.command}
          clientEmail={bootstrapData.clientEmail}
          clientId={bootstrapData.clientId}
          token={token}
          onClose={() => setBootstrapData(null)}
        />
      )}
    </div>
  )
}
