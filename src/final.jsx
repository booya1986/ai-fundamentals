// final.jsx — the capstone (M8) gets a unique, distinct screen.
import React from 'react'
import { Icon, Button, Card, Medal } from './ui.jsx'
import { copyText } from './copilot.jsx'
const { useState } = React

function FinalTaskScreen({ ex, onBack, onComplete, alreadyDone }) {
  const [copied, setCopied] = useState(false)
  const [plan, setPlan] = useState({})
  const doCopy = () => { copyText(ex.prompt); setCopied(true); setTimeout(() => setCopied(false), 1800) }
  const fields = ex.reflect?.fields || []
  const filled = fields.filter((f) => (plan[f.key] || "").trim().length > 0).length

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", animation: "fade-up .35s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
        color: "var(--muted)", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        <Icon name="arrow" size={18} /> חזרה למפת הקורס
      </button>

      {/* distinctive capstone hero */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--r-lg)", padding: "34px 32px", marginBottom: 24,
        background: "linear-gradient(135deg, oklch(0.5 0.21 25), oklch(0.55 0.16 60), var(--gold-deep))",
        boxShadow: "var(--shadow-lg)", color: "#fff" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.16, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(135deg, #fff 0 14px, transparent 14px 28px)" }} />
        <div style={{ position: "relative", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 auto" }}><Medal glyph="trophy" tone="85" size={76} shine /></div>
          <div style={{ flex: "1 1 280px" }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, letterSpacing: ".14em", fontSize: 13, opacity: 0.9, marginBottom: 6 }}>מטלת הסיום · בינו</div>
            <h1 style={{ fontSize: 30, marginBottom: 8, color: "#fff" }}>{ex.title}</h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, opacity: 0.95 }}>{ex.intro}</p>
          </div>
        </div>
      </div>

      {/* security */}
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 16px", borderRadius: "var(--r)",
        background: "color-mix(in oklch, var(--gold), white 82%)", border: "1px solid color-mix(in oklch, var(--gold-deep), transparent 55%)", marginBottom: 24 }}>
        <div style={{ flex: "none", width: 24, height: 24, borderRadius: "50%", background: "var(--gold-deep)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14 }}>!</div>
        <div style={{ fontSize: 14.5, color: "oklch(0.42 0.06 75)", fontWeight: 600, lineHeight: 1.5 }}>{ex.security}</div>
      </div>

      {/* the 6-part plan as a distinctive grid */}
      <h3 style={{ fontSize: 20, marginBottom: 4 }}>התכנון שלכם</h3>
      <p style={{ fontSize: 15, color: "var(--muted)", margin: "0 0 16px" }}>מלאו את הרכיבים — זה גם מה שבינו יבדוק. {filled}/{fields.length} הושלמו</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 14, marginBottom: 26 }}>
        {fields.map((f, i) => {
          const done = (plan[f.key] || "").trim().length > 0
          return (
            <div key={f.key} style={{ background: "var(--surface)", border: `1.5px solid ${done ? "var(--success)" : "var(--line)"}`,
              borderRadius: "var(--r)", padding: 16, boxShadow: "var(--shadow-sm)", transition: "border-color .2s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ flex: "none", width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center",
                  background: done ? "var(--success)" : "var(--accent-soft)", color: done ? "#fff" : "var(--accent-ink)",
                  fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14 }}>
                  {done ? <Icon name="check" size={15} stroke={3} /> : i + 1}
                </span>
                <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{f.label.replace(/^\d+\.\s*/, "")}</span>
              </div>
              <textarea rows={2} value={plan[f.key] || ""} onChange={(e) => setPlan((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder="כתבו כאן..." style={{ width: "100%", resize: "vertical", padding: "10px 12px", borderRadius: "var(--r-sm)",
                  border: "1.5px solid var(--line)", fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink)", background: "var(--surface)", outline: "none", lineHeight: 1.6 }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")} onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />
            </div>
          )
        })}
      </div>

      {/* Bino launch */}
      <Card pad={0} style={{ overflow: "hidden", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--line)", background: "var(--bg-2)", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-soft)", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon name="sparkles" size={17} /> שלחו את התכנון לבינו וקבלו משוב
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant={copied ? "soft" : "ghost"} size="sm" icon={copied ? "check" : "copy"} onClick={doCopy}>{copied ? "הועתק!" : "העתק תבנית"}</Button>
            <a href={ex.tool.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <Button variant="primary" size="sm" icon="link">פתח את בינו</Button>
            </a>
          </div>
        </div>
        <div style={{ padding: 16, display: "grid", gap: 8 }}>
          {ex.steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15, color: "var(--ink-soft)" }}>
              <span style={{ flex: "none", width: 24, height: 24, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent-ink)", display: "grid", placeItems: "center", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
              <span style={{ paddingTop: 1 }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="gold" size="lg" icon="cap" onClick={() => onComplete(plan)}>סיימתי — קבלת התעודה</Button>
        {alreadyDone && <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--success)", fontWeight: 600 }}><Icon name="check" size={18} stroke={3} /> הושלם</span>}
      </div>
    </div>
  )
}

export { FinalTaskScreen }
