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

/* ── Stats ─────────────────────────────────────────────────── */
function Stats() {
  return (
    <div style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--bg-2)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
        {STATS.map((s,i) => (
          <div key={i} style={{ padding:'32px 36px', borderRight: i<3 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontFamily:'var(--ff-m)', fontSize:30, fontWeight:700, color:'var(--accent)', letterSpacing:'-0.02em' }}>{s.value}</div>
            <div style={{ fontSize:13, color:'var(--tx-2)', marginTop:6, fontWeight:500 }}>{s.label}</div>
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
      entries.forEach(e => { if(e.isIntersecting) { e.target.style.opacity=1; e.target.style.transform='translateY(0)' } })
    }, { threshold: 0.08 })
    ref.current.forEach(el => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section" id="features">
      <div className="sec-label">Capabilities</div>
      <h2 className="sec-title">Everything you need to sell infrastructure automation.</h2>
      <p className="sec-lead">Built for managed service providers who want to deliver SaltStack automation to clients — without exposing source code or opening inbound ports.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--border)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
        {FEATURES.map((f,i) => (
          <div key={i} ref={el => ref.current[i] = el}
            style={{ background:'var(--bg-card)', padding:32, opacity:0, transform:'translateY(18px)', transition:'opacity 0.4s ease, transform 0.4s ease, background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--bg-card-h)'}
            onMouseLeave={e => e.currentTarget.style.background='var(--bg-card)'}>
            <div style={{ width:40, height:40, borderRadius:'var(--r)', background:'var(--accent-dim)', border:'1px solid var(--border-h)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent)', marginBottom:20 }}>
              {FEATURE_ICONS[i]}
            </div>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:10, lineHeight:1.3 }}>{f.title}</div>
            <div style={{ fontSize:14, color:'var(--tx-2)', lineHeight:1.75 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  return (
    <div id="how" style={{ background:'var(--bg-2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(72px,9vh,112px) clamp(20px,5vw,60px)' }}>
        <div className="sec-label">Workflow</div>
        <h2 className="sec-title">From signup to production in 4 steps.</h2>
        <p className="sec-lead">No infrastructure to expose on your side. No SSH access required. Your client runs one command and everything configures automatically.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:1, background:'var(--border)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
          {STEPS.map((s,i) => (
            <div key={i} style={{ padding:32, background:'var(--bg-card)', position:'relative' }}>
              <div style={{ fontFamily:'var(--ff-m)', fontSize:11, color:'var(--accent)', letterSpacing:'0.08em', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:'50%', background:'var(--accent-dim)', border:'1px solid var(--border-h)', fontWeight:700, fontSize:12 }}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ color:'var(--tx-3)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.num.split(' / ')[1]}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:10, lineHeight:1.3 }}>{s.title}</div>
              <div style={{ fontSize:14, color:'var(--tx-2)', lineHeight:1.75 }}>{s.desc}</div>
              {i < 3 && (
                <div style={{ position:'absolute', right:-10, top:'50%', transform:'translateY(-50%)', width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--tx-3)', zIndex:1, fontSize:16 }}>›</div>
              )}
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
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
        {PLANS.map((p,i) => (
          <div key={i} style={{
            background:'var(--bg-card)',
            borderRadius:'var(--r-lg)',
            padding:36,
            position:'relative',
            overflow:'hidden',
            border: p.hot ? '1px solid var(--accent)' : '1px solid var(--border)',
            boxShadow: p.hot ? '0 0 32px var(--accent-glow)' : 'none',
            display:'flex', flexDirection:'column',
          }}>
            {p.hot && (
              <div style={{ position:'absolute', top:14, right:-22, background:'var(--accent)', color:'#07090f', fontFamily:'var(--ff-d)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', padding:'4px 32px', transform:'rotate(45deg)', textTransform:'uppercase' }}>Popular</div>
            )}
            <div style={{ fontSize:12, fontWeight:600, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:14 }}>{p.tier}</div>
            <div style={{ fontFamily:'var(--ff-d)', fontSize:44, fontWeight:800, letterSpacing:'-0.03em', lineHeight:1 }}>{p.price}</div>
            <div style={{ fontSize:13, color:'var(--tx-2)', marginBottom:28, marginTop:6 }}>{p.period}</div>
            <ul style={{ listStyle:'none', marginBottom:32, flex:1 }}>
              {p.features.map((f,j) => (
                <li key={j} style={{ fontSize:14, color:'var(--tx-2)', padding:'9px 0', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'flex-start', gap:10, lineHeight:1.5 }}>
                  <svg style={{ color:'var(--accent)', flexShrink:0, marginTop:2 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`btn btn-${p.ctaStyle}`} style={{ width:'100%', padding:12 }} onClick={() => open(i === 2 ? 'contact' : 'signup')}>{p.cta}</button>
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
    <section style={{ textAlign:'center', padding:'clamp(80px,10vh,120px) clamp(20px,5vw,60px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:300, background:'radial-gradient(ellipse, var(--accent-glow), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'relative' }}>
        <div className="sec-label" style={{ justifyContent:'center' }}>Get started</div>
        <h2 style={{ fontSize:'clamp(28px,4.5vw,52px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:16, lineHeight:1.1 }}>Provision your first client today.</h2>
        <p style={{ fontSize:17, color:'var(--tx-2)', marginBottom:40, lineHeight:1.7, maxWidth:500, margin:'0 auto 40px' }}>No infrastructure to expose. No ports to open. Your client pastes one command — and their servers are managed.</p>
        <div onClick={copy} style={{ display:'inline-block', background:'var(--bg-card)', border:'1px solid var(--border-h)', borderRadius:'var(--r)', padding:'14px 28px', fontFamily:'var(--ff-m)', fontSize:13, color:'var(--accent)', cursor:'pointer', marginBottom:36 }}>
          curl -fsSL https://{BRAND.domain}/bootstrap/demo | bash
          <span style={{ display:'block', fontSize:11, color:'var(--tx-3)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:6, fontFamily:'var(--ff-d)', fontWeight:500 }}>click to copy</span>
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn btn-solid" style={{ padding:'13px 36px', fontSize:14 }} onClick={() => open('signup')}>Start free 14-day trial</button>
          <a href="#docs" className="btn btn-ghost" style={{ padding:'13px 36px', fontSize:14 }}>Read the docs →</a>
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
    <footer style={{ borderTop:'1px solid var(--border)', background:'var(--bg-2)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(40px,6vh,64px) clamp(20px,5vw,60px)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:24, height:24, background:'var(--accent)', clipPath:'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
              <span style={{ fontFamily:'var(--ff-m)', fontSize:13, fontWeight:700, color:'var(--accent)', letterSpacing:'0.04em' }}>{BRAND.name}</span>
            </div>
            <p style={{ fontSize:14, color:'var(--tx-2)', lineHeight:1.7, maxWidth:260 }}>Infrastructure provisioning, automated and delivered as a managed service.</p>
          </div>
          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontSize:12, fontWeight:700, color:'var(--tx)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>{group}</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10 }}>
                {items.map(l => (
                  <li key={l}><a href="#" style={{ fontSize:14, color:'var(--tx-2)', transition:'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color='var(--accent)'}
                    onMouseLeave={e => e.target.style.color='var(--tx-2)'}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontSize:13, color:'var(--tx-3)' }}>© 2025 {BRAND.name}. All rights reserved.</span>
          <span style={{ fontSize:13, color:'var(--tx-3)' }}><a href={`mailto:${BRAND.email}`} style={{ color:'var(--tx-2)' }}>{BRAND.email}</a></span>
        </div>
      </div>
    </footer>
  )
}

/* ── Landing Page ───────────────────────────────────────────── */
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
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontSize:14, color:'var(--tx-3)' }}>
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
