import { useEffect } from 'react'
import { useModal } from '../hooks/useModal'
import styles from './Modal.module.css'

function Field({ label, type = 'text', placeholder }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} type={type} placeholder={placeholder} />
    </div>
  )
}

function LoginForm({ switchTo }) {
  const { close } = useModal()
  return (
    <>
      <h2 className={styles.title}>Sign in</h2>
      <p className={styles.sub}>Welcome back. Access your provisioning dashboard.</p>
      <Field label="Email" type="email" placeholder="you@company.com" />
      <Field label="Password" type="password" placeholder="••••••••" />
      <button className="btn btn-solid" style={{ width: '100%', padding: '12px', marginTop: 4 }}>
        Sign in →
      </button>
      <div className={styles.divider}>or</div>
      <p className={styles.note}>
        No account?{' '}
        <span className={styles.link} onClick={() => switchTo('signup')}>Create one</span>
      </p>
    </>
  )
}

function SignupForm({ switchTo }) {
  return (
    <>
      <h2 className={styles.title}>Get started</h2>
      <p className={styles.sub}>14-day trial, no credit card required.</p>
      <Field label="Company" placeholder="Acme Corp" />
      <Field label="Email" type="email" placeholder="you@company.com" />
      <Field label="Password" type="password" placeholder="min. 12 characters" />
      <button className="btn btn-solid" style={{ width: '100%', padding: '12px', marginTop: 4 }}>
        Create account →
      </button>
      <div className={styles.divider}>or</div>
      <p className={styles.note}>
        Already have an account?{' '}
        <span className={styles.link} onClick={() => switchTo('login')}>Sign in</span>
      </p>
    </>
  )
}

function ContactForm() {
  return (
    <>
      <h2 className={styles.title}>Talk to sales</h2>
      <p className={styles.sub}>Tell us about your needs. We respond within 24h.</p>
      <Field label="Name" placeholder="Jean Dupont" />
      <Field label="Company email" type="email" placeholder="jean@company.com" />
      <div className={styles.field}>
        <label className={styles.label}>Message</label>
        <textarea className={styles.input} rows={4} placeholder="Describe your use case..." style={{ resize: 'vertical' }} />
      </div>
      <button className="btn btn-solid" style={{ width: '100%', padding: '12px', marginTop: 4 }}>
        Send →
      </button>
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
