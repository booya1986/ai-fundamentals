// gamification.jsx — results, badge unlock, achievements, certificate.
import React from 'react'
import { ProgressRing, Icon, Button, Card, Medal, Confetti } from './ui.jsx'
const { useState, useEffect } = React

/* ---------- Quiz results ---------- */
function ResultsScreen({ result, quiz, newBadges, onBackToMap, onRetry, onCertificate, courseComplete }) {
  const pct = Math.round((result.correct / result.total) * 100)
  const perfect = result.correct === result.total
  const circ = 2 * Math.PI * 52
  const offset = circ * (1 - pct / 100)

  return (
    <div style={{ animation: "fade-up .35s ease", paddingBottom: 90 }}>
      <div style={{ height: 14 }} />
      <div style={{ padding: "4px var(--side-pad, 18px) 16px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>
          {perfect ? "מושלם! 🎉" : pct >= 60 ? "כל הכבוד!" : "סיימת!"}
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{quiz.title}</div>
      </div>

      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
        {/* Score ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" strokeWidth="9" />
              <circle cx="60" cy="60" r="52" fill="none"
                stroke={perfect ? "var(--warning)" : pct >= 60 ? "var(--success)" : "var(--accent)"}
                strokeWidth="9" strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset .8s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: "var(--ink)", letterSpacing: "-1px" }}>{pct}%</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{result.correct}/{result.total} נכון</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[
            { value: `+${result.xp}`, label: "XP הרווחת", color: "var(--warning)" },
            { value: result.correct, label: "נכון", color: "var(--success)" },
            { value: result.total - result.correct, label: "שגוי", color: "var(--accent)" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "var(--surface)", borderRadius: "var(--r-lg)",
              padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* New badges */}
        {newBadges?.length > 0 && newBadges.map((b) => (
          <div key={b.id} style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "16px 18px",
            boxShadow: "var(--shadow)", marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
            <Medal glyph={b.glyph} tone={b.tone} size={48} shine />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--warning)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>באדג' חדש!</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{b.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{b.desc}</div>
            </div>
          </div>
        ))}

        {/* XP level progress */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "14px 18px", boxShadow: "var(--shadow)", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 20, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>⚡</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>התקדמות XP</span>
            </div>
          </div>
          <div style={{ background: "var(--line)", borderRadius: 4, height: 5, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(to left,var(--accent),var(--warning))", width: `${(result.xp % 300) / 300 * 100}%`, height: "100%", borderRadius: 4 }} />
          </div>
        </div>
      </div>

      {/* Sticky CTAs */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "var(--maxw)", margin: "0 auto",
        background: "rgba(242,242,247,0.95)", borderTop: "0.5px solid var(--line-strong)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px var(--side-pad, 16px) 28px" }}>
        {courseComplete
          ? <button onClick={onCertificate} style={{ width: "100%", background: "var(--warning)", borderRadius: "var(--r-lg)", padding: 16, fontSize: 16, fontWeight: 600, color: "#000", border: "none", cursor: "pointer", marginBottom: 8 }}>🎓 קבלת תעודת הסיום</button>
          : <button onClick={onBackToMap} style={{ width: "100%", background: "var(--accent)", borderRadius: "var(--r-lg)", padding: 16, fontSize: 16, fontWeight: 600, color: "white", border: "none", cursor: "pointer", marginBottom: 8 }}>המשך לשיעור הבא ›</button>
        }
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onBackToMap} style={{ flex: 1, background: "var(--surface)", borderRadius: "var(--r-lg)", padding: 14, fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", border: "1.5px solid var(--line)", cursor: "pointer" }}>חזור למפה</button>
          {!perfect && <button onClick={onRetry} style={{ flex: 1, background: "var(--surface)", borderRadius: "var(--r-lg)", padding: 14, fontSize: 15, fontWeight: 600, color: "var(--ink-soft)", border: "1.5px solid var(--line)", cursor: "pointer" }}>נסה שוב</button>}
        </div>
      </div>
    </div>
  )
}

/* ---------- Achievements / badges view ---------- */
function AchievementsView({ badges, progress, onBack }) {
  const earned = badges.filter((b) => progress.badges.includes(b.id))
  const locked = badges.filter((b) => !progress.badges.includes(b.id))
  const xpPerLevel = 300
  const level = Math.floor(progress.xp / xpPerLevel) + 1
  const pct = Math.round(((progress.xp % xpPerLevel) / xpPerLevel) * 100)

  return (
    <div style={{ animation: "fade-up .35s ease", paddingBottom: 90 }}>
      <div style={{ height: 14 }} />

      {/* Large title */}
      <div style={{ padding: "4px var(--side-pad, 18px) 10px" }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.5px", lineHeight: 1.1 }}>ההישגים שלי</div>
      </div>

      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
        {/* Stats pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[
            { value: progress.xp, label: "XP", color: "var(--accent)" },
            { value: level, label: "רמה", color: "var(--warning)" },
            { value: `${earned.length}/${badges.length}`, label: "באדג'ים", color: "var(--success)" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: "var(--surface)", borderRadius: "var(--r-lg)",
              padding: "12px 8px", textAlign: "center", boxShadow: "var(--shadow)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "14px 16px", boxShadow: "var(--shadow)", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>התקדמות כללית</span>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{pct}%</span>
          </div>
          <div style={{ background: "var(--line)", borderRadius: 5, height: 6, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(to left,var(--accent),var(--warning))", width: `${pct}%`, height: "100%", borderRadius: 5 }} />
          </div>
        </div>

        {/* Earned badges */}
        {earned.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              הושגו · {earned.length}
            </div>
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow)", marginBottom: 14 }}>
              {earned.map((b, i) => (
                <div key={b.id} style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12,
                  borderBottom: i < earned.length - 1 ? "0.5px solid var(--line)" : "none" }}>
                  <Medal glyph={b.glyph} tone={b.tone} size={38} shine />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{b.desc}</div>
                  </div>
                  <div style={{ background: "var(--success-soft)", borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 600, color: "var(--success)", flexShrink: 0 }}>הושג</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Locked badges */}
        {locked.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              עוד לפניך · {locked.length}
            </div>
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow)", opacity: 0.55 }}>
              {locked.map((b, i) => (
                <div key={b.id} style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12,
                  borderBottom: i < locked.length - 1 ? "0.5px solid var(--line)" : "none" }}>
                  <Medal glyph={b.glyph} tone={b.tone} size={38} locked />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-soft)" }}>{b.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- Certificate ---------- */
function CertificateScreen({ course, onBack }) {
  const [name, setName] = useState("")
  const today = new Date().toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", animation: "fade-up .35s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
        color: "var(--muted)", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        <Icon name="arrow" size={18} /> חזרה למפת הקורס
      </button>

      <div style={{ position: "relative", background: "var(--surface)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--line)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 14, border: "2px solid var(--accent-soft)", borderRadius: "var(--r)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: 8, background: "linear-gradient(var(--accent), var(--gold-deep))" }} />
        <div style={{ padding: "52px 56px", textAlign: "center" }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: 18 }}>
            <Medal glyph="cap" tone="300" size={92} shine />
          </div>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--accent)", letterSpacing: ".14em", fontSize: 14, marginBottom: 10 }}>תעודת סיום</div>
          <h1 style={{ fontSize: 34, marginBottom: 8 }}>{course.title}</h1>
          <p style={{ fontSize: 16.5, color: "var(--muted)", margin: "0 0 28px" }}>מוענקת בזאת לאות השלמת הקורס במלואו</p>

          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="הקלידו את שמכם המלא"
            style={{ width: "min(420px, 100%)", textAlign: "center", border: "none", borderBottom: "2px solid var(--line)",
              fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 30, color: "var(--ink)", background: "transparent",
              outline: "none", padding: "6px 8px 10px", marginBottom: 6 }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")} />
          <div style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 34 }}>השם שיופיע על התעודה</div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginTop: 10 }}>
            <div style={{ textAlign: "start" }}>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16, borderTop: "1.5px solid var(--line)", paddingTop: 6 }}>{today}</div>
              <div style={{ fontSize: 13.5, color: "var(--muted)" }}>תאריך הסיום</div>
            </div>
            <div style={{ textAlign: "center" }}><Medal glyph="star" tone="85" size={52} /></div>
            <div style={{ textAlign: "end" }}>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16, borderTop: "1.5px solid var(--line)", paddingTop: 6, fontStyle: "italic" }}>{course.org}</div>
              <div style={{ fontSize: 13.5, color: "var(--muted)" }}>חתימת ההדרכה</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 22 }}>
        <Button variant="primary" size="lg" icon="cap" onClick={() => window.print()}>הורדה / הדפסה</Button>
        <Button variant="ghost" size="lg" onClick={onBack}>חזרה</Button>
      </div>
    </div>
  )
}

export { ResultsScreen, AchievementsView, CertificateScreen }
