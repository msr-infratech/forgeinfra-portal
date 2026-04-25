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
          <span>Salt-powered · Zero inbound ports</span>
        </div>

        <h1 className={styles.title}>
          Provision.<br />
          <span className={styles.accent}>{BRAND.name}.</span><br />
          Ship.
        </h1>

        <p className={styles.sub}>
          Deploy and manage infrastructure at scale with SaltStack —
          fully licensed, code never leaves your cloud, zero ports to expose.
        </p>

        <div className={styles.actions}>
          <button className="btn btn-solid" onClick={() => open('signup')}>
            Start free trial
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' })}
          >
            How it works →
          </button>
        </div>
      </div>

      <div className={styles.right}>
        <Terminal />
      </div>
    </section>
  )
}
