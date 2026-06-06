// interactions.jsx — re-implemented interactive simulations (faithful to the SCORM originals).
import React from 'react'
import { Icon, Button, Card, ProgressBar } from './ui.jsx'
import { MCQ } from './exercises.jsx'
const { useState } = React

/* shared header */
function SimHeader({ module: mod, title, onBack }) {
  return (
    <>
      <div style={{ height: 14 }} />
      <div style={{ padding: "4px var(--side-pad, 18px) 8px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{mod || "סימולציה אינטראקטיבית"}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.3px", lineHeight: 1.2 }}>{title}</div>
        </div>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 600, color: "var(--accent)", cursor: "pointer", paddingBottom: 4 }}>
          ‹ חזרה
        </button>
      </div>
    </>
  )
}

/* ============ 10657 — WordPredictionSim ============ */
const WP_EXAMPLES = [
  { context: "החתול ישב על ה___",
    candidates: [{ w: "שטיח", p: 60, win: true }, { w: "ספה", p: 32 }, { w: "כיסא", p: 8 }],
    explain: "השלמה קלאסית — 'שטיח' מופיע המון פעמים אחרי 'החתול ישב על' בספרי ילדים ובדוגמאות לימוד." },
  { context: "בוקר טוב, מה ___",
    candidates: [{ w: "שלומך", p: 71, win: true }, { w: "קורה", p: 23 }, { w: "נשמע", p: 6 }],
    explain: "רצף נפוץ מאוד בשיחות יומיומיות — לכן ההסתברות הגבוהה." },
  { context: "בירת אוסטרליה היא ___",
    candidates: [{ w: "סידני", p: 64, win: true }, { w: "קנברה", p: 30, truth: true }, { w: "מלבורן", p: 6 }],
    hallucination: true,
    explain: "רגע קריטי! המודל בחר ב'סידני' למרות שהבירה היא קנברה — כי סידני מוזכרת הרבה יותר בטקסטים (חדשות, טיולים). זו דוגמה ל-הזיה (Hallucination): המודל משיב בביטחון מלא, אבל טועה עקב הסטטיסטיקה." },
]

function WordPredictionSim({ module = "איך AI באמת חושב", title = "השלמת מילים לפי הסתברויות", onBack, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [guess, setGuess] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const ex = WP_EXAMPLES[idx]
  const isLast = idx === WP_EXAMPLES.length - 1
  const winner = ex.candidates.find((c) => c.win)
  const next = () => {
    if (isLast) { onComplete && onComplete(); return }
    setIdx((i) => i + 1); setGuess(null); setRevealed(false)
  }
  return (
    <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", animation: "fade-up .35s ease", paddingBottom: 90 }}>
      <SimHeader module={module} title={title} onBack={onBack} />
      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ flex: 1 }}><ProgressBar value={((idx + (revealed ? 1 : 0)) / WP_EXAMPLES.length) * 100} height={9} /></div>
        <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>משפט {idx + 1} / {WP_EXAMPLES.length}</span>
      </div>

      <Card pad={26} style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 10 }}>מה המילה הסבירה ביותר להשלמת המשפט?</div>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "var(--font-head)", marginBottom: 22, lineHeight: 1.4 }}>{ex.context}</div>

        {!revealed ? (
          <>
            <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
              {ex.candidates.map((c) => (
                <button key={c.w} onClick={() => setGuess(c.w)} style={{
                  display: "flex", alignItems: "center", gap: 12, textAlign: "right", padding: "14px 18px",
                  borderRadius: "var(--r)", border: `1.5px solid ${guess === c.w ? "var(--accent)" : "var(--line)"}`,
                  background: guess === c.w ? "var(--accent-soft)" : "var(--surface)", color: "var(--ink)",
                  fontSize: 18, fontFamily: "var(--font-head)", fontWeight: 600, cursor: "pointer", transition: "all .15s ease",
                }}>{c.w}</button>
              ))}
            </div>
            <Button variant="primary" icon="bolt" disabled={!guess} onClick={() => setRevealed(true)}>הרץ חישוב הסתברויות</Button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--muted)", marginBottom: 12 }}>מאחורי הקלעים — ההסתברויות שהמודל חישב:</div>
            <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
              {[...ex.candidates].sort((a, b) => b.p - a.p).map((c) => {
                const isWin = c.win
                const tone = isWin ? "var(--accent)" : "var(--muted)"
                return (
                  <div key={c.w}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 15.5, fontWeight: 700 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: isWin ? "var(--accent-ink)" : "var(--ink)" }}>
                        {c.w}
                        {isWin && <span style={{ fontSize: 11.5, color: "#fff", background: "var(--accent)", padding: "2px 8px", borderRadius: 999 }}>נבחר</span>}
                        {c.truth && <span style={{ fontSize: 11.5, color: "var(--success)", background: "var(--success-soft)", padding: "2px 8px", borderRadius: 999 }}>התשובה הנכונה</span>}
                        {c.w === guess && <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>(הניחוש שלך)</span>}
                      </span>
                      <span style={{ color: tone, fontVariantNumeric: "tabular-nums" }}>{c.p}%</span>
                    </div>
                    <div style={{ height: 12, borderRadius: 999, background: "var(--line-soft)", overflow: "hidden" }}>
                      <div style={{ width: `${c.p}%`, height: "100%", borderRadius: 999,
                        background: isWin ? "linear-gradient(90deg, var(--accent), var(--accent-deep))" : "var(--line)",
                        transition: "width .7s cubic-bezier(.2,.8,.2,1)" }} />
                    </div>
                  </div>
                )
              })}
            </div>
            {ex.hallucination ? (
              <div style={{ borderRadius: "var(--r)", overflow: "hidden", border: "2px solid var(--danger)", boxShadow: "0 10px 30px color-mix(in oklch, var(--danger), transparent 78%)", animation: "pop-in .4s cubic-bezier(.2,.8,.2,1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--danger)", color: "#fff" }}>
                  <Icon name="flame" size={22} fill />
                  <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 17 }}>רגע! זה השיעור הכי חשוב כאן</span>
                </div>
                <div style={{ padding: "16px 18px", background: "var(--danger-soft)" }}>
                  <div style={{ fontSize: 16, color: "var(--ink)", lineHeight: 1.7, marginBottom: 12 }}>{ex.explain}</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 14px", borderRadius: "var(--r-sm)", background: "var(--surface)", border: "1px solid color-mix(in oklch, var(--danger), transparent 60%)" }}>
                    <span style={{ flex: "none", width: 30, height: 30, borderRadius: 9, background: "var(--danger)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="lightbulb" size={18} /></span>
                    <span style={{ fontSize: 15.5, fontWeight: 700, color: "var(--danger)" }}>הזיה (Hallucination) = תשובה משכנעת אך שגויה. רהיטות אינה ראיה לדיוק — תמיד מאמתים מול מקור מהימן.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "14px 16px", borderRadius: "var(--r)", background: "var(--bg-2)", border: "1px solid var(--line)" }}>
                <div style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{ex.explain}</div>
              </div>
            )}
            <div style={{ marginTop: 18 }}>
              <Button variant="primary" iconEnd="arrowback" onClick={next}>{isLast ? "סיום הסימולציה" : "המשפט הבא"}</Button>
            </div>
          </>
        )}
      </Card>
      {isLast && revealed && (
        <Card style={{ background: "var(--surface-2)" }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 17, marginBottom: 6 }}>שורה תחתונה</div>
          <div style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>
            המודל הוא מנוע ניחוש סטטיסטי — הוא לא "מבין" משמעות, אלא מנחש איזו מילה הכי סבירה. ככל שההקשר ארוך יותר, קל לו יותר לדייק. אבל הוא יכול לשקר בביטחון מלא (הזיה) — לכן <b>תמיד בודקים עובדות מול מקור מהימן</b>.
          </div>
          <div style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
            <b>ולמה אותה שאלה נותנת תשובות שונות בכל פעם?</b> אחרי חישוב ההסתברויות יש מידת אקראיות שנקראת <b>טמפרטורה</b>: נמוכה = תשובות עקביות וזהירות; גבוהה = יותר יצירתיות ומגוון. זו הסיבה שהתשובה משתנה בין הרצות — לא כי המודל "שינה את דעתו". למשימות עובדתיות כדאי לבקש "תשובה עקבית", ולהריץ שוב ולהשוות כשחשוב לדייק.
          </div>
        </Card>
      )}
      </div>
    </div>
  )
}

/* ============ 10658 — ToolsDifferencesSim ============ */
const TD_STEPS = [
  { type: "teach", title: "המנוע הסטטיסטי: מה קורה בפנים?", body: [
    "רובנו כבר התנסינו בשיחה עם ChatGPT — כותבים שאלה, ומקבלים תשובה רהוטה. זה מרגיש כמו קסם.",
    "אבל מתחת למכסה המנוע אין קסם — יש מערכת לומדת. ה-AI לא עובד כמו תוכנה רגילה שקיבלה הוראות מראש, אלא כמו 'מוח דיגיטלי' שלמד לזהות דפוסים ולחזות מה סביר שיקרה הלאה.",
  ]},
  { type: "teach", title: "טוקנים (Tokens)", body: [
    "המודל לא רואה מילים כמונו. הוא מפרק כל טקסט ליחידות קטנות הנקראות טוקנים (חלקי מילים או תווים).",
    "כל טוקן מתורגם למספר בתוך מרחב מתמטי עצום — כך מילים עם משמעות דומה נמצאות קרוב זו לזו במרחב הדיגיטלי.",
  ]},
  { type: "teach", title: "מנגנון תשומת הלב (Attention)", body: [
    "מה שהפך מודלים מודרניים לחזקים כל כך הוא ארכיטקטורת ה-Transformer (מהמאמר 'Attention Is All You Need', 2017). במקום לקרוא מילה-אחר-מילה ולשכוח, המודל 'שוקל' עד כמה כל מילה רלוונטית לכל מילה אחרת — ומעבד את כל המשפט במקביל.",
    "המשמעות המעשית בשבילכם: ככל שתספקו הקשר עשיר ומסודר בפרומפט, יש למנגנון יותר אותות רלוונטיים לשקלל — ולכן התשובה מדויקת וקוהרנטית יותר. ('תשומת לב' כאן היא שקלול מתמטי, לא מודעות.)",
  ]},
  { type: "teach", title: "לא מנוע חיפוש", body: [
    "בניגוד לגוגל, שמחפש מידע קיים ומציג אותו — מודל AI יוצר את התשובה מחדש בכל פעם, על בסיס הדפוסים שלמד.",
    "זו הסיבה שהוא יכול להיות יצירתי, אבל גם לטעות בביטחון עצמי מלא.",
  ]},
  { type: "check", id: "c1",
    prompt: "מדוע שאלה זהה שתשאלו ב-ChatGPT וב-Claude תניב תוצאות שונות?",
    options: ["כי האתרים מעוצבים בצבעים שונים", "כי כל כלי משתמש במודל (מנוע) אחר שאומן על נתונים שונים", "כי האינטרנט שלהם עובד במהירות שונה"],
    correct: 1, explain: "ההבדל אינו ב'עטיפה' (האתר) אלא ב'מנוע' (המודל) — לכל מודל ארכיטקטורה ונתוני אימון שונים." },
  { type: "check", id: "c2",
    prompt: "קיבלתם תשובה שנראית מקצועית מאוד אך כוללת נתון בנקאי לא הגיוני. מה סביר שקרה?",
    options: ["המודל הִזה (Hallucination) — השלים תבנית סטטיסטית שנראית נכונה אך שגויה", "המודל כועס על השאלה ששאלתם", "השרת של הבנק נפל"],
    correct: 0, explain: "הזיות הן חלק בלתי נפרד ממודלים סטטיסטיים — הם תמיד ינסו לתת תשובה רהוטה, גם אם אינה נכונה." },
  { type: "teach", title: "היררכיית הבינה: מ-GenAI ועד LLM", body: [
    "בינה מלאכותית (AI) היא המטרייה הרחבה. בתוכה למידת מכונה (ML), ובתוכה למידה עמוקה (DL).",
    "Generative AI הוא ענף שמייצר תוכן חדש, ו-LLM (מודל שפה גדול) הוא סוג של GenAI שמתמחה בשפה.",
  ]},
  { type: "teach", title: "מודל בסיס מול Fine-tuning", body: [
    "מודל בסיס (Foundation) הוא כללי ורחב — אומן על כמות עצומה של טקסט מהעולם.",
    "Fine-tuning הוא תהליך שבו לוקחים מודל כללי והופכים אותו למומחה בתחום ספציפי (כמו בנקאות) — כאן קורה 'הקסם' הארגוני.",
  ]},
  { type: "check", id: "c3",
    prompt: "מהו ההבדל המרכזי בין מודל בסיס (Foundation) למודל שעבר Fine-tuning?",
    options: ["מודל בסיס בחינם ומודל Fine-tuned עולה כסף", "אין הבדל, אלו שמות שונים לאותו דבר", "מודל בסיס כללי ורחב, בעוד Fine-tuned אומן להיות מומחה בתחום ספציפי"],
    correct: 2, explain: "Fine-tuning הוא תהליך הפיכת המודל הכללי למומחה תוכן ספציפי." },
  { type: "check", id: "c4",
    prompt: "אתם צריכים לסכם דוח כספי ארוך של לקוח. באיזו יכולת של המודל תשתמשו?",
    options: ["יכולת הסקה (Reasoning) וניתוח טקסט", "יכולת יצירת תמונות (Text-to-Image)", "חיפוש בגוגל"],
    correct: 0, explain: "סיכום וניתוח לוגי של מסמכים הם מהיכולות החזקות ביותר של מודלי שפה (LLMs)." },
]

function ToolsDifferencesSim({ module = "איך AI באמת חושב", title = "ההבדלים בין הכלים", onBack, onComplete, onResult }) {
  const [step, setStep] = useState(0)
  const [answered, setAnswered] = useState(false)
  const s = TD_STEPS[step]
  const isLast = step === TD_STEPS.length - 1
  const next = () => { if (isLast) { onComplete && onComplete(); return } setStep((i) => i + 1); setAnswered(false) }
  return (
    <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", animation: "fade-up .35s ease", paddingBottom: 90 }}>
      <SimHeader module={module} title={title} onBack={onBack} />
      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ flex: 1 }}><ProgressBar value={((step + (answered || s.type === "teach" ? 1 : 0)) / TD_STEPS.length) * 100} height={9} /></div>
        <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14, color: "var(--muted)" }}>{step + 1} / {TD_STEPS.length}</span>
      </div>

      <Card pad={26} style={{ marginBottom: 18 }}>
        {s.type === "teach" ? (
          <>
            <h2 style={{ fontSize: 22, marginBottom: 14 }}>{s.title}</h2>
            {s.body.map((p, i) => <p key={i} style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-soft)", margin: "0 0 12px" }}>{p}</p>)}
            <div style={{ marginTop: 8 }}><Button variant="primary" iconEnd="arrowback" onClick={next}>{isLast ? "סיום" : "הבנתי, המשך"}</Button></div>
          </>
        ) : (
          <>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--accent-ink)", background: "var(--accent-soft)", padding: "4px 11px", borderRadius: 999, marginBottom: 14 }}>בדיקת הבנה</div>
            <h2 style={{ fontSize: 21, lineHeight: 1.35, marginBottom: 20 }}>{s.prompt}</h2>
            <MCQ key={s.id} q={s} onResult={(ok) => { setAnswered(true); onResult && onResult(ok) }} />
            {answered && <div style={{ marginTop: 18 }}><Button variant="primary" iconEnd="arrowback" onClick={next}>{isLast ? "סיום" : "המשך"}</Button></div>}
          </>
        )}
      </Card>
      </div>
    </div>
  )
}

/* ============ 10672 — EthicsCyberSim ============ */
const TOOLS = [
  { id: "copilot", name: "Copilot", desc: "ארגוני · מחובר לאינטרנט · פרודוקטיביות כללית" },
  { id: "jarvis", name: "JARVIS", desc: "פנימי · offline · מאומן על נהלי הבנק" },
  { id: "chatgpt", name: "ChatGPT / Gemini", desc: "ציבורי · חיצוני לארגון" },
]
const SENS = [
  { id: "public", name: "מידע כללי / פומבי", hint: "למשל ניסוח מייל גנרי ללא פרטים" },
  { id: "internal", name: "נוהל פנימי של הבנק", hint: "נהלים, תהליכי עבודה, אשראי" },
  { id: "client", name: "פרטי לקוחות / נתונים פיננסיים", hint: "שמות, מספרי חשבון, יתרות" },
]
function leakVerdict(tool, sens) {
  if (tool === "chatgpt") {
    if (sens === "client") return { level: "danger", title: "עצור! דליפת מידע חמורה!", text: "הועבר מידע רגיש על לקוחות לכלי ציבורי. המידע נשמר בשרתים חיצוניים ועלול לשמש לעיבוד נוסף — הפרת אבטחת מידע חמורה." }
    if (sens === "internal") return { level: "danger", title: "דליפת מידע ארגוני!", text: "נהלים פנימיים אינם עוזבים את הארגון. אסור להעלות מידע עסקי לכלי ציבורי." }
    return { level: "warn", title: "זהירות נדרשת", text: "לשימוש כללי בלבד (רעיונות, ניסוח גנרי). אין להזין כל פרט מזהה או עסקי." }
  }
  if (tool === "copilot") {
    if (sens === "client") return { level: "warn", title: "לא מומלץ", text: "Copilot מנוטר אך מחובר לאינטרנט — אין להזין פרטי לקוחות או להסתמך עליו להחלטות אשראי." }
    if (sens === "internal") return { level: "warn", title: "לא הכלי המתאים", text: "Copilot אינו מכיר את הנהלים הפנימיים. לשאלות נהלים — עדיף JARVIS." }
    return { level: "ok", title: "שימוש נכון וטוב", text: "מתאים לפרודוקטיביות כללית, ניסוח, מחקר רשת וניתוח נתונים כלליים." }
  }
  // jarvis
  if (sens === "public") return { level: "ok", title: "תקין", text: "אפשר, אך JARVIS מיועד בעיקר לנהלים פנימיים, משאבי אנוש ואשראי." }
  return { level: "ok", title: "שימוש מצוין ובטוח!", text: "JARVIS פועל offline ברשת הפנימית ומאומן על נהלי הבנק — הסביבה המתאימה למידע פנימי ורגיש." }
}

function EthicsCyberSim({ module = "אתיקה, סייבר ואבטחת מידע", title = "גן סגור מול עולם פתוח", onBack, onComplete, onResult }) {
  const [tool, setTool] = useState(null)
  const [sens, setSens] = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [tried, setTried] = useState(false)
  const run = () => { if (tool && sens) { setVerdict(leakVerdict(tool, sens)); setTried(true) } }
  const vColor = (lvl) => lvl === "danger" ? "var(--danger)" : lvl === "warn" ? "var(--gold-deep)" : "var(--success)"
  const vBg = (lvl) => lvl === "danger" ? "var(--danger-soft)" : lvl === "warn" ? "color-mix(in oklch, var(--gold), white 82%)" : "var(--success-soft)"

  return (
    <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", animation: "fade-up .35s ease", paddingBottom: 90 }}>
      <SimHeader module={module} title={title} onBack={onBack} />

      <div style={{ padding: "0 var(--side-pad, 16px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
        <Card style={{ borderInlineStart: "4px solid var(--success)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 17, marginBottom: 8, color: "var(--success)" }}><Icon name="shield" size={20} /> הגן הסגור (כלים פנימיים)</div>
          <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
            <li>מוגן בחוזה — הספק לא משתמש במידע לאימון</li>
            <li>מנוטר ומבוקר ע"י הגנות סייבר ארגוניות</li>
            <li>סביבה מאובטחת ומוצפנת בסטנדרט בנקאי</li>
          </ul>
        </Card>
        <Card style={{ borderInlineStart: "4px solid var(--danger)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 17, marginBottom: 8, color: "var(--danger)" }}><Icon name="alert" size={20} /> העולם הפתוח (כלים ציבוריים)</div>
          <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
            <li>המידע נשמר בשרתים חיצוניים ועלול לשמש לאימון</li>
            <li>אין הגנה משפטית על קוד, קניין רוחני וסודות</li>
            <li>אין שליטה על המידע אחרי שהועלה</li>
          </ul>
        </Card>
      </div>

      <Card pad={24} style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>סימולטור דליפת מידע</div>
        <div style={{ fontSize: 14.5, color: "var(--muted)", marginBottom: 18 }}>בחרו כלי וסוג מידע, ובדקו האם השימוש בטוח.</div>

        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 8 }}>1 · באיזה כלי?</div>
        <div style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => { setTool(t.id); setVerdict(null) }} style={{
              textAlign: "right", padding: "12px 16px", borderRadius: "var(--r)", cursor: "pointer", transition: "all .15s ease",
              border: `1.5px solid ${tool === t.id ? "var(--accent)" : "var(--line)"}`, background: tool === t.id ? "var(--accent-soft)" : "var(--surface)" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{t.desc}</div>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 8 }}>2 · איזה סוג מידע?</div>
        <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
          {SENS.map((t) => (
            <button key={t.id} onClick={() => { setSens(t.id); setVerdict(null) }} style={{
              textAlign: "right", padding: "12px 16px", borderRadius: "var(--r)", cursor: "pointer", transition: "all .15s ease",
              border: `1.5px solid ${sens === t.id ? "var(--accent)" : "var(--line)"}`, background: sens === t.id ? "var(--accent-soft)" : "var(--surface)" }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)" }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{t.hint}</div>
            </button>
          ))}
        </div>

        <Button variant="primary" icon="shield" disabled={!tool || !sens} onClick={run}>בצע בדיקת אבטחה</Button>

        {verdict && (
          <div style={{ marginTop: 18, padding: "16px 18px", borderRadius: "var(--r)", background: vBg(verdict.level),
            border: `1px solid ${vColor(verdict.level)}`, animation: "pop-in .35s ease" }}>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 17, color: vColor(verdict.level), marginBottom: 4 }}>{verdict.title}</div>
            <div style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>{verdict.text}</div>
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 18, background: "var(--surface-2)" }}>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, marginBottom: 6 }}>שורה תחתונה</div>
        <div style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          מידע סודי, פרטי לקוחות, לוגיקה עסקית וקוד בנקאי — נשארים <b>אך ורק בכלים הפנימיים</b>. בספק לגבי רגישות מידע — תמיד עדיף להישאר בסביבה המוגנת.
        </div>
      </Card>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: "var(--maxw)", margin: "0 auto",
        background: "rgba(242,242,247,0.95)", borderTop: "0.5px solid var(--line-strong)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "12px var(--side-pad, 16px) 28px" }}>
        <button onClick={() => onComplete && onComplete()}
          disabled={!tried}
          style={{ width: "100%", background: tried ? "var(--accent)" : "var(--line)", borderRadius: "var(--r-lg)", padding: 16,
            fontSize: 16, fontWeight: 600, color: tried ? "white" : "var(--muted)", border: "none", cursor: tried ? "pointer" : "default" }}>
          {tried ? "סיימתי — להמשך" : "נסו לפחות צירוף אחד בסימולטור"}
        </button>
      </div>
    </div>
  )
}

const INTERACTIONS = { WordPrediction: WordPredictionSim, ToolsDifferences: ToolsDifferencesSim, EthicsCyber: EthicsCyberSim }
export { INTERACTIONS, WordPredictionSim, ToolsDifferencesSim, EthicsCyberSim }
