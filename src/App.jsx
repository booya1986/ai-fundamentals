// App.jsx — shell, navigation, progress, gamification. No tweak panel.
import React from 'react'
import { COURSE, MODULES, LESSON_CONTENT, QUIZZES, COPILOT, BADGES, INITIAL_PROGRESS } from './data.jsx'
import { Icon, Button, Card, ProgressRing, Pill, Confetti, Medal } from './ui.jsx'
import { COURSE_MAPS, moduleState, unlockedSet, GlyphTile } from './coursemap.jsx'
import { LessonScreen, QuizRunner } from './lesson.jsx'
import { CopilotExercise } from './copilot.jsx'
import { FinalTaskScreen } from './final.jsx'
import { INTERACTIONS } from './interactions.jsx'
import { ResultsScreen, AchievementsView, CertificateScreen } from './gamification.jsx'
import { scormLoad, scormSave, scormTerminate } from './scorm.js'
const { useState, useEffect } = React

function loadProgress() { return scormLoad(INITIAL_PROGRESS) }

// Map course progress → SCORM completion/score for cmi reporting.
function computeMeta(progress) {
  const allKeys = MODULES.flatMap((m) => m.lessons.map((l) => `${m.id}/${l.id}`))
  const total = allKeys.length
  const doneCount = allKeys.filter((k) => progress.done.includes(k)).length
  const scores = progress.scores || {}
  let raw = 0, max = 0
  Object.values(scores).forEach((s) => { raw += s.c; max += s.t })
  const scaled = max > 0 ? raw / max : 0
  return {
    progressMeasure: total ? doneCount / total : 0,
    completed: doneCount === total,
    scoreRaw: raw, scoreMax: max, scoreScaled: scaled, passed: scaled >= 0.7,
  }
}
function levelInfo(xp) {
  const per = 300
  return { level: Math.floor(xp / per) + 1, pct: Math.round(((xp % per) / per) * 100) }
}
function findLesson(mid, lid) {
  const mod = MODULES.find((m) => m.id === mid)
  const les = mod.lessons.find((l) => l.id === lid)
  return { mod, les }
}
function getLessonContent(mid, lid) {
  const key = `${mid}/${lid}`
  const { mod, les } = findLesson(mid, lid)
  if (LESSON_CONTENT[key]) {
    const c = LESSON_CONTENT[key]
    return { ...c, media: c.media || les.media, poster: c.poster || les.poster }
  }
  return {
    title: les.title, module: mod.title, min: les.min, kind: les.kind,
    media: les.media, poster: les.poster, videoLabel: `סרטון · ${mod.title}`,
    summary: `בשיעור זה נעמיק ב"${les.title}" כחלק מהמודול "${mod.title}". ${mod.tagline}.`,
    keypoints: [
      { h: "הרעיון המרכזי", t: "נבין את המושג העיקרי דרך דוגמה מהעבודה היומיומית בבנק." },
      { h: "יישום בפועל", t: "נראה איך הנושא מתחבר למשימות אמיתיות." },
      { h: "טעויות נפוצות", t: "נזהה מלכודות שכדאי להימנע מהן." },
    ],
    transcript: "תמלול/הרחבה לדוגמה. בגרסה המלאה כאן יופיע התוכן המלא, מסונכרן עם ההסבר.",
  }
}
function getQuiz(mid) {
  if (QUIZZES[mid]) return QUIZZES[mid]
  const mod = MODULES.find((m) => m.id === mid)
  return { title: `בדיקת הבנה: ${mod.title}`, module: mod.title, xpPerCorrect: 20, questions: [
    { id: "ph", type: "tf", prompt: `סיימתם את ${mod.title}. מוכנים להמשיך?`, correct: true, explain: "מצוין! (שאלות התוכן למודול זה יתווספו בהמשך.)" },
  ] }
}
function getCopilot(mid, lid) {
  const key = `${mid}/${lid}`
  if (COPILOT[key]) return COPILOT[key]
  const { mod, les } = findLesson(mid, lid)
  return {
    title: les.title, module: mod.title,
    tool: { name: "Copilot", url: "#", alt: [{ name: "ChatGPT (Citrix)", url: "#" }] },
    intro: `תרגול יישומי: ${les.title}. (הפרומפט המלא יתווסף בהמשך.)`,
    security: "אבטחת מידע: אין להעלות פרטי לקוחות, נתונים פיננסיים או מידע עסקי רגיש. תיאורים כלליים בלבד.",
    prompt: "כתבו כאן את הבקשה שלכם לכלי, לפי מה שלמדתם.",
    steps: ["העתיקו את הפרומפט", "פתחו את הכלי והדביקו", "בדקו את התוצאה"],
    reflect: { fields: [{ key: "worked", label: "מה עבד טוב?" }, { key: "improve", label: "מה אשפר בפעם הבאה?" }] },
  }
}

/* ---------- Module-complete celebration: earned badges + next-module unlock ---------- */
function ModuleCompleteOverlay({ celebrate, onClose }) {
  const { badges = [], nextMod } = celebrate
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 5000, display: "grid", placeItems: "center", padding: 20,
      background: "oklch(0.2 0.02 270 / 0.55)", backdropFilter: "blur(7px)", animation: "fade-in .25s ease", overflowY: "auto" }}>
      <Confetti run={true} />
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", maxWidth: 440, width: "100%",
        boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)", padding: "34px 32px", textAlign: "center",
        animation: "unlock-pop .5s cubic-bezier(.2,.8,.2,1)", margin: "auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-head)", fontWeight: 800, color: "var(--success)", letterSpacing: ".06em", fontSize: 14, marginBottom: 4 }}><Icon name="star" size={16} fill /> כל הכבוד!</div>
        <h2 style={{ fontSize: 25, marginBottom: badges.length ? 18 : 8 }}>סיימת את המודול</h2>

        {badges.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--accent-ink)", marginBottom: 12 }}>הרווחת {badges.length > 1 ? "באדג'ים" : "באדג'"}:</div>
            <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
              {badges.map((b) => (
                <div key={b.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "pop-in .5s cubic-bezier(.2,.8,.2,1)" }}>
                  <Medal glyph={b.glyph} tone={b.tone} size={66} shine />
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 13.5 }}>{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextMod && (
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginTop: 4 }}>
            <div style={{ position: "relative", display: "grid", placeItems: "center", marginBottom: 12, height: 92 }}>
              <span style={{ position: "absolute", width: 92, height: 92, borderRadius: "50%",
                border: `3px solid oklch(0.7 0.18 ${nextMod.color})`, animation: "ring-ping 1s ease-out .2s" }} />
              {/* lock bursts away, glyph revealed */}
              <span style={{ position: "absolute", zIndex: 2, animation: "lock-burst .7s ease forwards" }}>
                <Icon name="lock" size={34} style={{ color: "var(--muted)" }} />
              </span>
              <GlyphTile glyph={nextMod.glyph} tone={nextMod.color} state="active" size={80} />
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--accent)", letterSpacing: ".06em", fontSize: 13, marginBottom: 6 }}><Icon name="unlock" size={15} /> המודול הבא נפתח!</div>
            <h3 style={{ fontSize: 20, marginBottom: 4 }}>{nextMod.title}</h3>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", margin: "0 0 8px", lineHeight: 1.5 }}>{nextMod.tagline}</p>
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          <Button variant="primary" size="lg" iconEnd="arrowback" onClick={onClose}>{nextMod ? "קדימה למודול הבא!" : "המשך במסע"}</Button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Theme switcher (3 modern design options) ---------- */
const THEME_OPTIONS = [
  { id: "aurora", name: "Aurora", sub: "בהיר ורך", dot: "linear-gradient(135deg,#ffd6e0,#d9c7ff,#c7f5e6)" },
  { id: "midnight", name: "Midnight", sub: "כהה מודרני", dot: "linear-gradient(135deg,#2a2350,#ff453a)" },
  { id: "editorial", name: "Editorial", sub: "נקי וחד", dot: "linear-gradient(135deg,#ffffff,#5b5bd6)" },
]
function ThemeSwitcher({ theme, setTheme }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: "fixed", left: 16, bottom: 16, zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
      {open && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r)", boxShadow: "var(--shadow-lg)", padding: 8, display: "grid", gap: 6, minWidth: 196, animation: "fade-up .2s ease" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", padding: "4px 8px" }}>בחירת עיצוב</div>
          {THEME_OPTIONS.map((t) => (
            <button key={t.id} onClick={() => { setTheme(t.id); setOpen(false) }} style={{
              display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: "var(--r-sm)",
              border: `1.5px solid ${theme === t.id ? "var(--accent)" : "transparent"}`,
              background: theme === t.id ? "var(--accent-soft)" : "transparent", cursor: "pointer", textAlign: "start" }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, background: t.dot, flex: "none", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)" }} />
              <span>
                <span style={{ display: "block", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{t.name}</span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.sub}</span>
              </span>
              {theme === t.id && <Icon name="check" size={16} stroke={3} style={{ color: "var(--accent)", marginInlineStart: "auto" }} />}
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} title="בחירת עיצוב" aria-label="בחירת עיצוב" style={{
        width: 50, height: 50, borderRadius: "50%", border: "none", background: "var(--accent)", color: "#fff",
        boxShadow: "var(--shadow)", cursor: "pointer", display: "grid", placeItems: "center" }}>
        <Icon name="sparkles" size={22} fill />
      </button>
    </div>
  )
}

/* ---------- responsive helper ---------- */
function useIsMobile(bp = 560) {
  const [m, setM] = useState(typeof window !== "undefined" && window.matchMedia ? window.matchMedia(`(max-width:${bp}px)`).matches : false)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia(`(max-width:${bp}px)`)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [bp])
  return m
}

/* ---------- Top bar (responsive) ---------- */
function TopBar({ progress, onAchievements, onHome }) {
  const li = levelInfo(progress.xp)
  const mobile = useIsMobile()
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100, background: "color-mix(in oklch, var(--bg), transparent 12%)",
      backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: mobile ? "9px 12px" : "12px 22px", display: "flex", alignItems: "center", gap: mobile ? 7 : 12 }}>
        <button onClick={onHome} title="למפת הקורס" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-head)", fontWeight: 800, fontSize: mobile ? 15 : 18, color: "var(--ink)", flex: "none" }}>
          מפת הקורס
        </button>
        <div style={{ flex: 1 }} />
        {/* XP */}
        <div title={`${progress.xp} XP`} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--accent-soft)", color: "var(--accent-ink)",
          padding: mobile ? "6px 10px" : "7px 13px", borderRadius: 999, fontFamily: "var(--font-head)", fontWeight: 700, fontSize: mobile ? 13.5 : 15.5, flex: "none" }}>
          <Icon name="bolt" size={mobile ? 15 : 17} fill /> {progress.xp}{!mobile && " XP"}
        </div>
        {/* level */}
        <div title={`רמה ${li.level} · ${li.pct}% לרמה הבאה`} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--surface)",
          border: "1px solid var(--line)", borderRadius: 999, padding: mobile ? "3px" : "4px 13px 4px 5px", boxShadow: "var(--shadow-sm)", flex: "none" }}>
          <ProgressRing value={li.pct} size={mobile ? 30 : 32} stroke={4}>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 12.5, color: "var(--accent-ink)" }}>{li.level}</span>
          </ProgressRing>
          {!mobile && <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14.5, color: "var(--ink-soft)" }}>רמה {li.level}</span>}
        </div>
        {/* achievements */}
        <button onClick={onAchievements} title="ההישגים שלי" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-soft)",
          color: "var(--accent-ink)", border: "1px solid transparent", borderRadius: 999, padding: mobile ? "8px" : "8px 15px", cursor: "pointer",
          fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14.5, boxShadow: "var(--shadow-sm)", flex: "none" }}>
          <Icon name="trophy" size={mobile ? 18 : 17} fill />{!mobile ? " ההישגים שלי" : ""}
        </button>
      </div>
    </div>
  )
}

/* ---------- Hero + layout switch ---------- */
function Hero({ progress, onContinue, layout, setLayout }) {
  const totalLessons = MODULES.reduce((a, m) => a + m.lessons.length, 0)
  const doneCount = progress.done.length
  const pct = Math.round((doneCount / totalLessons) * 100)
  let next = null
  for (const m of MODULES) { for (const l of m.lessons) { if (!progress.done.includes(`${m.id}/${l.id}`)) { next = { m, l }; break } } if (next) break }
  const layouts = [{ k: "board", label: "לוח", icon: "grid" }, { k: "journey", label: "מסע", icon: "map" }]
  const L = { ink: "var(--ink)", soft: "var(--ink-soft)", muted: "var(--muted)" }

  return (
    <div style={{ marginBottom: 30 }}>
      <Card pad={0} style={{ overflow: "hidden", border: "1px solid var(--line)", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30, padding: "34px", alignItems: "center",
          background: "linear-gradient(125deg, var(--surface-2), var(--accent-soft))" }}>
          <div style={{ flex: "1 1 320px" }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 14.5, color: "var(--accent)", marginBottom: 8 }}>שלום, נעים לראות אותך</div>
            <h1 style={{ fontSize: 33, marginBottom: 10, lineHeight: 1.15, letterSpacing: "-0.02em", color: L.ink }}>{COURSE.title}</h1>
            <p style={{ fontSize: 16.5, color: L.soft, margin: "0 0 22px", maxWidth: 440 }}>{COURSE.subtitle}</p>
            {next && <Button variant="primary" size="lg" iconEnd="arrowback" onClick={() => onContinue(next.m.id, next.l.id)}>
              {doneCount > 0 ? "המשך מאיפה שעצרת" : "התחל את הקורס"}
            </Button>}
          </div>
          <div style={{ flex: "0 0 auto", display: "grid", placeItems: "center" }}>
            <ProgressRing value={pct} size={142} stroke={13} from="var(--accent)" to="var(--accent-deep)" track="var(--line)">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 36, lineHeight: 1, color: L.ink }}>{pct}%</div>
                <div style={{ fontSize: 13, color: L.muted, fontWeight: 600 }}>{doneCount}/{totalLessons} שיעורים</div>
              </div>
            </ProgressRing>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, letterSpacing: "-0.01em" }}>מפת הקורס</h2>
        <div style={{ display: "inline-flex", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 999, padding: 4, gap: 2 }}>
          {layouts.map((l) => {
            const on = layout === l.k
            return (
              <button key={l.k} onClick={() => setLayout(l.k)} style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 999, border: "none",
                background: on ? "var(--accent)" : "transparent", color: on ? "#fff" : "var(--ink-soft)",
                fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 14.5, cursor: "pointer", transition: "all .15s ease",
              }}>
                <Icon name={l.icon} size={17} /> {l.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------- App ---------- */
function App() {
  const [screen, setScreen] = useState("map")
  const [layout, setLayout] = useState("board")
  const [progress, setProgress] = useState(loadProgress)
  const [current, setCurrent] = useState(null) // {mid, lid}
  const [result, setResult] = useState(null)
  const [newBadges, setNewBadges] = useState([])
  const [celebrate, setCelebrate] = useState(null)
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("ai-course-theme") || "aurora" } catch (e) { return "aurora" } })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem("ai-course-theme", theme) } catch (e) {}
  }, [theme])

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

  // Pure: compute next progress + newly-unlocked module + gained badge ids.
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
    if (window.__pendingCelebrate) { const c = window.__pendingCelebrate; window.__pendingCelebrate = null; setTimeout(() => setCelebrate(c), 250) }
  }

  const MapComp = COURSE_MAPS[layout]
  const lessonContent = current ? getLessonContent(current.mid, current.lid) : null
  const sim = current ? findLesson(current.mid, current.lid).les.sim : null
  const SimComp = sim ? INTERACTIONS[sim] : null

  return (
    <>
      <TopBar progress={progress} onAchievements={() => setScreen("achievements")} onHome={() => setScreen("map")} />

      <main style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "30px 22px 128px" }}>
        {screen === "map" && (
          <>
            <Hero progress={progress} onContinue={openLesson} layout={layout} setLayout={setLayout} />
            <MapComp modules={MODULES} progress={progress} onOpenLesson={openLesson} onLocked={() => {}} />
          </>
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
          <ResultsScreen result={result} quiz={getQuiz(current ? current.mid : "m1")} newBadges={newBadges} courseComplete={result.courseComplete}
            onBackToMap={closeResults} onRetry={() => setScreen("quiz")} onCertificate={() => setScreen("certificate")} />
        )}
        {screen === "achievements" && (
          <AchievementsView badges={BADGES} progress={progress} onBack={() => setScreen("map")} />
        )}
        {screen === "certificate" && (
          <CertificateScreen course={COURSE} onBack={() => setScreen("map")} />
        )}
      </main>

      {celebrate && <ModuleCompleteOverlay celebrate={celebrate} onClose={() => setCelebrate(null)} />}
      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </>
  )
}

export default App
