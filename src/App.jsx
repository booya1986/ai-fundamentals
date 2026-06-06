import React from 'react'
import { COURSE, MODULES, LESSON_CONTENT, QUIZZES, COPILOT, BADGES, INITIAL_PROGRESS } from './data.jsx'
import { Icon, Button, Confetti, Medal, TabBar } from './ui.jsx'
import { CourseMap, moduleState, unlockedSet } from './coursemap.jsx'
import { LessonScreen, QuizRunner } from './lesson.jsx'
import { CopilotExercise } from './copilot.jsx'
import { FinalTaskScreen } from './final.jsx'
import { INTERACTIONS } from './interactions.jsx'
import { ResultsScreen, AchievementsView, CertificateScreen } from './gamification.jsx'
import { scormLoad, scormSave, scormTerminate } from './scorm.js'
const { useState, useEffect } = React

/* ---------- Diagnostic gate — shown after M0 video, before optional quiz ---------- */
function DiagnosticGate({ onSkip, onStart }) {
  return (
    <div style={{ padding: "0 var(--side-pad, 16px) 40px", animation: "fade-up .3s ease" }}>
      <div style={{ height: 56, display: "flex", alignItems: "center" }}>
        <button onClick={onSkip} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600, color: "var(--accent)", cursor: "pointer", fontFamily: "var(--font-head)" }}>
          ‹ חזרה
        </button>
      </div>
      <div style={{ textAlign: "center", fontSize: 52, marginBottom: 18 }}>🎯</div>
      <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, letterSpacing: "-.3px", marginBottom: 20 }}>שאלון אבחון</h2>
      <div style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", padding: "20px 22px", boxShadow: "var(--shadow)", marginBottom: 24, fontSize: 16, lineHeight: 1.7, color: "var(--ink-soft)", textAlign: "center" }}>
        השאלון נועד כדי לקבוע את הרמה שלכם ולהתאים את המשך הלמידה.<br />
        אנחנו ממליצים לעשות אותו.
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button onClick={onSkip} style={{
          flex: 1, padding: "14px 0", borderRadius: "var(--r-lg)", border: "1.5px solid var(--line)",
          background: "transparent", fontSize: 15, fontWeight: 600, color: "var(--muted)",
          cursor: "pointer", fontFamily: "var(--font-head)",
        }}>דלג</button>
        <button onClick={onStart} style={{
          flex: 2, padding: "14px 0", borderRadius: "var(--r-lg)", border: "none",
          background: "var(--accent)", fontSize: 15, fontWeight: 700, color: "#fff",
          cursor: "pointer", fontFamily: "var(--font-head)",
        }}>לביצוע ›</button>
      </div>
      <div style={{ background: "rgba(255,149,0,.1)", border: "1px solid rgba(255,149,0,.25)", borderRadius: "var(--r-lg)", padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⭐</span>
        <span style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          השלמת השאלון תזכה אותך ב-<strong>240 XP בונוס</strong> וחוויית למידה מותאמת יותר.
        </span>
      </div>
    </div>
  )
}

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
  const MODULE_GRADIENTS = {
    m0: "linear-gradient(135deg,#636366,#48484A)", m1: "linear-gradient(135deg,#FF3B30,#FF6B6B)",
    m2: "linear-gradient(135deg,#FF9500,#FFCC00)", m3: "linear-gradient(135deg,#AF52DE,#BF5AF2)",
    m4: "linear-gradient(135deg,#34C759,#30D158)", m5: "linear-gradient(135deg,#0A84FF,#32ADE6)",
    m6: "linear-gradient(135deg,#FF2D55,#FF375F)", m7: "linear-gradient(135deg,#5856D6,#6E6DD0)",
    m8: "linear-gradient(135deg,#FFCC00,#FF9500)",
  }
  const MODULE_EMOJIS = {
    m0: "🎯", m1: "🧠", m2: "🛠️", m3: "✍️",
    m4: "⚡", m5: "🔬", m6: "🛡️", m7: "🤖", m8: "🎓",
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
                {MODULE_EMOJIS[nextMod.id] || "📚"}
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

const TAB_SCREENS = ["map", "achievements"]

/* ---------- App ---------- */
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

  const resetProgress = () => {
    localStorage.removeItem('ai-course-progress-v1')
    setProgress(JSON.parse(JSON.stringify(INITIAL_PROGRESS)))
    setScreen('map')
    setCurrent(null)
    setResult(null)
    setNewBadges([])
    setCelebrate(null)
  }

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
      const modDone = m.lessons.filter((l) => !l.optional).every((l) => np.done.includes(`${m.id}/${l.id}`))
      if (modDone) { add("module-done"); if (m.id === "m3") add("prompt-pro"); if (m.id === "m6") add("safe-pro") }
    })
    if (MODULES.every((m) => m.lessons.filter((l) => !l.optional).every((l) => np.done.includes(`${m.id}/${l.id}`)))) add("graduate")
    np.badges = Array.from(earned)
    const after = unlockedSet(MODULES, np)
    const newlyUnlocked = MODULES.find((m) => after.has(m.id) && !before.has(m.id))
    return { np, newlyUnlocked, gained }
  }
  const badgeObjs = (ids) => ids.map((id) => BADGES.find((b) => b.id === id)).filter(Boolean)
  const isCourseDone = (p) => MODULES.every((m) => m.lessons.filter((l) => !l.optional).every((l) => p.done.includes(`${m.id}/${l.id}`)))

  const completeSimpleLesson = () => {
    if (!current) return
    const key = `${current.mid}/${current.lid}`
    const { mod } = findLesson(current.mid, current.lid)
    const i = mod.lessons.findIndex((l) => l.id === current.lid)
    const nextLes = mod.lessons[i + 1]
    if (progress.done.includes(key)) {
      // Revision mode — lesson already done, just navigate forward without awarding XP
      if (current.mid === "m0" && current.lid === "l1") { setScreen("diagnostic-gate"); return }
      if (nextLes) openLesson(current.mid, nextLes.id)
      else setScreen("map")
      return
    }
    const { np, newlyUnlocked, gained } = applyDone(progress, [key], 10)
    setProgress(np)
    if (current.mid === "m0" && current.lid === "l1") { setScreen("diagnostic-gate"); return }
    const moduleDone = mod.lessons.filter((l) => !l.optional).every((l) => np.done.includes(`${mod.id}/${l.id}`))
    if (isCourseDone(np)) { setScreen("certificate"); return }
    if (moduleDone) { setCelebrate({ badges: badgeObjs(gained), nextMod: newlyUnlocked }); setScreen("map") }
    else if (nextLes) openLesson(current.mid, nextLes.id)
    else setScreen("map")
  }

  const finishQuiz = (res) => {
    const mid = current ? current.mid : "m1"
    const keys = current ? [`${current.mid}/${current.lid}`] : []
    if (keys.length > 0 && progress.done.includes(keys[0])) {
      // Revision mode — quiz already done, show results without updating progress
      setNewBadges([])
      setResult({ ...res, courseComplete: isCourseDone(progress) })
      window.__pendingCelebrate = null
      setScreen("results")
      return
    }
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
    const moduleDone = mod.lessons.filter((l) => !l.optional).every((l) => np.done.includes(`${mid}/${l.id}`))
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
      {/* Dot-grid bg + soft red blob — pure CSS, no external deps, SCORM-safe */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 560, height: 560, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,59,48,0.16) 0%, transparent 65%)",
          filter: "blur(50px)", top: -140, right: -140,
          animation: "blob-float 14s ease-in-out infinite alternate",
        }} />
      </div>
      <main style={{ position: "relative", zIndex: 1, maxWidth: "var(--maxw)", margin: "0 auto", paddingBottom: showTabBar ? 80 : 16 }}>
        {screen === "map" && (
          <CourseMap modules={MODULES} progress={progress} onOpenLesson={openLesson} />
        )}
        {screen === "map" && (
          <button onClick={resetProgress} title="איפוס התקדמות" style={{
            position: "fixed", bottom: showTabBar ? 90 : 16, left: 16,
            zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
            border: "1px solid #DDD", color: "#AAA", fontSize: 11,
            padding: "5px 10px", borderRadius: 8, cursor: "pointer",
            fontFamily: "inherit", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}>
            ↺ איפוס
          </button>
        )}
        {screen === "diagnostic-gate" && (
          <DiagnosticGate onSkip={() => setScreen("map")} onStart={() => openLesson("m0", "l2")} />
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

export default App
