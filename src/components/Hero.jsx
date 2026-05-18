import { BRAND } from '../config'
import { useModal } from '../hooks/useModal'
import Terminal from './Terminal'
import styles from './Hero.module.css'

export default function Hero() {
  const { open } = useModal()

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          <span>SaltStack-powered · Zero inbound ports</span>
        </div>

        <h1 className={styles.title}>
          Provision client infrastructure{' '}
          <span className={styles.accent}>at scale.</span>
        </h1>

        <p className={styles.sub}>
          Package your SaltStack automation as a licensed managed service.
          One command onboards any client — their servers are configured,
          your code never leaves your cloud.
        </p>

        <div className={styles.actions}>
          <button className="btn btn-solid" style={{ padding:'13px 32px' }} onClick={() => open('signup')}>
            Start free trial
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding:'13px 32px' }}
            onClick={() => document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' })}
          >
            How it works →
          </button>
        </div>

        <div className={styles.trust}>
          {['No credit card required', '14-day free trial', 'Cancel anytime'].map(t => (
            <span key={t} className={styles.trustItem}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <Terminal />
      </div>
    </section>
  )
}
