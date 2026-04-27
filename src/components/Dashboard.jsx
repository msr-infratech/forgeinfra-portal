import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import styles from './Dashboard.module.css'

function StatCard({ label, value, accent }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue} style={accent ? { color: 'var(--accent)' } : {}}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

function ClientRow({ client, token, onRevoke, onBootstrap }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowMain}>
        <div className={styles.rowName}>{client.name}</div>
        <div className={styles.rowMeta}>{client.email} · <span className={styles.plan}>{client.plan}</span></div>
      </div>
      <div className={styles.rowStatus}>
        <span className={client.is_active ? styles.active : styles.inactive}>
          {client.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className={styles.rowActions}>
        <button className="btn btn-ghost" onClick={() => onBootstrap(client.id)}>Bootstrap</button>
        <button className="btn btn-ghost" style={{ color: '#ff5f57', borderColor: '#ff5f57' }}
          onClick={() => onRevoke(client.id)}>Revoke</button>
      </div>
    </div>
  )
}

function NewClientModal({ token, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', plan: 'starter' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const client = await api.clients.create(token, form)
      // Créer licence automatiquement
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
            <option value="business">Business — €1,490/yr · 100 nodes</option>
            <option value="enterprise">Enterprise — Custom</option>
          </select>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className="btn btn-solid" style={{ width: '100%', padding: 12 }}
          onClick={submit} disabled={loading}>
          {loading ? 'Creating...' : 'Create client + licence →'}
        </button>
      </div>
    </div>
  )
}

function BootstrapModal({ command, onClose }) {
  const copy = () => navigator.clipboard.writeText(command)
  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Bootstrap command</div>
        <p className={styles.modalSub}>Envoie cette commande au client — il la colle en root sur son serveur.</p>
        <div className={styles.bootstrapCmd} onClick={copy}>
          {command}
          <span className={styles.copyHint}>click to copy</span>
        </div>
        <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, token, logout } = useAuth()
  const [clients, setClients] = useState([])
  const [licences, setLicences] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNewClient, setShowNewClient] = useState(false)
  const [bootstrapCmd, setBootstrapCmd] = useState('')

  useEffect(() => {
    Promise.all([
      api.clients.list(token),
      api.licences.list(token),
    ]).then(([c, l]) => {
      setClients(c)
      setLicences(l)
    }).finally(() => setLoading(false))
  }, [token])

  const handleBootstrap = async (clientId) => {
    const data = await api.bootstrap.generate(token, clientId)
    setBootstrapCmd(data.command)
  }

  const handleRevoke = async (clientId) => {
    const licence = licences.find(l => l.client_id === clientId && l.is_active)
    if (!licence) return alert('No active licence found')
    if (!confirm('Revoke this licence?')) return
    await api.licences.revoke(token, licence.id)
    setLicences(prev => prev.map(l => l.id === licence.id ? { ...l, is_active: false } : l))
  }

  const activeClients = clients.filter(c => c.is_active).length
  const activeLicences = licences.filter(l => l.is_active).length

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
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Page title */}
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageLabel}>// dashboard</div>
            <h1 className={styles.pageTitle}>Clients & Licences</h1>
          </div>
          <button className="btn btn-solid" onClick={() => setShowNewClient(true)}>
            + New client
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <StatCard label="Total clients" value={clients.length} />
          <StatCard label="Active clients" value={activeClients} accent />
          <StatCard label="Active licences" value={activeLicences} accent />
          <StatCard label="Revenue / yr" value={`€${activeLicences * 490}`} />
        </div>

        {/* Clients list */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Clients</div>
          {loading ? (
            <div className={styles.empty}>Loading...</div>
          ) : clients.length === 0 ? (
            <div className={styles.empty}>No clients yet — create your first one.</div>
          ) : (
            <div className={styles.list}>
              {clients.map(c => (
                <ClientRow key={c.id} client={c} token={token}
                  onBootstrap={handleBootstrap} onRevoke={handleRevoke} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showNewClient && (
        <NewClientModal token={token} onClose={() => setShowNewClient(false)}
          onCreated={c => setClients(prev => [...prev, c])} />
      )}
      {bootstrapCmd && (
        <BootstrapModal command={bootstrapCmd} onClose={() => setBootstrapCmd('')} />
      )}
    </div>
  )
}
