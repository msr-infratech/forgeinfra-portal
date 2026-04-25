import { BRAND } from '../config'
import styles from './Terminal.module.css'

const LINES = [
  { type: 'comment', text: '# One command, your infra is provisioned' },
  { type: 'cmd',     text: `curl -fsSL https://${BRAND.domain}/bootstrap/t0k3n | bash` },
  { type: 'out',     text: '→ Verifying licence token...' },
  { type: 'ok',      text: '✓ Licence valid · client_alpha · exp 2027-01-31' },
  { type: 'out',     text: '→ Installing Salt Minion...' },
  { type: 'ok',      text: `✓ Minion configured → api.${BRAND.domain}:443` },
  { type: 'out',     text: '→ Running state.highstate...' },
  { type: 'ok',      text: '✓ 42 states applied. 0 errors. Ready.' },
]

export default function Terminal() {
  return (
    <div className={styles.terminal}>
      <div className={styles.bar}>
        <span className={`${styles.dot} ${styles.r}`} />
        <span className={`${styles.dot} ${styles.y}`} />
        <span className={`${styles.dot} ${styles.g}`} />
        <span className={styles.title}>bootstrap — client onboarding</span>
      </div>
      <div className={styles.body}>
        {LINES.map((l, i) => (
          <div
            key={i}
            className={`${styles.line} ${styles[l.type]}`}
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            {l.type === 'cmd' && <span className={styles.prompt}>$ </span>}
            {l.text}
          </div>
        ))}
        <div className={`${styles.line} ${styles.cmd}`}>
          <span className={styles.prompt}>$ </span>
          <span className={styles.cursor} />
        </div>
      </div>
    </div>
  )
}
