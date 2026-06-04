// coursemap.jsx — central screen, 3 layout variations (ported, ES module).
import React from 'react'
import { Icon, Card, Button, ProgressRing, ProgressBar } from './ui.jsx'

function moduleState(modules, progress, idx) {
  const mod = modules[idx]
  const total = mod.lessons.length
  const completed = mod.lessons.filter((l) => progress.done.includes(`${mod.id}/${l.id}`)).length
  const pct = Math.round((completed / total) * 100)
  // unlock: a module is unlocked if it's at or before the active frontier
  let firstUnfinished = modules.findIndex((m) =>
    m.lessons.some((l) => !progress.done.includes(`${m.id}/${l.id}`)))
  if (firstUnfinished === -1) firstUnfinished = modules.length - 1
  const unlocked = idx <= firstUnfinished
  const state = completed === total ? "done" : unlocked ? "active" : "locked"
  return { total, completed, pct, state, unlocked }
}

// which module indices are unlocked for a given progress — used to detect new unlocks
function unlockedSet(modules, progress) {
  let firstUnfinished = modules.findIndex((m) =>
    m.lessons.some((l) => !progress.done.includes(`${m.id}/${l.id}`)))
  if (firstUnfinished === -1) firstUnfinished = modules.length - 1
  const s = new Set()
  modules.forEach((m, i) => { if (i <= firstUnfinished) s.add(m.id) })
  return s
}

function GlyphTile({ glyph, tone, size = 52, state }) {
  const locked = state === "locked"
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3, flex: "none", display: "grid", placeItems: "center",
      position: "relative", overflow: "hidden",
      background: locked ? "var(--bg-2)" : "linear-gradient(145deg, var(--accent), var(--accent-deep))",
      color: locked ? "var(--muted)" : "#fff",
      boxShadow: locked ? "none"
        : "0 10px 22px color-mix(in oklch, var(--accent), transparent 58%), inset 0 1px 1px oklch(1 0 0 / 0.45), inset 0 -7px 13px color-mix(in oklch, var(--accent-deep), transparent 35%)",
      border: locked ? "1.5px solid var(--line)" : "1px solid color-mix(in oklch, var(--accent-deep), transparent 25%)",
    }}>
      {!locked && <span style={{ position: "absolute", top: 0, left: "16%", right: "16%", height: "44%", borderRadius: "50%",
        background: "linear-gradient(oklch(1 0 0 / 0.38), transparent)", pointerEvents: "none" }} />}
      <Icon name={locked ? "lock" : glyph} size={size * 0.46} stroke={2.2} fill={["spark", "star"].includes(glyph) && !locked} style={{ zIndex: 1 }} />
    </div>
  )
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

/* ========== Critter — glossy companion creature ========== */
function Critter({ hue = 250, size = 96, flip = false }) {
  const h2 = (Number(hue) + 30) % 360
  const dark = `oklch(0.32 0.1 ${hue})`
  const eye = (delay) => (
    <span style={{ position: "relative", width: size * 0.17, height: size * 0.2, borderRadius: "50%", background: "#fff",
      display: "grid", placeItems: "center", animation: `blink 4.5s ${delay}s infinite`, boxShadow: "inset 0 -1px 2px oklch(0 0 0 / 0.1)" }}>
      <span style={{ width: "52%", height: "52%", borderRadius: "50%", background: dark, transform: "translateY(8%)" }} />
      <span style={{ position: "absolute", top: "18%", right: "24%", width: "20%", height: "20%", borderRadius: "50%", background: "#fff" }} />
    </span>
  )
  return (
    <div style={{ width: size, height: size * 1.12, position: "relative", animation: "bob 3.4s ease-in-out infinite", transform: flip ? "scaleX(-1)" : "none" }}>
      <span style={{ position: "absolute", bottom: -4, left: "16%", right: "16%", height: 9, borderRadius: "50%", background: "oklch(0 0 0 / 0.32)", filter: "blur(3px)" }} />
      <span style={{ position: "absolute", top: "44%", left: -size * 0.06, width: size * 0.2, height: size * 0.2, borderRadius: "50%",
        background: `oklch(0.6 0.19 ${hue})`, boxShadow: "inset 0 2px 2px oklch(1 0 0 / 0.3)" }} />
      <span style={{ position: "absolute", top: "30%", right: -size * 0.05, width: size * 0.2, height: size * 0.2, borderRadius: "50%",
        background: `oklch(0.62 0.19 ${hue})`, boxShadow: "inset 0 2px 2px oklch(1 0 0 / 0.3)", transform: "rotate(-10deg)" }} />
      <div style={{ width: "100%", height: "100%", borderRadius: "49% 49% 44% 44% / 54% 54% 46% 46%", position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg, oklch(0.83 0.13 ${hue}) 0%, oklch(0.62 0.2 ${hue}) 52%, oklch(0.5 0.2 ${h2}) 100%)`,
        boxShadow: `inset 0 3px 4px oklch(1 0 0 / 0.55), inset 0 -10px 18px oklch(0.3 0.12 ${h2} / 0.5), 0 12px 26px oklch(0.6 0.2 ${hue} / 0.4)` }}>
        <span style={{ position: "absolute", top: "-12%", left: "10%", right: "10%", height: "46%", borderRadius: "50%",
          background: "linear-gradient(oklch(1 0 0 / 0.55), oklch(1 0 0 / 0))" }} />
        <span style={{ position: "absolute", top: "2%", left: "26%", width: size * 0.12, height: size * 0.12, borderRadius: "50%", background: `oklch(0.78 0.15 ${hue})` }} />
        <span style={{ position: "absolute", top: "2%", right: "26%", width: size * 0.12, height: size * 0.12, borderRadius: "50%", background: `oklch(0.78 0.15 ${hue})` }} />
        <div style={{ position: "absolute", top: "34%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: size * 0.1 }}>
          {eye(0)}{eye(0.3)}
        </div>
        <span style={{ position: "absolute", top: "62%", left: "50%", transform: "translateX(-50%)", width: size * 0.26, height: size * 0.14,
          borderRadius: "0 0 999px 999px", border: `3px solid ${dark}`, borderTop: "none" }} />
        <span style={{ position: "absolute", top: "55%", left: "20%", width: size * 0.12, height: size * 0.08, borderRadius: "50%", background: `oklch(0.78 0.16 ${(Number(hue) + 340) % 360} / 0.6)` }} />
        <span style={{ position: "absolute", top: "55%", right: "20%", width: size * 0.12, height: size * 0.08, borderRadius: "50%", background: `oklch(0.78 0.16 ${(Number(hue) + 340) % 360} / 0.6)` }} />
      </div>
    </div>
  )
}

/* ========== Duolingo-style 3D puck node ========== */
function DuoNode({ hue, state, icon, isActive, onClick, locked }) {
  let top, edge, fg
  if (locked) { top = "var(--surface-2)"; edge = "var(--bg-2)"; fg = "var(--muted)" }
  else if (isActive) { top = "var(--accent)"; edge = "color-mix(in oklch, var(--accent), black 30%)"; fg = "#fff" }
  else if (state === "done") { top = `oklch(0.67 0.18 ${hue})`; edge = `oklch(0.5 0.2 ${hue})`; fg = "#fff" }
  else { top = "var(--surface-2)"; edge = "var(--bg-2)"; fg = "var(--ink-soft)" }
  return (
    <div style={{ position: "relative" }}>
      {isActive && (
        <span style={{ position: "absolute", inset: -9, borderRadius: "50%", pointerEvents: "none",
          background: "conic-gradient(var(--accent) 0% 14%, color-mix(in oklch, var(--accent), transparent 78%) 14% 100%)",
          WebkitMask: "radial-gradient(circle, transparent 67%, #000 68%)", mask: "radial-gradient(circle, transparent 67%, #000 68%)" }} />
      )}
      <button className={"duo-puck" + (locked ? " locked" : "")} onClick={onClick}
        style={{ "--puck-edge": edge, width: 74, height: 74, borderRadius: "50%", border: "none",
          background: top, color: fg, display: "grid", placeItems: "center",
          cursor: locked ? "not-allowed" : "pointer", position: "relative" }}>
        <span style={{ position: "absolute", top: 8, left: "20%", right: "20%", height: "32%", borderRadius: "50%",
          background: locked ? "transparent" : "linear-gradient(oklch(1 0 0 / 0.35), transparent)" }} />
        <Icon name={icon} size={30} stroke={2.7} fill={["star", "play", "trophy"].includes(icon) && !locked} style={{ zIndex: 1 }} />
      </button>
    </div>
  )
}

/* ========== Variation A: Duolingo-style winding PATH ========== */
function pathIcon(les, done) {
  if (les.kind === "quiz" || les.kind === "final") return "trophy"
  if (les.kind === "interactive") return "sparkles"
  if (les.kind === "copilot") return "bolt"
  if (done) return "star"
  return "book"
}
function PathMap({ modules, progress, onOpenLesson, onLocked }) {
  let gi = -1
  return (
    <div style={{ position: "relative", maxWidth: 520, margin: "0 auto", padding: "4px 0 64px" }}>
      {modules.map((mod, mi) => {
        const ms = moduleState(modules, progress, mi)
        const locked = ms.state === "locked"
        const firstUndone = mod.lessons.find((l) => !progress.done.includes(`${mod.id}/${l.id}`))
        return (
          <section key={mod.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 22,
              marginTop: mi === 0 ? 0 : 40, marginBottom: 30, color: locked ? "var(--ink-soft)" : "#fff",
              background: locked ? "var(--bg-2)" : `linear-gradient(135deg, oklch(0.62 0.18 ${mod.color}), oklch(0.5 0.2 ${(Number(mod.color) + 30) % 360}))`,
              boxShadow: locked ? "none" : `0 6px 0 oklch(0.42 0.18 ${mod.color}), 0 14px 30px oklch(0.5 0.2 ${mod.color} / 0.35)`,
              border: locked ? "1px solid var(--line)" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.85, letterSpacing: ".06em" }}>מקטע {mi + 1} · {ms.completed}/{ms.total} שיעורים</div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20, marginTop: 2 }}>{mod.title}</div>
              </div>
              <div style={{ flex: "none", width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center",
                background: locked ? "var(--surface)" : "oklch(1 0 0 / 0.18)", color: locked ? "var(--muted)" : "#fff" }}>
                <Icon name={locked ? "lock" : mod.glyph} size={22} stroke={2.2} />
              </div>
            </div>

            {mod.lessons.map((les, li) => {
              gi += 1
              const key = `${mod.id}/${les.id}`
              const done = progress.done.includes(key)
              const isActive = !locked && firstUndone && firstUndone.id === les.id
              const offset = Math.round(Math.sin(gi * 0.85) * 92)
              const showCritter = li === 1
              const critterX = offset > 0 ? -132 : 132
              return (
                <div key={les.id} style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: 34, minHeight: 86 }}>
                  {showCritter && (
                    <div style={{ position: "absolute", top: 2, transform: `translateX(${critterX}px)`, zIndex: 1, opacity: locked ? 0.4 : 1, filter: locked ? "grayscale(0.7)" : "none" }}>
                      <Critter hue={(Number(mod.color) + 60) % 360} size={92} flip={critterX > 0} />
                    </div>
                  )}
                  <div style={{ transform: `translateX(${offset}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 9, position: "relative", zIndex: 2 }}>
                    {isActive && (
                      <div style={{ position: "absolute", top: -44, background: "var(--surface)", color: "var(--accent-ink)",
                        fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 14, letterSpacing: ".04em", padding: "7px 16px",
                        borderRadius: 12, boxShadow: "var(--shadow)", border: "1px solid var(--line)", animation: "bob 1.8s ease-in-out infinite", whiteSpace: "nowrap" }}>
                        התחל
                        <span style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 12, height: 12,
                          background: "var(--surface)", borderRight: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }} />
                      </div>
                    )}
                    <DuoNode hue={mod.color} state={ms.state} locked={locked} isActive={isActive}
                      icon={locked ? "lock" : done ? "check" : pathIcon(les, done)}
                      onClick={() => (locked ? onLocked() : onOpenLesson(mod.id, les.id))} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? "var(--accent-ink)" : locked ? "var(--muted)" : "var(--ink-soft)",
                      maxWidth: 150, textAlign: "center", lineHeight: 1.25 }}>{les.title}</div>
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}

/* ========== Variation B: module BOARD ========== */
function BoardMap({ modules, progress, onOpenLesson, onLocked }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
      {modules.map((mod, mi) => {
        const ms = moduleState(modules, progress, mi)
        const locked = ms.state === "locked"
        const firstUndone = mod.lessons.find((l) => !progress.done.includes(`${mod.id}/${l.id}`))
        const cta = ms.state === "done" ? "חזרה למודול" : ms.completed > 0 ? "המשך מודול" : "התחל מודול"
        const target = firstUndone || mod.lessons[0]
        return (
          <Card key={mod.id} hover={!locked} pad={0} style={{ overflow: "hidden", opacity: locked ? 0.78 : 1, height: "100%" }}>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <GlyphTile glyph={mod.glyph} tone={mod.color} state={ms.state} size={54} />
                <ProgressRing value={ms.pct} size={50} stroke={6}
                  from={locked ? "var(--line)" : "var(--accent)"}
                  to={locked ? "var(--line)" : "var(--accent-deep)"}>
                  <span style={{ fontSize: 13, color: locked ? "var(--muted)" : "var(--ink)" }}>{ms.pct}%</span>
                </ProgressRing>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: ".04em", marginBottom: 4 }}>מודול {mi + 1}</div>
              <h3 style={{ fontSize: 19.5, marginBottom: 6 }}>{mod.title}</h3>
              <p style={{ fontSize: 14.5, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.45, minHeight: 42 }}>{mod.tagline}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16, flex: 1 }}>
                {mod.lessons.map((les) => {
                  const dn = progress.done.includes(`${mod.id}/${les.id}`)
                  return (
                    <div key={les.id} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: dn ? "var(--ink-soft)" : "var(--muted)" }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center",
                        background: dn ? "var(--success)" : "var(--bg-2)", color: dn ? "#fff" : "var(--muted)" }}>
                        <Icon name={dn ? "check" : lessonKindIcon(les.kind)} size={12} stroke={3} />
                      </span>
                      <span style={{ flex: 1 }}>{les.title}</span>
                      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{les.min}׳</span>
                    </div>
                  )
                })}
              </div>
              <Button variant={locked ? "ghost" : ms.state === "done" ? "soft" : "primary"} full size="sm"
                icon={locked ? "lock" : undefined} iconEnd={locked ? undefined : "arrowback"}
                onClick={() => (locked ? onLocked() : onOpenLesson(mod.id, target.id))}>
                {locked ? "נעול" : cta}
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

/* ========== Variation C: JOURNEY timeline ========== */
function JourneyMap({ modules, progress, onOpenLesson, onLocked }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {modules.map((mod, mi) => {
          const ms = moduleState(modules, progress, mi)
          const locked = ms.state === "locked"
          const firstUndone = mod.lessons.find((l) => !progress.done.includes(`${mod.id}/${l.id}`)) || mod.lessons[0]
          return (
            <div key={mod.id} style={{ display: "flex", gap: 0, alignItems: "stretch", position: "relative" }}>
              <div style={{ width: 64, flex: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ width: 3, flex: 1, background: mi === 0 ? "transparent" : (ms.state !== "locked" ? `oklch(0.7 0.1 ${mod.color})` : "var(--line)") }} />
                <div style={{ width: 40, height: 40, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center",
                  background: ms.state === "done" ? "var(--success)" : locked ? "var(--bg-2)" : `oklch(0.58 0.16 ${mod.color})`,
                  color: locked ? "var(--muted)" : "#fff", border: "3px solid var(--bg)", boxShadow: "var(--shadow-sm)", zIndex: 2,
                  fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>
                  {ms.state === "done" ? <Icon name="check" size={18} stroke={3} /> : locked ? <Icon name="lock" size={15} /> : mi + 1}
                </div>
                <span style={{ width: 3, flex: 1, background: mi === modules.length - 1 ? "transparent" : (ms.state === "done" ? `oklch(0.7 0.1 ${mod.color})` : "var(--line)") }} />
              </div>
              <div style={{ flex: 1, padding: "10px 0 26px" }}>
                <Card hover={!locked} style={{ opacity: locked ? 0.78 : 1 }} onClick={locked ? onLocked : () => onOpenLesson(mod.id, firstUndone.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: ms.state === "locked" ? 0 : 12 }}>
                    <GlyphTile glyph={mod.glyph} tone={mod.color} state={ms.state} size={48} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 18.5 }}>{mod.title}</h3>
                      <div style={{ fontSize: 14, color: "var(--muted)" }}>{mod.tagline}</div>
                    </div>
                    {!locked && <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: ms.state === "done" ? "var(--success)" : "var(--accent)", fontSize: 15 }}>{ms.pct}%</span>}
                  </div>
                  {!locked && (
                    <div style={{ marginTop: 4 }}>
                      <ProgressBar value={ms.pct} height={8} tone={`oklch(0.58 0.16 ${mod.color})`} />
                      <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
                        {mod.lessons.map((les) => {
                          const dn = progress.done.includes(`${mod.id}/${les.id}`)
                          return (
                            <span key={les.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: dn ? "var(--ink-soft)" : "var(--muted)" }}>
                              <Icon name={dn ? "check" : lessonKindIcon(les.kind)} size={14} stroke={2.6} style={{ color: dn ? "var(--success)" : "var(--muted)" }} />
                              {les.title}
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
    </div>
  )
}

const COURSE_MAPS = { path: PathMap, board: BoardMap, journey: JourneyMap }
export { PathMap, BoardMap, JourneyMap, Critter, DuoNode, COURSE_MAPS, moduleState, unlockedSet, GlyphTile, lessonKindIcon }
