/* ── Layout ── */
.dashboard {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(16px, 4vw, 48px);
  height: 58px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
}

.headerLogo { display: flex; align-items: center; gap: 10px; }

.hex {
  width: 22px; height: 22px;
  background: var(--accent);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.brand {
  font-family: var(--ff-m);
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.04em;
}

.headerRight { display: flex; align-items: center; gap: 12px; }

.userEmail {
  font-family: var(--ff-m);
  font-size: 11px;
  color: var(--tx-2);
}

/* ── Content ── */
.content {
  padding: clamp(24px, 4vw, 48px);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* ── Page header ── */
.pageHeader {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.pageLabel {
  font-family: var(--ff-m);
  font-size: 10px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 6px;
}

.pageTitle {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800;
  letter-spacing: -0.025em;
}

/* ── Stats ── */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-bottom: 32px;
}

@media (max-width: 640px) { .stats { grid-template-columns: repeat(2, 1fr); } }

.statCard {
  background: var(--bg-card);
  padding: 24px;
  transition: background 0.2s;
}

.statCard:hover { background: var(--bg-card-h); }

.statValue {
  font-family: var(--ff-m);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.statLabel {
  font-family: var(--ff-m);
  font-size: 10px;
  color: var(--tx-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── Section ── */
.section { margin-bottom: 32px; }

.sectionTitle {
  font-family: var(--ff-m);
  font-size: 10px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 16px;
}

.list {
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.empty {
  font-family: var(--ff-m);
  font-size: 12px;
  color: var(--tx-3);
  padding: 48px;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
}

/* ── Row ── */
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
  flex-wrap: wrap;
}

.row:last-child { border-bottom: none; }
.row:hover { background: var(--bg-card-h); }

.rowMain { flex: 1; min-width: 0; }

.rowName {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
}

.rowMeta {
  font-family: var(--ff-m);
  font-size: 11px;
  color: var(--tx-2);
}

.plan {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.active {
  font-family: var(--ff-m);
  font-size: 10px;
  color: var(--accent);
  background: var(--accent-dim);
  padding: 3px 8px;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.inactive {
  font-family: var(--ff-m);
  font-size: 10px;
  color: var(--tx-3);
  background: var(--border);
  padding: 3px 8px;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.rowActions { display: flex; gap: 8px; }

/* ── Modal ── */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(7,9,15,0.85);
  backdrop-filter: blur(10px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeUp 0.2s ease;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border-h);
  border-radius: var(--r-lg);
  padding: clamp(28px, 4vw, 44px);
  width: 100%;
  max-width: 420px;
}

.modalTitle {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 6px;
}

.modalSub {
  font-family: var(--ff-m);
  font-size: 11px;
  color: var(--tx-2);
  margin-bottom: 24px;
  line-height: 1.7;
}

.field { margin-bottom: 16px; }

.label {
  display: block;
  font-family: var(--ff-m);
  font-size: 10px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 10px 14px;
  font-family: var(--ff-m);
  font-size: 12px;
  color: var(--tx);
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

.error {
  font-family: var(--ff-m);
  font-size: 11px;
  color: #ff5f57;
  margin-bottom: 12px;
}

.bootstrapCmd {
  background: var(--bg-2);
  border: 1px solid var(--border-h);
  border-radius: var(--r);
  padding: 16px;
  font-family: var(--ff-m);
  font-size: 11px;
  color: var(--accent);
  cursor: pointer;
  margin-bottom: 16px;
  word-break: break-all;
  line-height: 1.8;
  transition: all 0.2s;
}

.bootstrapCmd:hover { border-color: var(--accent); }

.copyHint {
  display: block;
  font-size: 9px;
  color: var(--tx-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 8px;
}