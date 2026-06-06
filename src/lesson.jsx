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
      <div style={{ padding: "4px var(--side-pad, 18px) 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
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

      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
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
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px var(--side-pad, 16px) 28px" }}>
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
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [earnedXp, setEarnedXp] = useState(0)
  const [lastGain, setLastGain] = useState(0)
  const q = quiz.questions[idx]
  const Comp = EXERCISE_COMPONENTS[q.type]
  const isLast = idx === quiz.questions.length - 1
  const total = quiz.questions.length

  const handleResult = (ok) => {
    setAnswered(true); setLastCorrect(ok)
    if (ok) {
      setCorrectCount((c) => c + 1)
      setCombo((prev) => {
        const nc = prev + 1
        const bonus = (nc - 1) * 5
        const gain = quiz.xpPerCorrect + bonus
        setEarnedXp((x) => x + gain); setLastGain(gain)
        setMaxCombo((m) => Math.max(m, nc))
        return nc
      })
    } else { setCombo(0); setLastGain(0) }
  }

  const next = () => {
    if (isLast) { onComplete({ correct: correctCount, total, xp: earnedXp, maxCombo }); return }
    setIdx((i) => i + 1); setAnswered(false); setLastCorrect(false)
  }

  return (
    <div style={{ animation: "fade-up .3s ease", paddingBottom: 90 }}>
      <div style={{ height: 14 }} />

      {/* Nav */}
      <div style={{ padding: "4px var(--side-pad, 18px) 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>חידון · שאלה {idx + 1} מתוך {total}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>בחן את עצמך</div>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600, color: "var(--accent)", cursor: "pointer", paddingBottom: 4 }}>
          יציאה
        </button>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 5, padding: "0 18px 14px", alignItems: "center" }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            height: 5, flex: 1, borderRadius: 3,
            background: i < idx ? "var(--success)" : i === idx ? "var(--accent)" : "var(--line)",
          }} />
        ))}
        <span style={{ fontSize: 11, color: "var(--muted)", marginRight: 4, flexShrink: 0 }}>{idx + 1}/{total}</span>
      </div>

      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
        {/* Question card */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "20px 18px",
          boxShadow: "var(--shadow)", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", lineHeight: 1.55 }}>{q.prompt}</div>
        </div>

        {/* Exercise component */}
        <div style={{ background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden",
          boxShadow: "var(--shadow)", marginBottom: 12 }}>
          <Comp key={q.id} q={q} onResult={handleResult} />
        </div>

        {/* XP hint */}
        {!answered && (
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>תשובה נכונה = </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--warning)" }}>+{quiz.xpPerCorrect} XP ⚡</span>
            {combo >= 2 && <span style={{ fontSize: 12, fontWeight: 800, color: "var(--accent)", marginRight: 6 }}>🔥 רצף ×{combo}</span>}
          </div>
        )}

        {/* Post-answer feedback */}
        {answered && (
          <div style={{ animation: "fade-up .25s ease" }}>
            {/* Feedback banner */}
            <div style={{
              background: lastCorrect ? "var(--success-soft)" : "var(--accent-soft)",
              border: `1.5px solid ${lastCorrect ? "#BBF7D0" : "#FECACA"}`,
              borderRadius: "var(--r-lg)", padding: "16px 18px", marginBottom: 12,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <div style={{ width: 36, height: 36, background: lastCorrect ? "var(--success)" : "var(--accent)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 16, color: "white", fontWeight: 700 }}>
                {lastCorrect ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: lastCorrect ? "#166534" : "var(--accent-ink)", marginBottom: 4 }}>
                  {lastCorrect ? "נכון! כל הכבוד" : "לא הפעם — אבל זה בסדר"}
                </div>
                {q.explain && <div style={{ fontSize: 13, color: lastCorrect ? "#15803D" : "var(--ink-soft)", lineHeight: 1.5 }}>{q.explain}</div>}
              </div>
            </div>

            {/* XP earned */}
            {lastCorrect && lastGain > 0 && (
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--surface)",
                  borderRadius: 20, padding: "8px 18px", boxShadow: "var(--shadow)" }}>
                  <span style={{ fontSize: 16 }}>⚡</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--warning)" }}>+{lastGain} XP</span>
                  {combo >= 2 && <span style={{ fontSize: 12, color: "var(--muted)" }}>כולל בונוס רצף</span>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      {answered && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "var(--maxw)", margin: "0 auto",
          background: "rgba(242,242,247,0.95)", borderTop: "0.5px solid var(--line-strong)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px var(--side-pad, 16px) 28px",
          animation: "fade-up .2s ease" }}>
          <button onClick={next} style={{ width: "100%", background: "var(--accent)", borderRadius: "var(--r-lg)",
            padding: 16, fontSize: 16, fontWeight: 600, color: "white", border: "none", cursor: "pointer",
            marginBottom: lastCorrect ? 0 : 8 }}>
            {isLast ? "סיום וצפייה בתוצאות ›" : "השאלה הבאה ›"}
          </button>
          {!lastCorrect && !isLast && (
            <button onClick={() => { setAnswered(false) }} style={{ width: "100%", background: "var(--surface)",
              borderRadius: "var(--r-lg)", padding: 14, fontSize: 15, fontWeight: 600,
              color: "var(--ink-soft)", border: "1.5px solid var(--line)", cursor: "pointer" }}>
              נסה שוב
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { VideoPlayer, LessonScreen, QuizRunner }
