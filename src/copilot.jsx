// copilot.jsx — "copy a prompt to Copilot" application exercise (lesson-level).
import React from 'react'
import { Icon, Button, Card } from './ui.jsx'
const { useState } = React

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
  }
  return Promise.resolve(fallbackCopy(text))
}
function fallbackCopy(text) {
  try {
    const ta = document.createElement("textarea")
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"
    document.body.appendChild(ta); ta.focus(); ta.select()
    document.execCommand("copy"); document.body.removeChild(ta)
  } catch (e) { /* ignore */ }
}

function CopilotExercise({ ex, onBack, onComplete, alreadyDone }) {
  const [copied, setCopied] = useState(false)
  const [refl, setRefl] = useState({})
  const doCopy = () => { copyText(ex.prompt); setCopied(true); setTimeout(() => setCopied(false), 1800) }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", animation: "fade-up .35s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
        color: "var(--muted)", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        <Icon name="arrow" size={18} /> חזרה למפת הקורס
      </button>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--accent)", letterSpacing: ".03em", marginBottom: 6 }}>{ex.module} · יישום</div>
      <h1 style={{ fontSize: 30, marginBottom: 10 }}>{ex.title}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)", margin: "0 0 20px" }}>{ex.intro}</p>

      {/* security banner */}
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 16px", borderRadius: "var(--r)",
        background: "color-mix(in oklch, var(--gold), white 82%)", border: "1px solid color-mix(in oklch, var(--gold-deep), transparent 55%)", marginBottom: 20 }}>
        <div style={{ flex: "none", width: 24, height: 24, borderRadius: "50%", background: "var(--gold-deep)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14 }}>!</div>
        <div style={{ fontSize: 14.5, color: "oklch(0.42 0.06 75)", fontWeight: 600, lineHeight: 1.5 }}>{ex.security}</div>
      </div>

      {/* prompt block */}
      <Card pad={0} style={{ overflow: "hidden", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)" }}>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, color: "var(--ink-soft)", display: "inline-flex", alignItems: "center", gap: 7 }}>
            <Icon name="terminal" size={16} /> הפרומפט להעתקה
          </span>
          <Button variant={copied ? "soft" : "primary"} size="sm" icon={copied ? "check" : "copy"} onClick={doCopy}>
            {copied ? "הועתק!" : "העתק פרומפט"}
          </Button>
        </div>
        <pre style={{ margin: 0, padding: "16px 18px", whiteSpace: "pre-wrap", wordBreak: "break-word",
          fontFamily: "var(--font-mono)", fontSize: 14.5, lineHeight: 1.7, color: "var(--ink)", direction: "rtl", textAlign: "right" }}>{ex.prompt}</pre>
      </Card>

      {/* tool launch */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 22 }}>
        <a href={ex.tool.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <Button variant="primary" size="lg" icon="link">פתח את {ex.tool.name}</Button>
        </a>
        {ex.tool.alt && ex.tool.alt.map((a) => (
          <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 14.5, color: "var(--muted)", textDecoration: "none", borderBottom: "1px dashed var(--line)" }}>
            או {a.name}
          </a>
        ))}
      </div>

      {/* steps */}
      {ex.steps && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 10 }}>מהלך התרגול</h3>
          <div style={{ display: "grid", gap: 9 }}>
            {ex.steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 16, color: "var(--ink-soft)" }}>
                <span style={{ flex: "none", width: 26, height: 26, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>{i + 1}</span>
                <span style={{ paddingTop: 2 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* reflection */}
      {ex.reflect && (
        <Card style={{ marginBottom: 22, background: "var(--surface-2)" }}>
          {ex.reflect.prompt && <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15.5, color: "var(--accent-ink)", marginBottom: 12 }}>{ex.reflect.prompt}</div>}
          <div style={{ display: "grid", gap: 12 }}>
            {ex.reflect.fields.map((f) => (
              <label key={f.key} style={{ display: "block" }}>
                <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>{f.label}</span>
                <textarea rows={2} value={refl[f.key] || ""} onChange={(e) => setRefl((r) => ({ ...r, [f.key]: e.target.value }))}
                  style={{ width: "100%", resize: "vertical", padding: "11px 14px", borderRadius: "var(--r-sm)", border: "1.5px solid var(--line)",
                    fontFamily: "var(--font-body)", fontSize: 15.5, color: "var(--ink)", background: "var(--surface)", outline: "none", lineHeight: 1.6 }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />
              </label>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary" size="lg" icon="check" onClick={() => onComplete(refl)}>עשיתי את התרגול</Button>
        {alreadyDone && <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--success)", fontWeight: 600 }}><Icon name="check" size={18} stroke={3} /> הושלם</span>}
      </div>
    </div>
  )
}

export { CopilotExercise, copyText }
