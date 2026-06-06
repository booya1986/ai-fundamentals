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

  const canSubmit = true

  return (
    <div style={{ animation: "fade-up .3s ease", paddingBottom: 90 }}>
      <div style={{ height: 14 }} />

      {/* Nav */}
      <div style={{ padding: "4px var(--side-pad, 18px) 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>תרגול · Copilot</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>נסה בעצמך</div>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600, color: "var(--accent)", cursor: "pointer", paddingBottom: 4 }}>
          ‹ חזרה
        </button>
      </div>

      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
        {/* Task card */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "16px 18px", boxShadow: "var(--shadow)", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>המשימה</div>
          <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.6 }}>{ex.intro}</div>
          {ex.security && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--accent-soft)", borderRadius: 10, borderRight: "3px solid var(--accent)" }}>
              <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>🔒 אבטחת מידע</div>
              <div style={{ fontSize: 12, color: "var(--accent-ink)", marginTop: 2, lineHeight: 1.5 }}>{ex.security}</div>
            </div>
          )}
        </div>

        {/* Prompt template — dark card */}
        {ex.prompt && (
          <div style={{ background: "#1C1C1E", borderRadius: "var(--r-lg)", padding: "16px 18px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#636366", textTransform: "uppercase", letterSpacing: "0.05em" }}>הפרומפט</span>
              <button onClick={doCopy} style={{
                background: "var(--accent)", borderRadius: 8, padding: "5px 12px",
                fontSize: 12, fontWeight: 600, color: "white", border: "none", cursor: "pointer" }}>
                {copied ? "הועתק!" : "העתק ✓"}
              </button>
            </div>
            <div style={{ fontSize: 13, color: "#E5E5EA", lineHeight: 1.75, fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap" }}>
              {ex.prompt}
            </div>
          </div>
        )}

        {/* Open in tool */}
        {ex.tool && (
          <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow)", marginBottom: 12 }}>
            <a href={ex.tool.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#0078d4,#005a9e)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>פתח ב-{ex.tool.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>הפרומפט הועתק ומוכן להדבקה</div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: 20 }}>›</div>
              </div>
            </a>
          </div>
        )}

        {/* Reflection fields */}
        {ex.reflect?.fields?.map((f) => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              {f.label}
            </div>
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "14px 16px", boxShadow: "var(--shadow)" }}>
              <textarea
                value={refl[f.key] || ""}
                onChange={(e) => setRefl((r) => ({ ...r, [f.key]: e.target.value }))}
                placeholder="כתוב כאן את התובנות שלך..."
                style={{ width: "100%", minHeight: 72, background: "var(--bg)", borderRadius: 10, border: "none",
                  padding: "10px 12px", fontSize: 14, color: "var(--ink)", fontFamily: "var(--font-body)",
                  resize: "vertical", outline: "none", lineHeight: 1.5 }}
              />
            </div>
          </div>
        ))}

        {alreadyDone && (
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--success)", fontWeight: 600, marginBottom: 8 }}>
            ✓ התרגול הושלם
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "var(--maxw)", margin: "0 auto",
        background: "rgba(242,242,247,0.95)", borderTop: "0.5px solid var(--line-strong)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px var(--side-pad, 16px) 28px" }}>
        <button onClick={onComplete}
          disabled={!canSubmit}
          style={{ width: "100%", background: canSubmit ? "var(--accent)" : "var(--line-strong)",
            borderRadius: "var(--r-lg)", padding: 16, fontSize: 16, fontWeight: 600,
            color: "white", border: "none", cursor: canSubmit ? "pointer" : "not-allowed" }}>
          סיים תרגול ›
        </button>
      </div>
    </div>
  )
}

export { CopilotExercise, copyText }
