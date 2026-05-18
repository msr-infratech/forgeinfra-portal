import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import styles from './Dashboard.module.css'

const JOB_STATUS_COLOR = {
  pending: 'var(--tx-3)',
  running: 'var(--accent)',
  success: '#22c55e',
  failed:  '#ef4444',
}

const JOB_TYPE_LABEL = {
  highstate:  'Highstate',
  accept_key: 'Accept Key',
  test_ping:  'Ping',
}

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

function StatusBadge({ status }) {
  const color = JOB_STATUS_COLOR[status] || 'var(--tx-3)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, color,
      background: `${color}18`, border: `1px solid ${color}30`,
      padding: '2px 8px', borderRadius: 20,
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color,
        animation: status === 'running' ? 'pulse 1.2s infinite' : 'none',
      }} />
      {status}
    </span>
  )
}

function InfoCard({ label, value, accent, sub }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--tx)', letterSpacing: '-0.02em', fontFamily: 'var(--ff-m)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--tx-2)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function ChangePasswordModal({ token, onClose }) {
  const [form, setForm] = useState({ current_password: '', new_password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async () => {
    if (form.new_password.length < 8) { setError('Au moins 8 caractères'); return }
    setLoading(true); setError('')
    try {
      await api.admin.updateProfile(token, {
        current_password: form.current_password,
        new_password: form.new_password,
      })
      setSuccess(true)
      setTimeout(onClose, 1500)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Changer le mot de passe</div>
        {success ? (
          <div style={{ color: '#22c55e', fontSize: 14, padding: '12px 0' }}>✓ Mot de passe mis à jour !</div>
        ) : (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Mot de passe actuel</label>
              <input className={styles.input} type="password" value={form.current_password}
                onChange={e => setForm(f => ({ ...f, current_password: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Nouveau mot de passe</label>
              <input className={styles.input} type="password" value={form.new_password}
                onChange={e => setForm(f => ({ ...f, new_password: e.target.value }))} placeholder="Min. 8 caractères" />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
              <button className="btn btn-solid" style={{ flex: 1 }} onClick={submit} disabled={loading}>
                {loading ? '…' : 'Confirmer'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ClientPortal() {
  const { user, token, logout } = useAuth()
  const [data,       setData]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [expandedJob, setExpandedJob] = useState(null)
  const [showPwModal, setShowPwModal] = useState(false)
  const [copied,     setCopied]     = useState(false)

  const load = useCallback(async () => {
    try {
      const d = await api.client.dashboard(token)
      setData(d)
    } catch {}
  }, [token])

  useEffect(() => { load().finally(() => setLoading(false)) }, [load])

  // Auto-refresh si job actif
  useEffect(() => {
    if (!data) return
    const hasActive = data.jobs?.some(j => j.status === 'pending' || j.status === 'running')
    if (!hasActive) return
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [data, load])

  const copyCommand = () => {
    if (!data?.bootstrap_command) return
    navigator.clipboard.writeText(data.bootstrap_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--tx-3)', fontSize: 14 }}>
      Chargement…
    </div>
  )

  const { client, licence, bootstrap_command, jobs } = data || {}

  const daysLeft = licence
    ? Math.max(0, Math.floor((new Date(licence.expires_at) - Date.now()) / 86400000))
    : null

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
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setShowPwModal(true)}>Profil</button>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={logout}>Déconnexion</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <div className={styles.pageLabel}>Mon espace</div>
            <h1 className={styles.pageTitle}>{client?.company || client?.name}</h1>
          </div>
        </div>

        {/* Licence info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 24 }}>
          <InfoCard label="Plan" value={licence?.plan || '—'} accent />
          <InfoCard label="Noeuds max" value={licence?.max_nodes ?? '—'} />
          <InfoCard label="Statut" value={licence?.is_active ? 'Active' : 'Inactive'} accent={licence?.is_active} />
          <InfoCard
            label="Expiration"
            value={daysLeft !== null ? `J-${daysLeft}` : '—'}
            sub={licence ? new Date(licence.expires_at).toLocaleDateString('fr-FR') : null}
            accent={daysLeft !== null && daysLeft > 30}
          />
        </div>

        {/* Bootstrap command */}
        {bootstrap_command && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Commande bootstrap</div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 24px' }}>
              <p style={{ fontSize: 13, color: 'var(--tx-2)', marginBottom: 14 }}>
                Colle cette commande en <code style={{ background: 'var(--bg-2)', padding: '1px 6px', borderRadius: 4 }}>root</code> sur ton serveur pour installer le Salt Minion :
              </p>
              <div
                onClick={copyCommand}
                style={{ background: 'var(--bg-2)', border: '1px solid var(--border-h)', borderRadius: 'var(--r)', padding: '14px 18px', fontFamily: 'var(--ff-m)', fontSize: 13, color: 'var(--accent)', cursor: 'pointer', wordBreak: 'break-all', lineHeight: 1.8, transition: 'all 0.2s' }}
              >
                {bootstrap_command}
                <span style={{ display: 'block', fontSize: 10, color: 'var(--tx-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8, fontFamily: 'var(--ff-d)', fontWeight: 500 }}>
                  {copied ? '✓ Copié !' : 'Cliquer pour copier'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Infos supplémentaires */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Informations</div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            {[
              ['Email', client?.email],
              ['Branche pillar', client?.gitea_branch || '—'],
              ['Client ID', client?.id],
              ['Membre depuis', client ? new Date(client.created_at).toLocaleDateString('fr-FR') : '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 20px', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: 'var(--tx-3)', fontWeight: 600, minWidth: 140, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>{label}</span>
                <span style={{ color: 'var(--tx)', fontFamily: label === 'Client ID' || label === 'Branche pillar' ? 'var(--ff-m)' : 'inherit', fontSize: label === 'Client ID' ? 11 : 13 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs history */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Historique des déploiements</div>
          {!jobs || jobs.length === 0 ? (
            <div className={styles.empty}>Aucun job pour l'instant.</div>
          ) : (
            <div className={styles.list}>
              {jobs.map(job => {
                let resultObj = null
                if (job.result) { try { resultObj = JSON.parse(job.result) } catch {} }
                const expanded = expandedJob === job.id
                return (
                  <div key={job.id} className={styles.jobRow}>
                    <div className={styles.jobMain}
                      onClick={() => resultObj && setExpandedJob(expanded ? null : job.id)}
                      style={{ cursor: resultObj ? 'pointer' : 'default' }}
                    >
                      <StatusBadge status={job.status} />
                      <span className={styles.jobType}>{JOB_TYPE_LABEL[job.type] || job.type}</span>
                      <span className={styles.jobTime}>{timeAgo(job.created_at)}</span>
                      {resultObj && (
                        <span style={{ fontSize: 11, color: 'var(--tx-3)', marginLeft: 'auto' }}>
                          {expanded ? '▲ masquer' : '▼ détails'}
                        </span>
                      )}
                    </div>
                    {expanded && resultObj && (
                      <pre className={styles.jobResult}>{JSON.stringify(resultObj, null, 2)}</pre>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showPwModal && <ChangePasswordModal token={token} onClose={() => setShowPwModal(false)} />}
    </div>
  )
}
