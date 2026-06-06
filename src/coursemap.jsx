// coursemap.jsx — iOS grouped list course map
import React from 'react'
const { useState } = React

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
  const keys = mod.lessons.map((l) => `${mod.id}/${l.id}`)
  const doneCount = keys.filter((k) => progress.done.includes(k)).length
  if (doneCount === keys.length) return "done"
  if (doneCount > 0) return "active"
  return "locked"
}

export function unlockedSet(modules, progress) {
  const unlocked = new Set()
  for (const mod of modules) {
    unlocked.add(mod.id)
    const allDone = mod.lessons.every((l) => progress.done.includes(`${mod.id}/${l.id}`))
    if (!allDone) break
  }
  return unlocked
}

function LevelXPCard({ progress }) {
  const xpPerLevel = 300
  const level = Math.floor(progress.xp / xpPerLevel) + 1
  const xpInLevel = progress.xp % xpPerLevel
  const pct = Math.round((xpInLevel / xpPerLevel) * 100)

  return (
    <div style={{ margin: "12px 16px 0", background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "14px 16px", boxShadow: "var(--shadow)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 22, height: 22, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>⚡</div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>רמה {level}</span>
        </div>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{xpInLevel} / {xpPerLevel} XP</span>
      </div>
      <div style={{ background: "var(--line)", borderRadius: 4, height: 5, overflow: "hidden" }}>
        <div style={{ background: "var(--accent)", width: `${pct}%`, height: "100%", borderRadius: 4 }} />
      </div>
    </div>
  )
}

export function CourseMap({ modules, progress, onOpenLesson }) {
  const unlocked = unlockedSet(modules, progress)
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0)
  const doneCount = progress.done.length

  return (
    <div style={{ paddingBottom: 8, animation: "fade-up .3s ease" }}>
      {/* Status bar spacer */}
      <div style={{ height: 14 }} />

      {/* Large title nav */}
      <div style={{ padding: "4px 18px 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 2 }}>
          Bank Hapoalim Academy
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          יסודות ה-AI
        </div>
      </div>

      {/* XP progress card */}
      <LevelXPCard progress={progress} />

      {/* Section label */}
      <div style={{ padding: "18px 18px 6px", fontSize: 13, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        מודולים · {doneCount}/{totalLessons} שיעורים
      </div>

      {/* Module grouped list */}
      <div style={{ margin: "0 16px", background: "var(--surface)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
        {modules.map((mod, i) => {
          const state = moduleState(mod, progress)
          const isLocked = !unlocked.has(mod.id)
          const keys = mod.lessons.map((l) => `${mod.id}/${l.id}`)
          const doneInMod = keys.filter((k) => progress.done.includes(k)).length
          const pct = Math.round((doneInMod / keys.length) * 100)
          const gradient = MODULE_GRADIENTS[mod.id] || MODULE_GRADIENTS.m1
          const emoji = MODULE_EMOJIS[mod.id] || "📚"
          const isLast = i === modules.length - 1

          const handleTap = () => {
            if (isLocked) return
            const firstIncomplete = mod.lessons.find((l) => !progress.done.includes(`${mod.id}/${l.id}`))
            const target = firstIncomplete || mod.lessons[mod.lessons.length - 1]
            onOpenLesson(mod.id, target.id)
          }

          return (
            <div key={mod.id}
              onClick={handleTap}
              style={{
                padding: "13px 16px",
                display: "flex", alignItems: "center", gap: 12,
                borderBottom: isLast ? "none" : "0.5px solid var(--line)",
                cursor: isLocked ? "default" : "pointer",
                opacity: isLocked ? 0.42 : 1,
                background: "var(--surface)",
              }}>
              {/* Squircle icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: isLocked ? "var(--line)" : gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
                boxShadow: isLocked ? "none" : "0 2px 8px rgba(0,0,0,0.15)",
              }}>
                {isLocked ? "🔒" : emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: state === "active" ? 5 : 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {mod.title}
                </div>
                {state === "active" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, background: "var(--line)", borderRadius: 3, height: 3, overflow: "hidden" }}>
                      <div style={{ background: "var(--warning)", width: `${pct}%`, height: "100%", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>{pct}%</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {mod.lessons.length} שיעורים{state === "done" ? " · הושלם" : ""}
                  </div>
                )}
              </div>

              {/* Trailing indicator */}
              <div style={{ flexShrink: 0, fontSize: state === "done" ? 18 : 20, color: state === "done" ? "var(--success)" : "var(--line-strong)" }}>
                {state === "done" ? "✓" : isLocked ? "" : "›"}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Legacy exports kept for compatibility
export const COURSE_MAPS = { board: CourseMap, journey: CourseMap }
export function GlyphTile({ glyph, tone, size = 48 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: `linear-gradient(135deg,#FF3B30,#FF6B6B)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.46 }}>
      {glyph}
    </div>
  )
}
