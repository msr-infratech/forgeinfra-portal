import { useState, useEffect } from 'react'
import { BRAND, NAV_LINKS } from '../config'
import { useModal } from '../hooks/useModal'
import { useTheme } from '../hooks/useTheme'
import styles from './Nav.module.css'

export default function Nav() {
  const { open } = useModal()
  const { dark, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoHex} />
        <span className={styles.logoName}>{BRAND.name}</span>
      </div>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {NAV_LINKS.map(l => (
          <li key={l.href}>
            <a href={l.href} onClick={() => scrollTo(l.href)}>{l.label}</a>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <button className={styles.themeBtn} onClick={toggle} title="Toggle theme">
          {dark ? '◐' : '●'}
        </button>
        <button className="btn btn-ghost" onClick={() => open('login')}>Sign in</button>
        <button className="btn btn-solid" onClick={() => open('signup')}>Get started</button>
        <button className={styles.burger} onClick={() => setMenuOpen(m => !m)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
