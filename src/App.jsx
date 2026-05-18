import './index.css'
import { ModalProvider } from './hooks/useModal'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Modal from './components/Modal'
import Dashboard from './components/Dashboard'
import { BRAND, STATS, FEATURES, STEPS, PLANS } from './config'
import { useModal } from './hooks/useModal'
import { useEffect, useRef } from 'react'
import s from './sections.module.css'

/* ── SVG Icons for Features ─────────────────────────────────── */
const FEATURE_ICONS = [
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/><polyline points="9 12 11 14 15 10"/>
  </svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  </svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>,
]

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

/* ── Stats ─────────────────────────────────────────────────── */
function Stats() {
  return (
    <div className={s.statsWrap}>
      <div className={s.statsGrid}>
        {STATS.map((st, i) => (
          <div key={i} className={s.statCell}>
            <div className={s.statValue}>{st.value}</div>
            <div className={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Features ───────────────────────────────────────────────── */
function Features() {
  const ref = useRef([])
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = 1
          e.target.style.transform = 'translateY(0)'
        }
      })
    }, { threshold: 0.08 })
    ref.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section" id="features">
      <div className="sec-label">Capabilities</div>
      <h2 className="sec-title">Everything you need to sell infrastructure automation.</h2>
      <p className="sec-lead">Built for managed service providers who want to deliver SaltStack automation to clients — without exposing source code or opening inbound ports.</p>
      <div className={s.featuresGrid}>
        {FEATURES.map((f, i) => (
          <div
            key={i}
            ref={el => ref.current[i] = el}
            className={s.featureCard}
            style={{ opacity: 0, transform: 'translateY(18px)', transition: 'opacity 0.4s ease, transform 0.4s ease, background 0.2s' }}
          >
            <div className={s.featureIcon}>{FEATURE_ICONS[i]}</div>
            <div className={s.featureTitle}>{f.title}</div>
            <div className={s.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  return (
    <div className={s.howWrap}>
      <div className={s.howInner} id="how">
        <div className="sec-label">Workflow</div>
        <h2 className="sec-title">From signup to production in 4 steps.</h2>
        <p className="sec-lead">No infrastructure to expose on your side. No SSH access required. Your client runs one command and everything configures automatically.</p>
        <div className={s.stepsGrid}>
          {STEPS.map((st, i) => (
            <div key={i} className={s.stepCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div className={s.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <span className={s.stepTag}>{st.num.split(' / ')[1]}</span>
              </div>
              <div className={s.stepTitle}>{st.title}</div>
              <div className={s.stepDesc}>{st.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Pricing ────────────────────────────────────────────────── */
function Pricing() {
  const { open } = useModal()
  return (
    <section className="section" id="pricing">
      <div className="sec-label">Pricing</div>
      <h2 className="sec-title">Transparent, licence-based pricing.</h2>
      <p className="sec-lead">One licence per client. Pay per client per year, regardless of how many servers they run under that licence tier.</p>
      <div className={s.pricingGrid}>
        {PLANS.map((p, i) => (
          <div key={i} className={`${s.pricingCard} ${p.hot ? s.pricingCardHot : ''}`}>
            {p.hot && <div className={s.popularBadge}>Popular</div>}
            <div className={s.pricingTier}>{p.tier}</div>
            <div className={s.pricingPrice}>{p.price}</div>
            <div className={s.pricingPeriod}>{p.period}</div>
            <ul className={s.pricingFeatures}>
              {p.features.map((f, j) => (
                <li key={j} className={s.pricingFeature}>
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`btn btn-${p.ctaStyle}`}
              style={{ width: '100%', padding: 12 }}
              onClick={() => open(i === 2 ? 'contact' : 'signup')}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── CTA ────────────────────────────────────────────────────── */
function CTA() {
  const { open } = useModal()
  const copy = () => {
    navigator.clipboard.writeText(`curl -fsSL https://${BRAND.domain}/bootstrap/demo | bash`)
    const t = document.createElement('div')
    t.textContent = 'Command copied'
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--bg-card);border:1px solid var(--accent);border-radius:6px;padding:12px 18px;font-family:var(--ff-d);font-size:13px;color:var(--accent);z-index:9999;font-weight:500'
    document.body.appendChild(t)
    setTimeout(() => t.remove(), 2400)
  }

  return (
    <section className={s.ctaSection}>
      <div className={s.ctaGlow} />
      <div className={s.ctaInner}>
        <div className={s.ctaLabel}>Get started</div>
        <h2 className={s.ctaTitle}>Provision your first client today.</h2>
        <p className={s.ctaSub}>No infrastructure to expose. No ports to open. Your client pastes one command — and their servers are managed.</p>
        <div className={s.ctaCmd} onClick={copy}>
          curl -fsSL https://{BRAND.domain}/bootstrap/demo | bash
          <span className={s.ctaCmdHint}>click to copy</span>
        </div>
        <div className={s.ctaActions}>
          <button className="btn btn-solid" style={{ padding: '13px 36px', fontSize: 14 }} onClick={() => open('signup')}>
            Start free 14-day trial
          </button>
          <a href="#docs" className="btn btn-ghost" style={{ padding: '13px 36px', fontSize: 14 }}>
            Read the docs →
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */
function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Docs', 'Changelog'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal:   ['Privacy', 'Terms', 'Security'],
  }
  return (
    <footer className={s.footerWrap}>
      <div className={s.footerInner}>
        <div className={s.footerGrid}>
          <div>
            <div className={s.footerBrand}>
              <div className={s.footerHex} />
              <span className={s.footerBrandName}>{BRAND.name}</span>
            </div>
            <p className={s.footerTagline}>Infrastructure provisioning, automated and delivered as a managed service.</p>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div className={s.footerGroupTitle}>{group}</div>
              <ul className={s.footerLinks}>
                {items.map(l => (
                  <li key={l}><a href="#" className={s.footerLink}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={s.footerBottom}>
          <span className={s.footerCopy}>© 2025 {BRAND.name}. All rights reserved.</span>
          <a href={`mailto:${BRAND.email}`} className={s.footerEmail}>{BRAND.email}</a>
        </div>
      </div>
    </footer>
  )
}

/* ── Landing ────────────────────────────────────────────────── */
function LandingPage() {
  useTheme()
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
      <Modal />
    </>
  )
}

function AppInner() {
  const { user, loading } = useAuth()
  useTheme()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: 14, color: 'var(--tx-3)' }}>
      Loading...
    </div>
  )

  if (user) return <Dashboard />

  return (
    <ModalProvider>
      <LandingPage />
    </ModalProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
