// gamification.jsx — results, badge unlock, achievements, certificate.
import React from 'react'
import { ProgressRing, Icon, Button, Card, Medal, Confetti } from './ui.jsx'
const { useState, useEffect } = React

/* ---------- Quiz results ---------- */
function ResultsScreen({ result, quiz, newBadges, onBackToMap, onRetry, onCertificate, courseComplete }) {
  const [confetti, setConfetti] = useState(true)
  useEffect(() => { const t = setTimeout(() => setConfetti(false), 3200); return () => clearTimeout(t) }, [])
  const pct = Math.round((result.correct / result.total) * 100)
  const perfect = result.correct === result.total
  const headline = perfect ? "מושלם! ענית נכון על הכול" : pct >= 60 ? "כל הכבוד, עברת!" : "סיימת את התרגול"
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", animation: "fade-up .4s ease" }}>
      <Confetti run={confetti} />
      <div style={{ display: "grid", placeItems: "center", marginBottom: 6, animation: "pop-in .5s cubic-bezier(.2,.8,.2,1)" }}>
        <ProgressRing value={pct} size={148} stroke={14}
          from={perfect ? "var(--gold)" : "var(--accent)"} to={perfect ? "var(--gold-deep)" : "var(--accent-deep)"}>
          <div>
            <div style={{ fontSize: 40, lineHeight: 1, color: "var(--ink)" }}>{pct}%</div>
            <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>{result.correct}/{result.total} נכון</div>
          </div>
        </ProgressRing>
      </div>
      <h1 style={{ fontSize: 30, margin: "14px 0 8px" }}>{headline}</h1>
      <p style={{ fontSize: 17, color: "var(--ink-soft)", margin: "0 0 22px" }}>{quiz.title}</p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 26, flexWrap: "wrap" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "14px 22px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center", color: "var(--gold-deep)", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 26 }}>
            <Icon name="bolt" size={24} fill /> +{result.xp}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600 }}>נקודות XP</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "14px 22px", boxShadow: "var(--shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, justifyContent: "center", color: "var(--accent)", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 26 }}>
            <Icon name="check" size={24} stroke={3} /> {result.correct}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--muted)", fontWeight: 600 }}>תשובות נכונות</div>
        </div>
      </div>

      {newBadges && newBadges.length > 0 && (
        <Card style={{ marginBottom: 24, background: "var(--surface-2)", border: "1px solid var(--accent-soft)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, color: "var(--accent-ink)", marginBottom: 14 }}><Icon name="star" size={16} fill /> פתחת באדג' חדש!</div>
          <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
            {newBadges.map((b) => (
              <div key={b.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "pop-in .5s cubic-bezier(.2,.8,.2,1)" }}>
                <Medal glyph={b.glyph} tone={b.tone} size={68} shine />
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14.5 }}>{b.name}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {courseComplete
          ? <Button variant="gold" size="lg" icon="cap" onClick={onCertificate}>קבלת תעודת הסיום</Button>
          : <Button variant="primary" size="lg" iconEnd="arrowback" onClick={onBackToMap}>המשך במסע</Button>}
        {!perfect && <Button variant="ghost" size="lg" icon="arrowback" onClick={onRetry}>תרגול חוזר</Button>}
      </div>
    </div>
  )
}

/* ---------- Achievements / badges view ---------- */
function AchievementsView({ badges, progress, onBack }) {
  const earned = badges.filter((b) => progress.badges.includes(b.id))
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", animation: "fade-up .35s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
        color: "var(--muted)", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        <Icon name="arrow" size={18} /> חזרה למפת הקורס
      </button>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>ההישגים שלי</h1>
      <p style={{ fontSize: 17, color: "var(--muted)", margin: "0 0 24px" }}>אספת {earned.length} מתוך {badges.length} באדג'ים</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {badges.map((b) => {
          const has = progress.badges.includes(b.id)
          return (
            <Card key={b.id} style={{ textAlign: "center", opacity: has ? 1 : 0.82 }} hover>
              <div style={{ display: "grid", placeItems: "center", marginBottom: 14 }}>
                <Medal glyph={b.glyph} tone={b.tone} size={84} locked={!has} shine={has} />
              </div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{b.name}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.45 }}>{b.desc}</div>
              {has && <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, color: "var(--success)", fontWeight: 700, fontSize: 13.5 }}><Icon name="check" size={15} stroke={3} /> הושג</div>}
            </Card>
          )
        })}
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
