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

function Stats() {
  return (
    <div style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--bg-2)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
        {STATS.map((s,i) => (
          <div key={i} style={{ padding:'28px 32px', borderRight: i<3 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontFamily:'var(--ff-m)', fontSize:28, fontWeight:700, color:'var(--accent)' }}>{s.value}</div>
            <div style={{ fontFamily:'var(--ff-m)', fontSize:10, color:'var(--tx-3)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
      <div className="sec-label">// capabilities</div>
      <h2 className="sec-title">Everything you need to sell infrastructure automation.</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--border)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
        {FEATURES.map((f,i) => (
          <div key={i} ref={el => ref.current[i] = el}
            style={{ background:'var(--bg-card)', padding:32, opacity:0, transform:'translateY(18px)', transition:'opacity 0.4s ease, transform 0.4s ease, background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--bg-card-h)'}
            onMouseLeave={e => e.currentTarget.style.background='var(--bg-card)'}>
            <span style={{ fontSize:20, display:'block', marginBottom:16 }}>{f.icon}</span>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>{f.title}</div>
            <div style={{ fontFamily:'var(--ff-m)', fontSize:11, color:'var(--tx-2)', lineHeight:1.9 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <div id="how" style={{ background:'var(--bg-2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(60px,8vh,100px) clamp(16px,4vw,48px)' }}>
        <div className="sec-label">// workflow</div>
        <h2 className="sec-title">From signup to production in 4 steps.</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {STEPS.map((s,i) => (
            <div key={i} style={{ padding:32, borderRight: i<3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontFamily:'var(--ff-m)', fontSize:10, color:'var(--accent)', letterSpacing:'0.1em', marginBottom:16 }}>{s.num}</div>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:10, lineHeight:1.3 }}>{s.title}</div>
              <div style={{ fontFamily:'var(--ff-m)', fontSize:11, color:'var(--tx-2)', lineHeight:1.9 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Pricing() {
  const { open } = useModal()
  return (
    <section className="section" id="pricing">
      <div className="sec-label">// pricing</div>
      <h2 className="sec-title">Transparent, licence-based pricing.</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
        {PLANS.map((p,i) => (
          <div key={i} style={{ background:'var(--bg-card)', borderRadius:'var(--r-lg)', padding:36, position:'relative', overflow:'hidden', border: p.hot ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
            {p.hot && <div style={{ position:'absolute', top:14, right:-20, background:'var(--accent)', color:'#07090f', fontFamily:'var(--ff-m)', fontSize:8, fontWeight:700, letterSpacing:'0.1em', padding:'3px 28px', transform:'rotate(45deg)' }}>POPULAR</div>}
            <div style={{ fontFamily:'var(--ff-m)', fontSize:10, color:'var(--accent)', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:12 }}>{p.tier}</div>
            <div style={{ fontFamily:'var(--ff-d)', fontSize:44, fontWeight:800, letterSpacing:'-0.03em', lineHeight:1 }}>{p.price}</div>
            <div style={{ fontFamily:'var(--ff-m)', fontSize:11, color:'var(--tx-2)', marginBottom:28 }}>{p.period}</div>
            <ul style={{ listStyle:'none', marginBottom:28 }}>
              {p.features.map((f,j) => <li key={j} style={{ fontFamily:'var(--ff-m)', fontSize:11, color:'var(--tx-2)', padding:'7px 0', borderBottom:'1px solid var(--border)', display:'flex', gap:8 }}><span style={{ color:'var(--accent)' }}>→</span>{f}</li>)}
            </ul>
            <button className={`btn btn-${p.ctaStyle}`} style={{ width:'100%', padding:11 }} onClick={() => open(i === 2 ? 'contact' : 'signup')}>{p.cta}</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function CTA() {
  const { open } = useModal()
  const copy = () => {
    navigator.clipboard.writeText(`curl -fsSL https://${BRAND.domain}/bootstrap/demo | bash`)
    const t = document.createElement('div')
    t.textContent = 'Command copied ✓'
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--bg-card);border:1px solid var(--accent);border-radius:6px;padding:12px 18px;font-family:var(--ff-m);font-size:11px;color:var(--accent);z-index:9999'
    document.body.appendChild(t)
    setTimeout(() => t.remove(), 2400)
  }
  return (
    <section style={{ textAlign:'center', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:500, height:260, background:'radial-gradient(ellipse, var(--accent-glow), transparent 70%)', pointerEvents:'none' }} />
      <h2 style={{ fontSize:'clamp(32px,5vw,60px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:16, position:'relative' }}>Provision your first client today.</h2>
      <p style={{ fontFamily:'var(--ff-m)', fontSize:13, color:'var(--tx-2)', marginBottom:36, position:'relative' }}>No infrastructure to expose. No ports to open. Just one command.</p>
      <div onClick={copy} style={{ display:'inline-block', background:'var(--bg-card)', border:'1px solid var(--border-h)', borderRadius:'var(--r)', padding:'14px 28px', fontFamily:'var(--ff-m)', fontSize:13, color:'var(--accent)', cursor:'pointer', marginBottom:36, position:'relative' }}>
        curl -fsSL https://{BRAND.domain}/bootstrap/demo | bash
        <span style={{ display:'block', fontSize:9, color:'var(--tx-3)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>click to copy</span>
      </div>
      <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', position:'relative' }}>
        <button className="btn btn-solid" style={{ padding:'14px 36px', fontSize:12 }} onClick={() => open('signup')}>Start free 14-day trial</button>
        <a href="#docs" className="btn btn-ghost" style={{ padding:'14px 36px', fontSize:12 }}>Read the docs →</a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--border)', background:'var(--bg-2)', padding:'clamp(24px,4vh,40px) clamp(16px,4vw,48px)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ fontFamily:'var(--ff-m)', fontSize:10, color:'var(--tx-3)' }}>© 2025 {BRAND.name}. Infrastructure automation platform.</div>
        <div style={{ display:'flex', gap:20 }}>
          {['Docs','Status','Privacy','Terms','Contact'].map(l => (
            <a key={l} href="#" style={{ fontFamily:'var(--ff-m)', fontSize:10, color:'var(--tx-3)', textDecoration:'none' }}
              onMouseEnter={e => e.target.style.color='var(--accent)'}
              onMouseLeave={e => e.target.style.color='var(--tx-3)'}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

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
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'var(--ff-m)', fontSize:12, color:'var(--tx-3)' }}>
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
