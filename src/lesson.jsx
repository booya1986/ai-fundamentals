// lesson.jsx — video player, lesson content screen, quiz runner.
import React from 'react'
import { Icon, Button, Card, ProgressBar } from './ui.jsx'
import { EXERCISE_COMPONENTS } from './exercises.jsx'
import { EX_TYPES } from './data.jsx'
const { useState, useRef } = React

/* ---------- Video player (real <video> when src present, else placeholder) ---------- */
function VideoPlayer({ src, poster, label, onEnded }) {
  if (src) {
    return (
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", background: "#000", marginBottom: 14 }}>
        <video controls playsInline poster={poster} onEnded={onEnded}
          style={{ width: "100%", display: "block", aspectRatio: "16/9", background: "#000" }}>
          <source src={src} type="video/mp4" />
        </video>
      </div>
    )
  }
  return (
    <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", background: "#000", aspectRatio: "16/9", position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0d1b2a,#1b2838)" }} />
      {/* Play button */}
      <div style={{ position: "relative", zIndex: 1, width: 60, height: 60, background: "rgba(255,255,255,0.15)",
        borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(10px)", border: "1.5px solid rgba(255,255,255,0.25)", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 0, height: 0, borderStyle: "solid", borderWidth: "11px 0 11px 19px",
          borderColor: "transparent transparent transparent white", marginRight: -3 }} />
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 12, background: "rgba(0,0,0,0.6)",
        borderRadius: 6, padding: "2px 6px", fontSize: 10, color: "white", fontWeight: 600 }}>
        {label || "סרטון"}
      </div>
    </div>
  )
}

/* ---------- Lesson content screen ---------- */
function LessonScreen({ content, onBack, onComplete, alreadyDone }) {
  const [showTranscript, setShowTranscript] = useState(false)
  const isReading = content.kind === "reading" || content.kind === "diagnostic"

  return (
    <div style={{ animation: "fade-up .3s ease", paddingBottom: 90 }}>
      {/* Status bar spacer */}
      <div style={{ height: 14 }} />

      {/* Nav bar */}
      <div style={{ padding: "4px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{content.module}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px", lineHeight: 1.2 }}>{content.title}</div>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600,
          color: "var(--accent)", cursor: "pointer", paddingBottom: 4, flexShrink: 0 }}>
          ‹ חזרה
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ background: "var(--line)", borderRadius: 3, height: 3, overflow: "hidden" }}>
          <div style={{ background: "var(--accent)", width: alreadyDone ? "100%" : "33%", height: "100%", borderRadius: 3 }} />
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Video player (video lessons only) */}
        {!isReading && <VideoPlayer src={content.media} poster={content.poster} label={content.videoLabel} />}

        {/* Summary / main content card */}
        {content.summary && (
          <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "16px 18px",
            boxShadow: "var(--shadow)", marginBottom: 12 }}>
            <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.65 }}>{content.summary}</div>
          </div>
        )}

        {/* Key points */}
        {content.keypoints && content.keypoints.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase",
              letterSpacing: "0.05em", marginBottom: 6 }}>נקודות עיקריות</div>
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden",
              boxShadow: "var(--shadow)", marginBottom: 12 }}>
              {content.keypoints.map((k, i) => (
                <div key={i} style={{ padding: "13px 16px", display: "flex", alignItems: "flex-start", gap: 12,
                  borderBottom: i < content.keypoints.length - 1 ? "0.5px solid var(--line)" : "none" }}>
                  <div style={{ width: 26, height: 26, background: ["var(--accent)", "var(--warning)", "var(--success)"][i % 3],
                    borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "white", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>{k.h}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{k.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Transcript toggle */}
        {content.transcript && (
          <>
            <button onClick={() => setShowTranscript((s) => !s)} style={{ background: "none", border: "none",
              color: "var(--accent)", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0", marginBottom: 8 }}>
              {showTranscript ? "הסתר תמלול ▲" : (isReading ? "הצג הרחבה ▼" : "הצג תמלול ▼")}
            </button>
            {showTranscript && (
              <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "16px 18px",
                marginBottom: 12, boxShadow: "var(--shadow)", borderRight: "3px solid var(--accent)",
                fontSize: 14, lineHeight: 1.75, color: "var(--ink-soft)", animation: "fade-up .2s ease" }}>
                {content.transcript}
              </div>
            )}
          </>
        )}

        {alreadyDone && (
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--success)", fontWeight: 600, marginBottom: 8 }}>
            ✓ השיעור הושלם
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "var(--maxw)", margin: "0 auto",
        background: "rgba(242,242,247,0.95)", borderTop: "0.5px solid var(--line-strong)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px 16px 28px" }}>
        <button onClick={onComplete} style={{ width: "100%", background: "var(--accent)", borderRadius: "var(--r-lg)",
          padding: 16, fontSize: 16, fontWeight: 600, color: "white", border: "none", cursor: "pointer" }}>
          המשך לשיעור הבא ›
        </button>
      </div>
    </div>
  )
}

/* ---------- Quiz runner ---------- */
function QuizRunner({ quiz, onBack, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [combo, setCombo] = useState(0)        // consecutive correct
  const [maxCombo, setMaxCombo] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [lastGain, setLastGain] = useState(0)
  const q = quiz.questions[idx]
  const Comp = EXERCISE_COMPONENTS[q.type]
  const isLast = idx === quiz.questions.length - 1

  const handleResult = (ok) => {
    setAnswered(true); setLastCorrect(ok)
    if (ok) {
      setCorrectCount((c) => c + 1)
      setCombo((prev) => {
        const nc = prev + 1
        const bonus = (nc - 1) * 5            // 2nd in a row +5, 3rd +10, ...
        const gain = quiz.xpPerCorrect + bonus
        setEarnedXp((x) => x + gain); setLastGain(gain)
        setMaxCombo((m) => Math.max(m, nc))
        return nc
      })
    } else { setCombo(0); setLastGain(0) }
  }
  const next = () => {
    if (isLast) { onComplete({ correct: correctCount, total: quiz.questions.length, xp: earnedXp, maxCombo }); return }
    setIdx((i) => i + 1); setAnswered(false); setLastCorrect(false)
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", animation: "fade-up .35s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
        color: "var(--muted)", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 18, padding: 0 }}>
        <Icon name="arrow" size={18} /> יציאה מהתרגול
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
        <div style={{ flex: 1 }}><ProgressBar value={((idx + (answered ? 1 : 0)) / quiz.questions.length) * 100} height={10} /></div>
        <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14.5, color: "var(--muted)", whiteSpace: "nowrap" }}>{idx + 1} / {quiz.questions.length}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--accent-ink)", background: "var(--accent-soft)", padding: "4px 11px", borderRadius: 999 }}>
          {EX_TYPES[q.type]?.label || "שאלה"}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--gold-deep)", background: "color-mix(in oklch, var(--gold), white 80%)", padding: "4px 11px", borderRadius: 999 }}>
          <Icon name="bolt" size={13} fill /> {earnedXp} XP
        </span>
        {combo >= 2 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: "#fff",
            background: "linear-gradient(135deg, var(--accent), oklch(0.62 0.2 40))", padding: "4px 12px", borderRadius: 999,
            animation: "pop-in .35s cubic-bezier(.2,.8,.2,1)" }}>
            <Icon name="flame" size={13} fill /> רצף ×{combo} · בונוס +{(combo - 1) * 5}
          </span>
        )}
      </div>

      <Card pad={26} style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, lineHeight: 1.35, marginBottom: 22 }}>{q.prompt}</h2>
        <Comp key={q.id} q={q} onResult={handleResult} />
      </Card>

      {answered && (
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 14, animation: "fade-up .25s ease" }}>
          <Button variant={lastCorrect ? "primary" : "deep"} size="lg" iconEnd="arrowback" onClick={next}>
            {isLast ? "סיום וצפייה בתוצאות" : "השאלה הבאה"}
          </Button>
          {lastCorrect && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--gold-deep)" }}>
              <Icon name="bolt" size={18} fill /> +{lastGain} XP{combo >= 2 ? ` (כולל בונוס רצף)` : ""}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { VideoPlayer, LessonScreen, QuizRunner }
