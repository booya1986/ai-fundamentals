# iOS Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current multi-theme gradient design with a native iOS Light design language (SF Pro, #F2F2F7 backgrounds, grouped white cards, 0.5px separators, red accent #FF3B30) across all screens — mobile-first at 390px.

**Architecture:** Single-theme system (no theme switcher). TopBar and Hero components are removed; replaced by inline Large Title nav bars per screen and a bottom TabBar with two tabs (Course + Achievements). All layout stays as inline React styles using CSS custom property tokens.

**Tech Stack:** React 19, Vite, inline styles, CSS custom properties (`tokens.css`), no Tailwind, no CSS-in-JS, Hebrew RTL.

---

## File Map

| Action | File | What changes |
|---|---|---|
| Rewrite | `src/styles/tokens.css` | iOS system values replace OKLCH tokens |
| Delete | `src/styles/themes.css` | Removed — single theme only |
| Delete | `src/styles/aurora.css` | Removed — no aurora gradients |
| Update | `src/index.css` | Background #F2F2F7, system font stack |
| Update | `src/App.css` | Strip to empty (was minimal anyway) |
| Update | `src/ui.jsx` | Button, Card, Medal updated; new `TabBar` component |
| Rewrite | `src/App.jsx` | Remove ThemeSwitcher/TopBar/Hero; add TabBar; remove layout state |
| Rewrite | `src/coursemap.jsx` | Replace board+journey views with single iOS grouped list |
| Rewrite | `src/lesson.jsx` | Restyle LessonScreen (reading+video) and QuizRunner |
| Rewrite | `src/copilot.jsx` | Dark template card, iOS rows |
| Rewrite | `src/gamification.jsx` | AchievementsView + ResultsScreen in iOS style |
| Update | `src/interactions.jsx` | Restyle the word-prediction simulation wrapper |

---

## Task 1: Replace Design Tokens

**Files:**
- Rewrite: `src/styles/tokens.css`

- [ ] **Step 1: Replace tokens.css with iOS system values**

Replace the entire file with:

```css
/* tokens.css — iOS system design tokens */
:root {
  /* Backgrounds */
  --bg:        #F2F2F7;
  --bg-2:      #E5E5EA;
  --surface:   #FFFFFF;
  --surface-2: #F2F2F7;

  /* Text */
  --ink:       #000000;
  --ink-soft:  #3C3C43;
  --muted:     #8E8E93;

  /* Borders */
  --line:      #E5E5EA;
  --line-soft: #F2F2F7;
  --line-strong: #C6C6C8;

  /* Accent — iOS system red */
  --accent:      #FF3B30;
  --accent-deep: #D70015;
  --accent-soft: #FFF5F5;
  --accent-ink:  #C0392B;

  /* Semantic */
  --success:      #34C759;
  --success-soft: #E8F8ED;
  --warning:      #FF9500;
  --gold:         #FFCC00;
  --gold-deep:    #FF9500;
  --danger:       #FF3B30;
  --danger-soft:  #FFF5F5;

  /* Radii — iOS values */
  --r-sm: 10px;
  --r:    14px;
  --r-lg: 16px;
  --r-xl: 20px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.07);
  --shadow:    0 1px 4px rgba(0,0,0,0.08);
  --shadow-lg: 0 4px 20px rgba(0,0,0,0.14);

  /* Typography */
  --font-head: -apple-system, BlinkMacSystemFont, 'Noto Sans Hebrew', sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Noto Sans Hebrew', sans-serif;
  --font-mono: 'SF Mono', 'JetBrains Mono', ui-monospace, monospace;

  --maxw: 430px;
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
h1, h2, h3, h4 {
  font-family: var(--font-head);
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
  letter-spacing: -0.02em;
}
button { font-family: inherit; cursor: pointer; }
::selection { background: var(--accent-soft); }

/* Thin iOS-style scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-thumb { background: var(--line-strong); border-radius: 4px; }

#root { min-height: 100vh; }

/* Shared keyframes */
@keyframes pop-in { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
@keyframes fade-up { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@keyframes ring-fill { from { stroke-dashoffset: var(--circ); } }
@keyframes confetti-fall { 0% { transform: translateY(-20vh) rotate(0); opacity: 1; } 100% { transform: translateY(105vh) rotate(720deg); opacity: 0.9; } }
@keyframes badge-shine { 0% { transform: translateX(-120%) rotate(20deg); } 100% { transform: translateX(220%) rotate(20deg); } }
@keyframes unlock-pop { 0% { transform: scale(0.6); opacity: 0; } 55% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes lock-burst { 0% { transform: scale(1) rotate(0); } 30% { transform: scale(1.25) rotate(-8deg); } 100% { transform: scale(0) rotate(28deg); opacity: 0; } }
@keyframes ring-ping { 0% { transform: scale(0.7); opacity: 0.55; } 100% { transform: scale(2.2); opacity: 0; } }

.stripe-ph {
  background: #1C1C1E;
  color: var(--muted);
  font-family: var(--font-mono);
  display: flex; align-items: center; justify-content: center;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; }
}
```

- [ ] **Step 2: Run dev server and confirm no build errors**

```bash
cd "ai-fundamentals" && npm run dev
```

Expected: Server starts at `http://localhost:5173` with no errors in terminal. The app will look broken visually — that's expected at this stage.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "design: replace OKLCH tokens with iOS system values"
```

---

## Task 2: Delete Old Theme Files + Update Base CSS

**Files:**
- Delete: `src/styles/themes.css`
- Delete: `src/styles/aurora.css`
- Rewrite: `src/App.css`
- Rewrite: `src/index.css`

- [ ] **Step 1: Delete the two theme files**

```bash
rm "src/styles/themes.css" "src/styles/aurora.css"
```

- [ ] **Step 2: Remove imports of deleted files from main.jsx**

Open `src/main.jsx`. Remove these two lines:

```js
import './styles/themes.css'
import './styles/aurora.css'
```

Keep only:
```js
import './styles/tokens.css'
import './index.css'
```

- [ ] **Step 3: Replace App.css with empty file**

Replace `src/App.css` with:

```css
/* App.css — intentionally minimal; all layout is inline styles */
```

- [ ] **Step 4: Replace index.css**

Replace `src/index.css` with:

```css
/* index.css — global resets beyond tokens.css */
html {
  background: #F2F2F7;
}
body {
  background: #F2F2F7;
  min-height: 100vh;
}
/* Remove aurora gradient classes if present */
.aurora-bg { background: none; }
```

- [ ] **Step 5: Verify and commit**

Run `npm run dev`, open browser. Confirm no console errors about missing files.

```bash
git add src/main.jsx src/App.css src/index.css
git commit -m "design: remove theme/aurora files, clean base CSS"
```

---

## Task 3: Update UI Primitives + Add TabBar

**Files:**
- Modify: `src/ui.jsx` — update Button, Card, Medal; add TabBar

- [ ] **Step 1: Replace the Button component**

Find the `Button` function in `src/ui.jsx` and replace it entirely:

```jsx
function Button({ children, variant = "primary", size = "md", icon, iconEnd, onClick, style, disabled }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 8, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-head)", fontWeight: 600, borderRadius: "var(--r)",
    transition: "opacity .15s", opacity: disabled ? 0.45 : 1, ...style,
  }
  const sizes = {
    sm: { fontSize: 13, padding: "8px 14px" },
    md: { fontSize: 15, padding: "13px 20px" },
    lg: { fontSize: 16, padding: "16px 20px", borderRadius: "var(--r-lg)", width: "100%" },
  }
  const variants = {
    primary: { background: "var(--accent)", color: "#fff" },
    deep:    { background: "var(--accent-deep)", color: "#fff" },
    soft:    { background: "var(--accent-soft)", color: "var(--accent)" },
    ghost:   { background: "var(--surface)", color: "var(--ink-soft)", border: "1.5px solid var(--line)" },
    gold:    { background: "var(--gold)", color: "#000" },
    success: { background: "var(--success-soft)", color: "var(--success)" },
  }
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === "lg" ? 18 : 16} />}
    </button>
  )
}
```

- [ ] **Step 2: Replace the Card component**

```jsx
function Card({ children, style, pad = 16, hover, onClick }) {
  return (
    <div onClick={onClick}
      style={{
        background: "var(--surface)", borderRadius: "var(--r-lg)",
        boxShadow: "var(--shadow)", padding: pad,
        cursor: onClick || hover ? "pointer" : undefined,
        transition: hover ? "opacity .15s" : undefined,
        ...style,
      }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Update Medal to render as squircle**

Find `Medal` in `ui.jsx` and replace:

```jsx
function Medal({ glyph, tone, size = 56, locked, shine, style }) {
  const GLYPHS = {
    rocket: "🚀", star: "⭐", sparkles: "✨", shield: "🛡️",
    trophy: "🏆", flame: "🔥", cap: "🎓", bolt: "⚡",
  }
  const GRADIENTS = {
    "100": "linear-gradient(135deg,#FF3B30,#FF6B6B)",
    "200": "linear-gradient(135deg,#FF9500,#FFCC00)",
    "300": "linear-gradient(135deg,#AF52DE,#BF5AF2)",
    "85":  "linear-gradient(135deg,#34C759,#30D158)",
    "250": "linear-gradient(135deg,#0A84FF,#32ADE6)",
    "150": "linear-gradient(135deg,#FF2D55,#FF375F)",
  }
  const bg = locked ? "#E5E5EA" : (GRADIENTS[String(tone)] || "linear-gradient(135deg,#FF9500,#FFCC00)")
  const radius = Math.round(size * 0.26) // squircle ratio
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: bg, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.46, flexShrink: 0,
      boxShadow: locked ? "none" : `0 4px 12px rgba(0,0,0,0.15)`,
      filter: locked ? "grayscale(1)" : "none",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      {shine && !locked && (
        <span style={{
          position: "absolute", inset: 0, background: "linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.4) 50%,transparent 65%)",
          animation: "badge-shine 2.4s ease-in-out infinite",
        }} />
      )}
      <span style={{ position: "relative" }}>{locked ? "🔒" : (GLYPHS[glyph] || "⭐")}</span>
    </div>
  )
}
```

- [ ] **Step 4: Add TabBar component (new export)**

Add this new component near the bottom of `ui.jsx`, before the exports:

```jsx
function TabBar({ active, onNavigate }) {
  const tabs = [
    { id: "map",          label: "קורס",   emoji: "🏠" },
    { id: "achievements", label: "הישגים", emoji: "🏆" },
  ]
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(242,242,247,0.92)",
      borderTop: "0.5px solid var(--line-strong)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      padding: "8px 0 env(safe-area-inset-bottom, 16px)",
      display: "flex", justifyContent: "space-around",
    }}>
      {tabs.map((t) => {
        const isActive = active === t.id
        return (
          <button key={t.id} onClick={() => onNavigate(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "4px 24px",
          }}>
            <span style={{ fontSize: 22, filter: isActive ? "none" : "grayscale(1)", opacity: isActive ? 1 : 0.45 }}>
              {t.emoji}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: isActive ? "var(--accent)" : "var(--muted)",
              fontFamily: "var(--font-head)",
            }}>
              {t.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Add TabBar to exports**

Find the export line at the bottom of `ui.jsx` and add `TabBar`:

```jsx
export { Icon, Button, Card, ProgressBar, ProgressRing, Pill, Confetti, Modal, Medal, BadgeCtx, Placeholder, TabBar }
```

- [ ] **Step 6: Verify and commit**

```bash
npm run dev
```

Open `http://localhost:5173`. Buttons and cards should look cleaner. No console errors.

```bash
git add src/ui.jsx
git commit -m "design: update ui primitives to iOS style, add TabBar component"
```

---

## Task 4: Rewrite App Shell

**Files:**
- Rewrite: `src/App.jsx` — remove ThemeSwitcher/TopBar/Hero, add TabBar, remove layout state

- [ ] **Step 1: Update imports at the top of App.jsx**

Replace the import block:

```jsx
import React from 'react'
import { COURSE, MODULES, LESSON_CONTENT, QUIZZES, COPILOT, BADGES, INITIAL_PROGRESS } from './data.jsx'
import { Icon, Button, Card, ProgressRing, Confetti, Medal, TabBar } from './ui.jsx'
import { CourseMap, moduleState, unlockedSet } from './coursemap.jsx'
import { LessonScreen, QuizRunner } from './lesson.jsx'
import { CopilotExercise } from './copilot.jsx'
import { FinalTaskScreen } from './final.jsx'
import { INTERACTIONS } from './interactions.jsx'
import { ResultsScreen, AchievementsView, CertificateScreen } from './gamification.jsx'
import { scormLoad, scormSave, scormTerminate } from './scorm.js'
const { useState, useEffect } = React
```

- [ ] **Step 2: Remove ThemeSwitcher, TopBar, Hero, and useIsMobile functions**

Delete the following function definitions entirely from App.jsx (keep everything else):
- `useIsMobile` (lines ~172–183)
- `TopBar` (lines ~186–219)
- `Hero` (lines ~222–269)
- `ThemeSwitcher` + `THEME_OPTIONS` (lines ~134–169)

- [ ] **Step 3: Update ModuleCompleteOverlay to not use GlyphTile**

Replace the `ModuleCompleteOverlay` function with:

```jsx
function ModuleCompleteOverlay({ celebrate, onClose }) {
  const { badges = [], nextMod } = celebrate
  const MODULE_GRADIENTS = {
    m0: "linear-gradient(135deg,#636366,#48484A)", m1: "linear-gradient(135deg,#FF3B30,#FF6B6B)",
    m2: "linear-gradient(135deg,#FF9500,#FFCC00)", m3: "linear-gradient(135deg,#AF52DE,#BF5AF2)",
    m4: "linear-gradient(135deg,#34C759,#30D158)", m5: "linear-gradient(135deg,#0A84FF,#32ADE6)",
    m6: "linear-gradient(135deg,#FF2D55,#FF375F)", m7: "linear-gradient(135deg,#5856D6,#6E6DD0)",
    m8: "linear-gradient(135deg,#FFCC00,#FF9500)",
  }
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5000, display: "grid", placeItems: "center", padding: 20,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", animation: "fade-in .25s ease", overflowY: "auto" }}>
      <Confetti run={true} />
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", maxWidth: 380, width: "100%",
        boxShadow: "var(--shadow-lg)", padding: "32px 24px", textAlign: "center",
        animation: "unlock-pop .5s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--success)", letterSpacing: ".06em", marginBottom: 4 }}>כל הכבוד!</div>
        <h2 style={{ fontSize: 24, marginBottom: badges.length ? 20 : 8 }}>סיימת את המודול</h2>

        {badges.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 12 }}>
              הרווחת {badges.length > 1 ? "באדג'ים" : "באדג'"}:
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {badges.map((b) => (
                <div key={b.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "pop-in .5s ease" }}>
                  <Medal glyph={b.glyph} tone={b.tone} size={60} shine />
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextMod && (
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 18, marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: MODULE_GRADIENTS[nextMod.id] || MODULE_GRADIENTS.m1,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                {nextMod.glyph}
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>המודול הבא נפתח!</div>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>{nextMod.title}</h3>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 8px", lineHeight: 1.5 }}>{nextMod.tagline}</p>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <Button variant="primary" size="lg" onClick={onClose}>
            {nextMod ? "קדימה למודול הבא!" : "המשך במסע"}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite the App component**

Replace the `App` function entirely:

```jsx
const TAB_SCREENS = ["map", "achievements"]

function App() {
  const [screen, setScreen] = useState("map")
  const [progress, setProgress] = useState(loadProgress)
  const [current, setCurrent] = useState(null) // {mid, lid}
  const [result, setResult] = useState(null)
  const [newBadges, setNewBadges] = useState([])
  const [celebrate, setCelebrate] = useState(null)

  useEffect(() => { scormSave(progress, computeMeta(progress)) }, [progress])
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, [screen])
  useEffect(() => {
    const onUnload = () => scormTerminate()
    window.addEventListener("beforeunload", onUnload)
    return () => { window.removeEventListener("beforeunload", onUnload); scormTerminate() }
  }, [])

  const openLesson = (mid, lid) => {
    const { les } = findLesson(mid, lid)
    setCurrent({ mid, lid })
    if (les.kind === "quiz") setScreen("quiz")
    else if (les.kind === "copilot") setScreen("copilot")
    else if (les.kind === "interactive") setScreen("interactive")
    else if (les.kind === "final") setScreen("final")
    else setScreen("lesson")
  }

  const applyDone = (prev, keys, extraXp = 0) => {
    const before = unlockedSet(MODULES, prev)
    const done = Array.from(new Set([...prev.done, ...keys]))
    let np = { ...prev, done, xp: prev.xp + extraXp }
    const earned = new Set(np.badges)
    const gained = []
    const add = (id) => { if (!earned.has(id)) { earned.add(id); gained.push(id) } }
    add("first-step")
    MODULES.forEach((m) => {
      const modDone = m.lessons.every((l) => np.done.includes(`${m.id}/${l.id}`))
      if (modDone) { add("module-done"); if (m.id === "m3") add("prompt-pro"); if (m.id === "m6") add("safe-pro") }
    })
    if (MODULES.every((m) => m.lessons.every((l) => np.done.includes(`${m.id}/${l.id}`)))) add("graduate")
    np.badges = Array.from(earned)
    const after = unlockedSet(MODULES, np)
    const newlyUnlocked = MODULES.find((m) => after.has(m.id) && !before.has(m.id))
    return { np, newlyUnlocked, gained }
  }
  const badgeObjs = (ids) => ids.map((id) => BADGES.find((b) => b.id === id)).filter(Boolean)
  const isCourseDone = (p) => MODULES.every((m) => m.lessons.every((l) => p.done.includes(`${m.id}/${l.id}`)))

  const completeSimpleLesson = () => {
    if (!current) return
    const key = `${current.mid}/${current.lid}`
    const { mod } = findLesson(current.mid, current.lid)
    const i = mod.lessons.findIndex((l) => l.id === current.lid)
    const nextLes = mod.lessons[i + 1]
    const { np, newlyUnlocked, gained } = applyDone(progress, [key], 10)
    setProgress(np)
    const moduleDone = mod.lessons.every((l) => np.done.includes(`${mod.id}/${l.id}`))
    if (isCourseDone(np)) { setScreen("certificate"); return }
    if (moduleDone) { setCelebrate({ badges: badgeObjs(gained), nextMod: newlyUnlocked }); setScreen("map") }
    else if (nextLes) openLesson(current.mid, nextLes.id)
    else setScreen("map")
  }

  const finishQuiz = (res) => {
    const mid = current ? current.mid : "m1"
    const keys = current ? [`${current.mid}/${current.lid}`] : []
    const { np, newlyUnlocked, gained } = applyDone(progress, keys, res.xp)
    np.scores = { ...(progress.scores || {}), [mid]: { c: res.correct, t: res.total } }
    const allGained = [...gained]
    const earned = new Set(np.badges)
    if (res.correct === res.total && !earned.has("quiz-ace")) { earned.add("quiz-ace"); allGained.push("quiz-ace") }
    if ((res.maxCombo || 0) >= 3 && !earned.has("combo")) { earned.add("combo"); allGained.push("combo") }
    np.badges = Array.from(earned)
    setProgress(np)
    const badges = badgeObjs(allGained)
    const mod = MODULES.find((m) => m.id === mid)
    const moduleDone = mod.lessons.every((l) => np.done.includes(`${mid}/${l.id}`))
    setNewBadges(badges)
    setResult({ ...res, courseComplete: isCourseDone(np) })
    window.__pendingCelebrate = moduleDone ? { badges, nextMod: newlyUnlocked } : null
    setScreen("results")
  }

  const closeResults = () => {
    setScreen("map")
    if (window.__pendingCelebrate) {
      const c = window.__pendingCelebrate; window.__pendingCelebrate = null
      setTimeout(() => setCelebrate(c), 250)
    }
  }

  const lessonContent = current ? getLessonContent(current.mid, current.lid) : null
  const sim = current ? findLesson(current.mid, current.lid).les.sim : null
  const SimComp = sim ? INTERACTIONS[sim] : null
  const showTabBar = TAB_SCREENS.includes(screen)

  return (
    <>
      <main style={{ maxWidth: "var(--maxw)", margin: "0 auto", paddingBottom: showTabBar ? 80 : 16 }}>
        {screen === "map" && (
          <CourseMap modules={MODULES} progress={progress} onOpenLesson={openLesson} />
        )}
        {screen === "lesson" && lessonContent && (
          <LessonScreen content={lessonContent} alreadyDone={progress.done.includes(`${current.mid}/${current.lid}`)}
            onBack={() => setScreen("map")} onComplete={completeSimpleLesson} />
        )}
        {screen === "copilot" && current && (
          <CopilotExercise ex={getCopilot(current.mid, current.lid)} alreadyDone={progress.done.includes(`${current.mid}/${current.lid}`)}
            onBack={() => setScreen("map")} onComplete={completeSimpleLesson} />
        )}
        {screen === "interactive" && current && SimComp && (
          <SimComp onBack={() => setScreen("map")} onComplete={completeSimpleLesson} onResult={() => {}} />
        )}
        {screen === "final" && current && (
          <FinalTaskScreen ex={getCopilot(current.mid, current.lid)} alreadyDone={progress.done.includes(`${current.mid}/${current.lid}`)}
            onBack={() => setScreen("map")} onComplete={completeSimpleLesson} />
        )}
        {screen === "quiz" && current && (
          <QuizRunner quiz={getQuiz(current.mid)} onBack={() => setScreen("map")} onComplete={finishQuiz} />
        )}
        {screen === "results" && result && (
          <ResultsScreen result={result} quiz={getQuiz(current ? current.mid : "m1")} newBadges={newBadges}
            courseComplete={result.courseComplete} onBackToMap={closeResults}
            onRetry={() => setScreen("quiz")} onCertificate={() => setScreen("certificate")} />
        )}
        {screen === "achievements" && (
          <AchievementsView badges={BADGES} progress={progress} onBack={() => setScreen("map")} />
        )}
        {screen === "certificate" && (
          <CertificateScreen course={COURSE} onBack={() => setScreen("map")} />
        )}
      </main>

      {showTabBar && <TabBar active={screen} onNavigate={setScreen} />}
      {celebrate && <ModuleCompleteOverlay celebrate={celebrate} onClose={() => setCelebrate(null)} />}
    </>
  )
}
```

- [ ] **Step 5: Verify**

Run `npm run dev`. The tab bar should appear at the bottom on the map and achievements screens and disappear on lesson screens. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx
git commit -m "design: remove TopBar/Hero/ThemeSwitcher, add TabBar, simplify App shell"
```

---

## Task 5: Rewrite Course Map

**Files:**
- Rewrite: `src/coursemap.jsx`

- [ ] **Step 1: Replace coursemap.jsx entirely**

```jsx
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
            // open first incomplete lesson, or last lesson if all done
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

// Legacy exports kept for App.jsx compatibility
export const COURSE_MAPS = { board: CourseMap, journey: CourseMap }
export function GlyphTile({ glyph, tone, size = 48 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: `linear-gradient(135deg,#FF3B30,#FF6B6B)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.46 }}>
      {glyph}
    </div>
  )
}
```

- [ ] **Step 2: Update App.jsx import for coursemap**

In `src/App.jsx`, update the coursemap import line:

```jsx
import { CourseMap, moduleState, unlockedSet } from './coursemap.jsx'
```

And in the render, replace `<MapComp ...>` with:

```jsx
{screen === "map" && (
  <CourseMap modules={MODULES} progress={progress} onOpenLesson={openLesson} />
)}
```

Also remove the `const MapComp = COURSE_MAPS[layout]` line and remove `layout` from state.

- [ ] **Step 3: Verify**

Run `npm run dev`. The course map should now show an iOS-style grouped list with squircle icons, progress bars on in-progress modules, green checkmarks on done modules, faded locks on locked modules.

- [ ] **Step 4: Commit**

```bash
git add src/coursemap.jsx src/App.jsx
git commit -m "design: rewrite course map as iOS grouped list with squircle icons"
```

---

## Task 6: Restyle Lesson Screen (Reading + Video)

**Files:**
- Rewrite: `src/lesson.jsx` — `VideoPlayer` and `LessonScreen` components

- [ ] **Step 1: Replace VideoPlayer**

```jsx
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
```

- [ ] **Step 2: Replace LessonScreen**

```jsx
function LessonScreen({ content, onBack, onComplete, alreadyDone }) {
  const [showTranscript, setShowTranscript] = useState(false)
  const isReading = content.kind === "reading" || content.kind === "diagnostic"
  const totalLessons = 6 // approximate; shown in breadcrumb

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
```

- [ ] **Step 3: Verify**

Open a reading lesson and a video lesson. Check: nav bar with back link, thin progress bar, content card with key points as numbered rows, sticky CTA at bottom.

- [ ] **Step 4: Commit**

```bash
git add src/lesson.jsx
git commit -m "design: restyle lesson screen (reading+video) to iOS pattern"
```

---

## Task 7: Restyle Quiz Runner

**Files:**
- Modify: `src/lesson.jsx` — `QuizRunner` component

- [ ] **Step 1: Replace QuizRunner**

```jsx
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
      <div style={{ padding: "4px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
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

      <div style={{ padding: "0 16px" }}>
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
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px 16px 28px",
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
```

- [ ] **Step 2: Verify**

Open a quiz. Check: progress dots colored correctly, question in white card, feedback banner appears after answering, XP pill shows, sticky CTA slides up after answer.

- [ ] **Step 3: Commit**

```bash
git add src/lesson.jsx
git commit -m "design: restyle quiz runner with iOS progress dots, feedback banners, sticky CTA"
```

---

## Task 8: Restyle Copilot Exercise

**Files:**
- Rewrite: `src/copilot.jsx`

- [ ] **Step 1: Read current copilot.jsx structure**

Run this to see what's exported:
```bash
grep -n "^function\|^export" src/copilot.jsx
```

- [ ] **Step 2: Replace the CopilotExercise render**

Find the `return (` in `CopilotExercise` and replace the entire JSX return with:

```jsx
  return (
    <div style={{ animation: "fade-up .3s ease", paddingBottom: 90 }}>
      <div style={{ height: 14 }} />

      {/* Nav */}
      <div style={{ padding: "4px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>תרגול · Copilot</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>נסה בעצמך</div>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600, color: "var(--accent)", cursor: "pointer", paddingBottom: 4 }}>
          ‹ חזרה
        </button>
      </div>

      <div style={{ padding: "0 16px" }}>
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
              <button onClick={() => { navigator.clipboard?.writeText(ex.prompt) }} style={{
                background: "var(--accent)", borderRadius: 8, padding: "5px 12px",
                fontSize: 12, fontWeight: 600, color: "white", border: "none", cursor: "pointer" }}>
                העתק ✓
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
                value={reflections[f.key] || ""}
                onChange={(e) => setReflections((r) => ({ ...r, [f.key]: e.target.value }))}
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
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px 16px 28px" }}>
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
```

Note: the `reflections` state and `canSubmit` logic already exist in the current `CopilotExercise` — only the JSX return is being replaced. Verify the variable names match what's defined at the top of the function.

- [ ] **Step 3: Verify**

Open a copilot lesson. Check: dark template card with "העתק" button, open-in-tool row, reflection textarea, disabled CTA until filled.

- [ ] **Step 4: Commit**

```bash
git add src/copilot.jsx
git commit -m "design: restyle copilot exercise with dark template card and iOS rows"
```

---

## Task 9: Restyle Results + Achievements

**Files:**
- Rewrite: `src/gamification.jsx` — `ResultsScreen` and `AchievementsView`

- [ ] **Step 1: Replace ResultsScreen**

```jsx
function ResultsScreen({ result, quiz, newBadges, onBackToMap, onRetry, onCertificate, courseComplete }) {
  const pct = Math.round((result.correct / result.total) * 100)
  const perfect = result.correct === result.total
  const circ = 2 * Math.PI * 52 // r=52
  const offset = circ * (1 - pct / 100)

  return (
    <div style={{ animation: "fade-up .35s ease", paddingBottom: 90 }}>
      <div style={{ height: 14 }} />
      <div style={{ padding: "4px 18px 16px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px" }}>
          {perfect ? "מושלם! 🎉" : pct >= 60 ? "כל הכבוד!" : "סיימת!"}
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{quiz.title}</div>
      </div>

      <div style={{ padding: "0 16px" }}>
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
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px 16px 28px" }}>
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
```

- [ ] **Step 2: Replace AchievementsView**

```jsx
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
      <div style={{ padding: "4px 18px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.5px", lineHeight: 1.1 }}>ההישגים שלי</div>
      </div>

      <div style={{ padding: "0 16px" }}>
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
```

- [ ] **Step 3: Verify**

Navigate to Achievements tab. Check: 3 stat pills, gradient progress bar, earned badges with green "הושג" pill, locked badges at 55% opacity. Complete a quiz and check ResultsScreen: score ring animates, stats row, badge card if earned, sticky CTAs.

- [ ] **Step 4: Commit**

```bash
git add src/gamification.jsx
git commit -m "design: restyle results screen and achievements view to iOS pattern"
```

---

## Task 10: Restyle Interactive Simulation Wrapper

**Files:**
- Modify: `src/interactions.jsx` — outer shell/wrapper for each simulation

- [ ] **Step 1: Find simulation wrapper pattern**

```bash
grep -n "onBack\|onComplete\|return (" src/interactions.jsx | head -30
```

- [ ] **Step 2: Add shared iOS nav bar helper at top of interactions.jsx**

Add this function near the top of `interactions.jsx` (after imports):

```jsx
function SimNav({ title, breadcrumb, onBack }) {
  return (
    <>
      <div style={{ height: 14 }} />
      <div style={{ padding: "4px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{breadcrumb || "סימולציה אינטראקטיבית"}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px", lineHeight: 1.2 }}>{title}</div>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600, color: "var(--accent)", cursor: "pointer", paddingBottom: 4 }}>
          ‹ חזרה
        </button>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Wrap simulation content cards**

In each simulation component, wrap content sections in iOS-style cards. Find any `<div style={{ background: "var(--surface)"` patterns and ensure they use:

```jsx
// Instruction card pattern:
<div style={{ margin: "6px 16px 12px", background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "16px 18px", boxShadow: "var(--shadow)" }}>
  {/* instruction text */}
</div>

// Sentence/main interaction card:
<div style={{ margin: "0 16px 14px", background: "var(--surface)", borderRadius: "var(--r-lg)", padding: "20px 18px", boxShadow: "var(--shadow)" }}>
  {/* interactive content */}
</div>

// Sticky CTA (replace any bottom buttons):
<div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "var(--maxw)", margin: "0 auto",
  background: "rgba(242,242,247,0.95)", borderTop: "0.5px solid var(--line-strong)",
  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px 16px 28px" }}>
  <button onClick={onComplete} style={{ width: "100%", background: "var(--accent)", borderRadius: "var(--r-lg)", padding: 16, fontSize: 16, fontWeight: 600, color: "white", border: "none", cursor: "pointer" }}>
    המשך ›
  </button>
</div>
```

- [ ] **Step 4: Add SimNav to each simulation**

For each simulation component that receives `onBack`, add `<SimNav title="[title]" onBack={onBack} />` as the first element in its return.

- [ ] **Step 5: Verify**

Navigate to an interactive lesson. Check: iOS nav bar at top, content in white cards with rounded corners, sticky CTA at bottom.

- [ ] **Step 6: Commit**

```bash
git add src/interactions.jsx
git commit -m "design: add iOS nav bar and card wrappers to interactive simulations"
```

---

## Task 11: Final Polish + Build Verification

- [ ] **Step 1: Test full user flow on mobile viewport**

In DevTools, set viewport to 390×844 (iPhone 14). Walk through:
1. Course map → scroll through all modules
2. Tap an in-progress module → lesson screen
3. Complete lesson → verify next lesson or map
4. Open a quiz → answer correct → answer wrong → finish quiz → results screen
5. Results → back to map
6. Tap Achievements tab → verify stat pills + badge lists
7. Trigger module completion to see overlay

- [ ] **Step 2: Check tab bar visibility**

Confirm tab bar appears ONLY on `map` and `achievements` screens, and is hidden on lesson/quiz/copilot/interactive/results/certificate screens.

- [ ] **Step 3: Verify accent color is #FF3B30 everywhere**

```bash
grep -rn "blue\|indigo\|#007AFF\|oklch" src/ --include="*.jsx" --include="*.css"
```

Should return no results (all old OKLCH values and blue/indigo accents are gone).

- [ ] **Step 4: Production build**

```bash
npm run build
```

Expected: Build completes with no errors. Check `dist/` has expected files.

- [ ] **Step 5: SCORM package**

```bash
npm run scorm
```

Expected: `release/ai-fundamentals-scorm.zip` created. Verify with `npm run package`.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "design: iOS redesign complete — mobile-first light theme across all screens"
```
