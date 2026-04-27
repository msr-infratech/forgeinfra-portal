import { useEffect, useState } from 'react'
import { useModal } from '../hooks/useModal'
import { useAuth } from '../hooks/useAuth'
import styles from './Modal.module.css'

function Field({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  )
}

function LoginForm({ switchTo }) {
  const { close } = useModal()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true); setError('')
    try {
      await login(email, password)
      close()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className={styles.title}>Sign in</h2>
      <p className={styles.sub}>Welcome back. Access your provisioning dashboard.</p>
      <Field label="Email" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
      <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div className={styles.error}>{error}</div>}
      <button className="btn btn-solid" style={{ width:'100%', padding:'12px', marginTop:4 }} onClick={submit} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in →'}
      </button>
      <div className={styles.divider}>or</div>
      <div className={styles.note}>No account? <span className={styles.link} onClick={() => switchTo('signup')}>Create one</span></div>
    </>
  )
}

function SignupForm({ switchTo }) {
  const { close } = useModal()
  const { register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true); setError('')
    try {
      await register(form.email, form.password, form.full_name)
      close()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const set = k => e => setForm({ ...form, [k]: e.target.value })

  return (
    <>
      <h2 className={styles.title}>Get started</h2>
      <p className={styles.sub}>14-day trial, no credit card required.</p>
      <Field label="Full name" placeholder="Jean Dupont" value={form.full_name} onChange={set('full_name')} />
      <Field label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} />
      <Field label="Password" type="password" placeholder="min. 8 characters" value={form.password} onChange={set('password')} />
      {error && <div className={styles.error}>{error}</div>}
      <button className="btn btn-solid" style={{ width:'100%', padding:'12px', marginTop:4 }} onClick={submit} disabled={loading}>
        {loading ? 'Creating...' : 'Create account →'}
      </button>
      <div className={styles.divider}>or</div>
      <div className={styles.note}>Already have an account? <span className={styles.link} onClick={() => switchTo('login')}>Sign in</span></div>
    </>
  )
}

function ContactForm() {
  return (
    <>
      <h2 className={styles.title}>Talk to sales</h2>
      <p className={styles.sub}>Tell us about your needs. We respond within 24h.</p>
      <Field label="Name" placeholder="Jean Dupont" value="" onChange={() => {}} />
      <Field label="Company email" type="email" placeholder="jean@company.com" value="" onChange={() => {}} />
      <div className={styles.field}>
        <label className={styles.label}>Message</label>
        <textarea className={styles.input} rows={4} placeholder="Describe your use case..." style={{ resize:'vertical' }} />
      </div>
      <button className="btn btn-solid" style={{ width:'100%', padding:'12px', marginTop:4 }}>Send →</button>
    </>
  )
}

export default function Modal() {
  const { modal, open, close } = useModal()

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  if (!modal) return null

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && close()}>
      <div className={styles.box}>
        <button className={styles.close} onClick={close}>✕</button>
        {modal === 'login'   && <LoginForm  switchTo={open} />}
        {modal === 'signup'  && <SignupForm switchTo={open} />}
        {modal === 'contact' && <ContactForm />}
      </div>
    </div>
  )
}
