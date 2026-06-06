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
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow)", border: "1px solid var(--line)", background: "#000" }}>
        <video controls playsInline poster={poster} onEnded={onEnded}
          style={{ width: "100%", display: "block", aspectRatio: "16 / 9", background: "#000" }}>
          <source src={src} type="video/mp4" />
        </video>
      </div>
    )
  }
  // placeholder (no media embedded yet)
  return (
    <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow)", border: "1px solid var(--line)" }}>
      <div className="stripe-ph" style={{ aspectRatio: "16 / 9", position: "relative", flexDirection: "column", gap: 14,
        background: "linear-gradient(150deg, oklch(0.28 0.04 274), oklch(0.20 0.03 285))", color: "oklch(0.85 0.03 280)",
        backgroundImage: "repeating-linear-gradient(135deg, oklch(1 0 0 / 0.03) 0 14px, transparent 14px 28px)" }}>
        <div style={{ width: 78, height: 78, borderRadius: "50%", display: "grid", placeItems: "center",
          background: "oklch(1 0 0 / 0.95)", color: "var(--accent)", boxShadow: "0 10px 30px oklch(0 0 0 / 0.3)" }}>
          <Icon name="play" size={34} fill style={{ marginInlineStart: 4 }} />
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, opacity: 0.8 }}>{label}</div>
        <div style={{ position: "absolute", insetInlineStart: 14, top: 14, fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.5 }}>[ הסרטון יוטמע כאן ]</div>
      </div>
    </div>
  )
}

/* ---------- Lesson content screen ---------- */
function LessonScreen({ content, onBack, onComplete, alreadyDone }) {
  const [showTranscript, setShowTranscript] = useState(false)
  const isReading = content.kind === "reading" || content.kind === "diagnostic"
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", animation: "fade-up .35s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
        color: "var(--muted)", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        <Icon name="arrow" size={18} /> חזרה למפת הקורס
      </button>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--accent)", letterSpacing: ".03em", marginBottom: 6 }}>{content.module}</div>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>{content.title}</h1>
      <div style={{ display: "flex", gap: 14, marginBottom: 22, color: "var(--muted)", fontSize: 15, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="clock" size={16} /> {content.min} דקות</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name={isReading ? "book" : "play"} size={15} fill={!isReading} /> {isReading ? "קריאה" : "סרטון"} + תקציר
        </span>
      </div>

      {!isReading && <VideoPlayer src={content.media} poster={content.poster} label={content.videoLabel} />}

      {content.summary && (
        <div style={{ marginTop: isReading ? 0 : 28 }}>
          <h3 style={{ fontSize: 21, marginBottom: 10 }}>{isReading ? "מה חשוב לדעת" : "תקציר השיעור"}</h3>
          <p style={{ fontSize: 17.5, lineHeight: 1.7, color: "var(--ink-soft)", margin: 0 }}>{content.summary}</p>
        </div>
      )}

      {content.keypoints && (
        <div style={{ marginTop: 26, display: "grid", gap: 12 }}>
          {content.keypoints.map((k, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: "var(--r)", background: "var(--surface)", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ flex: "none", width: 34, height: 34, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontFamily: "var(--font-head)", fontWeight: 800 }}>{i + 1}</span>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16.5, marginBottom: 2 }}>{k.h}</div>
                <div style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{k.t}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {content.transcript && (
        <>
          <button onClick={() => setShowTranscript((s) => !s)} style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 8,
            background: "none", border: "none", color: "var(--accent)", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15.5, cursor: "pointer", padding: 0 }}>
            <Icon name="book" size={18} /> {showTranscript ? "הסתר תמלול" : (isReading ? "הצג הרחבה" : "הצג תמלול הסרטון")}
          </button>
          {showTranscript && (
            <p style={{ marginTop: 12, padding: "18px 20px", borderRadius: "var(--r)", background: "var(--bg-2)", fontSize: 16,
              lineHeight: 1.8, color: "var(--ink-soft)", borderInlineStart: "3px solid var(--accent)", animation: "fade-up .25s ease" }}>{content.transcript}</p>
          )}
        </>
      )}

      <div style={{ marginTop: 34, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary" size="lg" iconEnd="arrowback" onClick={onComplete}>סיימתי — להמשך</Button>
        {alreadyDone && <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--success)", fontWeight: 600 }}><Icon name="check" size={18} stroke={3} /> השיעור הושלם</span>}
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
