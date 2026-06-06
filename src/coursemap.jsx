// coursemap.jsx — iOS list · board · journey views
import React from 'react'
import { Icon, Card, ProgressRing, ProgressBar } from './ui.jsx'
const { useState, useRef } = React

const MODULE_GRADIENTS = {
  m0: "linear-gradient(135deg,#636366,#48484A)",
  m1: "linear-gradient(135deg,#FF3B30,#FF6B6B)",
  m2: "linear-gradient(135deg,#FF9500,#FFCC00)",
  m3: "linear-gradient(135deg,#AF52DE,#BF5AF2)",
  m4: "linear-gradient(135deg,#34C759,#30D158)",
  m5: "linear-gradient(135deg,#0A84FF,#32ADE6)",
  m6: "linear-gradient(135deg,#FF2D55,#FF375F)",
  m7: "linear-gradient(135deg,#5856D6,#6E6DD0)",
  m8: "linear-gradient(135deg,#FFCC00,#FF9500)",
}

const MODULE_EMOJIS = {
  m0: "🎯", m1: "🧠", m2: "🛠️", m3: "✍️",
  m4: "⚡", m5: "🔬", m6: "🛡️", m7: "🤖", m8: "🎓",
}

export function moduleState(mod, progress) {
  const required = mod.lessons.filter((l) => !l.optional)
  const keys = required.map((l) => `${mod.id}/${l.id}`)
  const doneCount = keys.filter((k) => progress.done.includes(k)).length
  if (doneCount === keys.length) return "done"
  if (doneCount > 0) return "active"
  return "locked"
}

export function unlockedSet(modules, progress) {
  const unlocked = new Set()
  for (const mod of modules) {
    unlocked.add(mod.id)
    const required = mod.lessons.filter((l) => !l.optional)
    const allDone = required.every((l) => progress.done.includes(`${mod.id}/${l.id}`))
    if (!allDone) break
  }
  return unlocked
}

function modStats(modules, progress, mod) {
  const required = mod.lessons.filter((l) => !l.optional)
  const total = required.length
  const completed = required.filter((l) => progress.done.includes(`${mod.id}/${l.id}`)).length
  const pct = Math.round((completed / total) * 100)
  const isLocked = !unlockedSet(modules, progress).has(mod.id)
  const state = completed === total ? "done" : isLocked ? "locked" : "active"
  return { total, completed, pct, state, isLocked }
}

function lessonKindIcon(kind) {
  switch (kind) {
    case "video": return "play"
    case "quiz": return "trophy"
    case "final": return "trophy"
    case "interactive": return "sparkles"
    case "copilot": return "bolt"
    case "reading": return "book"
    case "diagnostic": return "flag"
    default: return "bolt"
  }
}

function GlyphTile({ modId, size = 52, state }) {
  const locked = state === "locked"
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.26), flex: "none",
      display: "grid", placeItems: "center", fontSize: Math.round(size * 0.46),
      background: locked ? "var(--line)" : (MODULE_GRADIENTS[modId] || MODULE_GRADIENTS.m1),
      boxShadow: locked ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
    }}>
      {locked ? "🔒" : (MODULE_EMOJIS[modId] || "📚")}
    </div>
  )
}

function LevelXPCard({ progress }) {
  const xpPerLevel = 300
  const level = Math.floor(progress.xp / xpPerLevel) + 1
  const xpInLevel = progress.xp % xpPerLevel
  const pct = Math.round((xpInLevel / xpPerLevel) * 100)
  return (
    <div style={{ margin: "12px var(--side-pad, 16px) 0", background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "14px 16px", boxShadow: "var(--shadow)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 22, height: 22, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>⚡</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>רמה {level}</span>
        </div>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{xpInLevel} / {xpPerLevel} XP</span>
      </div>
      <div style={{ background: "var(--line)", borderRadius: 4, height: 5, overflow: "hidden" }}>
        <div style={{ background: "var(--accent)", width: `${pct}%`, height: "100%", borderRadius: 4, animation: "bar-grow .8s cubic-bezier(.2,.8,.4,1) both" }} />
      </div>
    </div>
  )
}

/* ======= View: iOS List ======= */
function ListMap({ modules, progress, onOpenLesson }) {
  const unlocked = unlockedSet(modules, progress)
  const [shakingId, setShakingId] = useState(null)
  const shakeTimerRef = useRef(null)

  const shake = (id) => {
    clearTimeout(shakeTimerRef.current)
    setShakingId(id)
    shakeTimerRef.current = setTimeout(() => setShakingId(null), 520)
  }

  return (
    <div style={{ margin: "0 var(--side-pad, 16px)", background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
      {modules.map((mod, i) => {
        const state = moduleState(mod, progress)
        const isLocked = !unlocked.has(mod.id)
        const required = mod.lessons.filter((l) => !l.optional)
        const keys = required.map((l) => `${mod.id}/${l.id}`)
        const doneInMod = keys.filter((k) => progress.done.includes(k)).length
        const pct = Math.round((doneInMod / keys.length) * 100)
        const gradient = MODULE_GRADIENTS[mod.id] || MODULE_GRADIENTS.m1
        const emoji = MODULE_EMOJIS[mod.id] || "📚"
        const isLast = i === modules.length - 1
        const handleTap = () => {
          if (isLocked) { shake(mod.id); return }
          const firstIncomplete = mod.lessons.find((l) => !progress.done.includes(`${mod.id}/${l.id}`))
          const target = firstIncomplete || mod.lessons[0]
          onOpenLesson(mod.id, target.id)
        }
        return (
          <div key={mod.id} onClick={handleTap}
            className={!isLocked ? "row-hover" : undefined}
            style={{
              padding: "13px 16px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: isLast ? "none" : "0.5px solid var(--line)",
              cursor: isLocked ? "default" : "pointer",
              opacity: isLocked ? 0.42 : 1, background: "var(--surface)",
              animation: shakingId === mod.id ? "lock-shake .5s ease" : "none",
            }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: isLocked ? "var(--line)" : gradient,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              boxShadow: isLocked ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              {isLocked ? "🔒" : emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: state === "active" ? 5 : 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {mod.title}
              </div>
              {state === "active" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, background: "var(--line)", borderRadius: 3, height: 3, overflow: "hidden" }}>
                    <div style={{ background: "var(--warning)", width: `${pct}%`, height: "100%", borderRadius: 3, animation: "bar-grow .8s cubic-bezier(.2,.8,.4,1) both" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>{pct}%</span>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {required.length} שיעורים{state === "done" ? " · הושלם" : ""}
                </div>
              )}
            </div>
            {state === "done" ? (
              <span style={{ flexShrink: 0, fontSize: 18, color: "var(--success)", display: "inline-block", animation: "check-pop .55s cubic-bezier(.2,.8,.4,1) both" }}>✓</span>
            ) : (
              <span style={{ flexShrink: 0, fontSize: 20, color: "var(--line-strong)" }}>{isLocked ? "" : "›"}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ======= View: Board ======= */
function BoardMap({ modules, progress, onOpenLesson }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
      {modules.map((mod, mi) => {
        const { total, completed, pct, state, isLocked } = modStats(modules, progress, mod)
        const firstUndone = mod.lessons.find((l) => !progress.done.includes(`${mod.id}/${l.id}`))
        const cta = state === "done" ? "חזרה למודול" : completed > 0 ? "המשך מודול" : "התחל מודול"
        const target = firstUndone || mod.lessons[0]
        return (
          <Card key={mod.id} hover={!isLocked} pad={0} onClick={!isLocked ? () => onOpenLesson(mod.id, target.id) : undefined} style={{
            overflow: "hidden", opacity: isLocked ? 0.78 : 1, height: "100%",
            animation: "card-in .45s cubic-bezier(.2,.8,.4,1) both",
            animationDelay: `${mi * 70}ms`,
          }}>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <GlyphTile modId={mod.id} state={state} size={54} />
                <ProgressRing value={pct} size={50} stroke={6}
                  from={isLocked ? "var(--line)" : "var(--accent)"}
                  to={isLocked ? "var(--line)" : "var(--accent-deep)"}>
                  <span style={{ fontSize: 13, color: isLocked ? "var(--muted)" : "var(--ink)" }}>{pct}%</span>
                </ProgressRing>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: ".04em", marginBottom: 4 }}>מודול {mi + 1}</div>
              <h3 style={{ fontSize: 18, marginBottom: 6 }}>{mod.title}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.45, minHeight: 40 }}>{mod.tagline}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, flex: 1 }}>
                {mod.lessons.map((les) => {
                  const dn = progress.done.includes(`${mod.id}/${les.id}`)
                  return (
                    <div key={les.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: dn ? "var(--ink-soft)" : "var(--muted)" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center",
                        background: dn ? "var(--success)" : "var(--bg-2)", color: dn ? "#fff" : "var(--muted)" }}>
                        <Icon name={dn ? "check" : lessonKindIcon(les.kind)} size={11} stroke={3} />
                      </span>
                      <span style={{ flex: 1 }}>{les.title}</span>
                      {les.optional && !dn && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#FF9500", background: "rgba(255,149,0,0.12)",
                          borderRadius: 6, padding: "2px 6px", whiteSpace: "nowrap" }}>⭐ בונוס XP</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <button
                onClick={() => !isLocked && onOpenLesson(mod.id, target.id)}
                disabled={isLocked}
                style={{
                  width: "100%", border: "none", borderRadius: "var(--r)", padding: "10px 16px",
                  fontSize: 14, fontWeight: 600, cursor: isLocked ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-head)",
                  background: isLocked ? "var(--bg-2)" : state === "done" ? "var(--success-soft)" : "var(--accent)",
                  color: isLocked ? "var(--muted)" : state === "done" ? "var(--success)" : "#fff",
                }}>
                {isLocked ? "🔒 נעול" : cta}
              </button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

/* ======= View: Journey ======= */
function JourneyMap({ modules, progress, onOpenLesson }) {
  return (
    <div style={{ position: "relative" }}>
      {modules.map((mod, mi) => {
        const { pct, state, isLocked } = modStats(modules, progress, mod)
        const firstUndone = mod.lessons.find((l) => !progress.done.includes(`${mod.id}/${l.id}`)) || mod.lessons[0]
        return (
          <div key={mod.id} style={{ display: "flex", gap: 0, alignItems: "stretch", position: "relative" }}>
            {/* Timeline spine */}
            <div style={{ width: 56, flex: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 3, flex: 1, background: mi === 0 ? "transparent" : (state !== "locked" ? "var(--accent-soft)" : "var(--line)") }} />
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center",
                background: state === "done" ? "var(--success)" : isLocked ? "var(--bg-2)" : "var(--accent)",
                color: isLocked ? "var(--muted)" : "#fff",
                border: "3px solid var(--bg)", boxShadow: "var(--shadow-sm)", zIndex: 2,
                fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15,
              }}>
                {state === "done" ? <Icon name="check" size={18} stroke={3} /> : isLocked ? <Icon name="lock" size={15} /> : mi + 1}
              </div>
              <span style={{ width: 3, flex: 1, background: mi === modules.length - 1 ? "transparent" : (state === "done" ? "var(--accent-soft)" : "var(--line)") }} />
            </div>

            {/* Card */}
            <div style={{ flex: 1, padding: "8px 0 22px" }}>
              <Card hover={!isLocked} style={{ opacity: isLocked ? 0.78 : 1 }}
                onClick={!isLocked ? () => onOpenLesson(mod.id, firstUndone.id) : undefined}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: isLocked ? 0 : 12 }}>
                  <GlyphTile modId={mod.id} state={state} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 18, marginBottom: 3 }}>{mod.title}</h3>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{mod.tagline}</div>
                  </div>
                  {!isLocked && (
                    <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15,
                      color: state === "done" ? "var(--success)" : "var(--accent)" }}>
                      {pct}%
                    </span>
                  )}
                </div>
                {!isLocked && (
                  <div style={{ marginTop: 4 }}>
                    <ProgressBar value={pct} height={6} />
                    <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                      {mod.lessons.map((les) => {
                        const dn = progress.done.includes(`${mod.id}/${les.id}`)
                        return (
                          <span key={les.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: dn ? "var(--ink-soft)" : "var(--muted)" }}>
                            <Icon name={dn ? "check" : lessonKindIcon(les.kind)} size={13} stroke={2.5} style={{ color: dn ? "var(--success)" : "var(--muted)" }} />
                            {les.title}
                            {les.optional && !dn && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#FF9500", background: "rgba(255,149,0,0.12)",
                                borderRadius: 6, padding: "2px 5px" }}>⭐ בונוס</span>
                            )}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ======= Main export ======= */
export function CourseMap({ modules, progress, onOpenLesson }) {
  const [view, setView] = useState(() => {
    try { return localStorage.getItem("cm-view") || "board" } catch { return "board" }
  })
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0)
  const doneCount = progress.done.length

  const changeView = (v) => {
    setView(v)
    try { localStorage.setItem("cm-view", v) } catch {}
  }

  const coverPct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0

  return (
    <div style={{ paddingBottom: 8, animation: "fade-up .3s ease" }}>
      <div style={{ height: 14 }} />

      {/* Status bar org label */}
      <div style={{ padding: "4px var(--side-pad, 16px) 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Bank Hapoalim Academy
        </div>
      </div>

      {/* Dark Cinematic Hero Card */}
      <div style={{ margin: "0 var(--side-pad, 16px) 12px", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "0 6px 28px rgba(0,0,0,0.22)", position: "relative", height: 118 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,#0d1117 0%,#1a0a0a 60%,#2d0a00 100%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,59,48,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,59,48,.07) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
        <div style={{ position: "absolute", right: -40, top: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,59,48,.32) 0%,transparent 65%)", filter: "blur(28px)" }} />
        <div style={{ position: "absolute", inset: 0, padding: "14px 18px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "inline-block", fontSize: 9, fontWeight: 700, color: "rgba(255,100,80,.9)", letterSpacing: ".07em", textTransform: "uppercase", background: "rgba(255,59,48,.15)", border: "1px solid rgba(255,59,48,.3)", borderRadius: 20, padding: "2px 8px", marginBottom: 7 }}>
              AI Fundamentals Certification
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-.3px", lineHeight: 1.15 }}>
              בינה מלאכותית<br />לעולם העבודה
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 3 }}>{modules.length} מודולים · {totalLessons} שיעורים</div>
          </div>
          <div style={{ textAlign: "left", flexShrink: 0 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{coverPct}%</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginTop: 2 }}>הושלם</div>
            <div style={{ marginTop: 5, width: 48, height: 3, background: "rgba(255,255,255,.1)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${coverPct}%`, height: "100%", background: "var(--accent)", borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>

      <LevelXPCard progress={progress} />

      {/* View toggle — sliding pill */}
      <div style={{ padding: "14px var(--side-pad, 16px) 4px" }}>
        {(() => {
          const TABS = [["board", "לוח"], ["list", "רשימה"], ["journey", "מסלול"]]
          const segIdx = TABS.findIndex(([v]) => v === view)
          return (
            <div style={{ position: "relative", display: "flex", background: "var(--line)", borderRadius: 10, padding: 2, gap: 0 }}>
              {/* sliding pill */}
              <div style={{
                position: "absolute", top: 2, right: 2,
                width: `calc(${100 / TABS.length}% - 4px / ${TABS.length})`,
                height: "calc(100% - 4px)",
                background: "var(--surface)", borderRadius: 8, boxShadow: "var(--shadow-sm)",
                transform: `translateX(calc(${segIdx} * (-100% - 1px)))`,
                transition: "transform .25s cubic-bezier(.2,.8,.4,1)",
                pointerEvents: "none",
              }} />
              {TABS.map(([v, label]) => (
                <button key={v} onClick={() => changeView(v)} style={{
                  flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
                  background: "transparent",
                  fontWeight: view === v ? 600 : 400,
                  color: view === v ? "var(--ink)" : "var(--muted)",
                  fontSize: 13, fontFamily: "var(--font-head)",
                  position: "relative", zIndex: 1,
                  transition: "color .2s",
                }}>
                  {label}
                </button>
              ))}
            </div>
          )
        })()}
      </div>

      {/* Section label */}
      <div style={{ padding: "10px var(--side-pad, 18px) 8px", fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        מודולים · {doneCount}/{totalLessons} שיעורים
      </div>

      {view === "list" && <ListMap modules={modules} progress={progress} onOpenLesson={onOpenLesson} />}
      {view === "board" && (
        <div style={{ padding: "0 var(--side-pad, 16px)" }}>
          <BoardMap modules={modules} progress={progress} onOpenLesson={onOpenLesson} />
        </div>
      )}
      {view === "journey" && (
        <div style={{ padding: "0 var(--side-pad, 16px)" }}>
          <JourneyMap modules={modules} progress={progress} onOpenLesson={onOpenLesson} />
        </div>
      )}
    </div>
  )
}

// Legacy exports
export const COURSE_MAPS = { board: CourseMap, journey: CourseMap }
export { GlyphTile }
