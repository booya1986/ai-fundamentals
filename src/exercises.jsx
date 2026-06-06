// exercises.jsx — quiz question components. Each: props { q, onResult(isCorrect) }.
import React from 'react'
import { Icon, Button } from './ui.jsx'
const { useState } = React

/* Shared feedback banner */
function Feedback({ correct, text }) {
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 16px", borderRadius: "var(--r)",
      background: correct ? "var(--success-soft)" : "var(--danger-soft)",
      border: `1px solid ${correct ? "color-mix(in oklch, var(--success), transparent 60%)" : "color-mix(in oklch, var(--danger), transparent 60%)"}`,
      animation: "fade-up .3s ease",
    }}>
      <div style={{ flex: "none", width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center",
        background: correct ? "var(--success)" : "var(--danger)", color: "#fff" }}>
        <Icon name={correct ? "check" : "x"} size={17} stroke={3} />
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: correct ? "var(--success)" : "var(--danger)", marginBottom: 2 }}>
          {correct ? "כל הכבוד, נכון!" : "לא בדיוק — בואו נבין"}
        </div>
        <div style={{ fontSize: 15.5, color: "var(--ink-soft)" }}>{text}</div>
      </div>
    </div>
  )
}

/* ---------- Multiple choice ---------- */
function MCQ({ q, onResult }) {
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)
  const submit = () => { if (picked == null) return; setDone(true); onResult(picked === q.correct) }
  return (
    <div>
      <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const reveal = done
          const isRight = i === q.correct
          let bg = "var(--surface)", bd = "var(--line)", col = "var(--ink)"
          if (reveal && isRight) { bg = "var(--success-soft)"; bd = "var(--success)" }
          else if (reveal && isPicked && !isRight) { bg = "var(--danger-soft)"; bd = "var(--danger)" }
          else if (isPicked) { bg = "var(--accent-soft)"; bd = "var(--accent)" }
          return (
            <button key={i} disabled={done} onClick={() => setPicked(i)} style={{
              display: "flex", alignItems: "center", gap: 14, textAlign: "right", padding: "15px 18px",
              borderRadius: "var(--r)", border: `1.5px solid ${bd}`, background: bg, color: col,
              fontSize: 17, fontFamily: "var(--font-body)", fontWeight: 500, transition: "all .15s ease",
              cursor: done ? "default" : "pointer",
            }}>
              <span style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center",
                fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15,
                background: isPicked || (reveal && isRight) ? (reveal && isRight ? "var(--success)" : "var(--accent)") : "var(--bg-2)",
                color: isPicked || (reveal && isRight) ? "#fff" : "var(--muted)" }}>
                {["א", "ב", "ג", "ד", "ה"][i]}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
              {reveal && isRight && <Icon name="check" size={20} stroke={3} style={{ color: "var(--success)" }} />}
            </button>
          )
        })}
      </div>
      {done ? <Feedback correct={picked === q.correct} text={q.explain} />
        : <Button variant="primary" disabled={picked == null} onClick={submit}>בדיקה</Button>}
    </div>
  )
}

/* ---------- True / False ---------- */
function TrueFalse({ q, onResult }) {
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)
  const opts = [{ v: true, label: "נכון", icon: "check" }, { v: false, label: "לא נכון", icon: "x" }]
  const submit = () => { if (picked == null) return; setDone(true); onResult(picked === q.correct) }
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        {opts.map((o) => {
          const isPicked = picked === o.v
          const reveal = done
          const isRight = o.v === q.correct
          let bg = "var(--surface)", bd = "var(--line)"
          if (reveal && isRight) { bg = "var(--success-soft)"; bd = "var(--success)" }
          else if (reveal && isPicked && !isRight) { bg = "var(--danger-soft)"; bd = "var(--danger)" }
          else if (isPicked) { bg = "var(--accent-soft)"; bd = "var(--accent)" }
          return (
            <button key={String(o.v)} disabled={done} onClick={() => setPicked(o.v)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "26px 12px",
              borderRadius: "var(--r-lg)", border: `1.5px solid ${bd}`, background: bg, transition: "all .15s ease",
              cursor: done ? "default" : "pointer", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 19, color: "var(--ink)",
            }}>
              <Icon name={o.icon} size={30} stroke={3} style={{ color: bd === "var(--line)" ? "var(--muted)" : bd }} />
              {o.label}
            </button>
          )
        })}
      </div>
      {done ? <Feedback correct={picked === q.correct} text={q.explain} />
        : <Button variant="primary" disabled={picked == null} onClick={submit}>בדיקה</Button>}
    </div>
  )
}

/* ---------- Drag & match ---------- */
function DragMatch({ q, onResult }) {
  const [terms] = useState(() => shuffle(q.pairs.map((p) => p.term)))
  const [slots, setSlots] = useState(() => q.pairs.map(() => null))
  const [sel, setSel] = useState(null)
  const [done, setDone] = useState(false)

  const placed = (term) => slots.includes(term)
  const place = (defIdx, term) => {
    if (done || !term) return
    setSlots((s) => s.map((v, i) => (v === term ? null : i === defIdx ? term : v)))
    setSel(null)
  }
  const clearSlot = (defIdx) => { if (done) return; setSlots((s) => s.map((v, i) => (i === defIdx ? null : v))) }
  const allFilled = slots.every(Boolean)
  const submit = () => {
    const ok = slots.every((term, i) => term === q.pairs[i].term)
    setDone(true); onResult(ok)
  }
  const isOk = (i) => slots[i] === q.pairs[i].term

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18, minHeight: 8 }}>
        {terms.filter((t) => !placed(t)).map((t) => (
          <button key={t} draggable={!done}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", t)}
            onClick={() => setSel(sel === t ? null : t)}
            style={{
              padding: "11px 16px", borderRadius: 999, border: `1.5px solid ${sel === t ? "var(--accent)" : "var(--line)"}`,
              background: sel === t ? "var(--accent-soft)" : "var(--surface)", color: sel === t ? "var(--accent-ink)" : "var(--ink)",
              fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 16, cursor: "grab", boxShadow: "var(--shadow-sm)",
              transition: "all .15s ease",
            }}>{t}</button>
        ))}
        {terms.every(placed) && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--muted)", fontSize: 14, alignSelf: "center" }}>כל הכרטיסים שובצו <Icon name="check" size={14} stroke={3} /></span>}
      </div>

      <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
        {q.pairs.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, padding: "14px 16px", borderRadius: "var(--r)", background: "var(--bg-2)",
              border: "1px solid var(--line-soft)", fontSize: 16, color: "var(--ink-soft)" }}>{p.def}</div>
            <Icon name="arrowback" size={18} style={{ color: "var(--muted)", flex: "none" }} />
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); place(i, e.dataTransfer.getData("text/plain")) }}
              onClick={() => (slots[i] ? clearSlot(i) : sel && place(i, sel))}
              style={{
                flex: "none", width: 168, minHeight: 50, borderRadius: "var(--r)", display: "grid", placeItems: "center",
                border: `1.5px dashed ${slots[i] ? "transparent" : (sel ? "var(--accent)" : "var(--line)")}`,
                background: done ? (isOk(i) ? "var(--success-soft)" : "var(--danger-soft)") : (slots[i] ? "var(--accent-soft)" : "var(--bg)"),
                cursor: done ? "default" : "pointer", transition: "all .15s ease", padding: 6,
              }}>
              {slots[i]
                ? <span style={{ fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15.5, color: done ? (isOk(i) ? "var(--success)" : "var(--danger)") : "var(--accent-ink)", display: "flex", alignItems: "center", gap: 6 }}>
                    {done && <Icon name={isOk(i) ? "check" : "x"} size={16} stroke={3} />}{slots[i]}
                  </span>
                : <span style={{ color: "var(--muted)", fontSize: 13.5 }}>גררו לכאן</span>}
            </div>
          </div>
        ))}
      </div>
      {done ? <Feedback correct={slots.every((t, i) => t === q.pairs[i].term)} text={q.explain} />
        : <Button variant="primary" disabled={!allFilled} onClick={submit}>בדיקה</Button>}
    </div>
  )
}

/* ---------- Fill in the blanks ---------- */
function FillBlanks({ q, onResult }) {
  const blanks = q.answer.length
  const [bank] = useState(() => shuffle(q.bank))
  const [fills, setFills] = useState(() => Array(blanks).fill(null))
  const [sel, setSel] = useState(null)
  const [done, setDone] = useState(false)
  const used = (w) => fills.includes(w)
  const placeIn = (bi, w) => { if (done || !w) return; setFills((f) => f.map((v, i) => (v === w ? null : i === bi ? w : v))); setSel(null) }
  const clear = (bi) => { if (done) return; setFills((f) => f.map((v, i) => (i === bi ? null : v))) }
  const allFilled = fills.every(Boolean)
  const submit = () => { setDone(true); onResult(fills.every((w, i) => w === q.answer[i])) }

  let bi = -1
  return (
    <div>
      <div style={{ fontSize: 18.5, lineHeight: 2.1, marginBottom: 20, color: "var(--ink)" }}>
        {q.template.map((seg, i) => {
          const node = <span key={"s" + i}>{seg}</span>
          if (i === q.template.length - 1) return node
          bi += 1
          const idx = bi
          const w = fills[idx]
          const ok = w === q.answer[idx]
          return (
            <React.Fragment key={i}>
              {node}
              <span
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); placeIn(idx, e.dataTransfer.getData("text/plain")) }}
                onClick={() => (w ? clear(idx) : sel && placeIn(idx, sel))}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 116, padding: "4px 14px",
                  margin: "0 4px", borderRadius: 999, verticalAlign: "middle",
                  border: `1.5px dashed ${w ? "transparent" : (sel ? "var(--accent)" : "var(--line)")}`,
                  background: done ? (ok ? "var(--success-soft)" : "var(--danger-soft)") : (w ? "var(--accent-soft)" : "var(--bg-2)"),
                  color: done ? (ok ? "var(--success)" : "var(--danger)") : "var(--accent-ink)",
                  fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 16, cursor: done ? "default" : "pointer",
                }}>
                {w || <span style={{ color: "var(--muted)", fontWeight: 400 }}>______</span>}
              </span>
            </React.Fragment>
          )
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {bank.filter((w) => !used(w)).map((w) => (
          <button key={w} draggable={!done}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", w)}
            onClick={() => setSel(sel === w ? null : w)}
            style={{
              padding: "10px 16px", borderRadius: 999, border: `1.5px solid ${sel === w ? "var(--accent)" : "var(--line)"}`,
              background: sel === w ? "var(--accent-soft)" : "var(--surface)", color: sel === w ? "var(--accent-ink)" : "var(--ink)",
              fontFamily: "var(--font-head)", fontWeight: 600, fontSize: 15.5, cursor: "grab", boxShadow: "var(--shadow-sm)",
            }}>{w}</button>
        ))}
      </div>
      {done ? <Feedback correct={fills.every((w, i) => w === q.answer[i])} text={q.explain} />
        : <Button variant="primary" disabled={!allFilled} onClick={submit}>בדיקה</Button>}
    </div>
  )
}

/* ---------- Scenario (situational application) ---------- */
function ScenarioExercise({ q, onResult }) {
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)
  const submit = () => {
    if (picked == null) return
    setDone(true)
    onResult(q.options[picked].verdict === q.correctVerdict)
  }
  const correctIdx = q.options.findIndex((o) => o.verdict === q.correctVerdict)
  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const reveal = done
          const isRight = i === correctIdx
          let bg = "var(--surface)", bd = "var(--line)"
          if (reveal && isRight) { bg = "var(--success-soft)"; bd = "var(--success)" }
          else if (reveal && isPicked && !isRight) { bg = "var(--danger-soft)"; bd = "var(--danger)" }
          else if (isPicked) { bg = "var(--accent-soft)"; bd = "var(--accent)" }
          return (
            <button key={i} disabled={done} onClick={() => setPicked(i)} style={{
              display: "flex", alignItems: "center", gap: 14, textAlign: "right", padding: "15px 18px",
              borderRadius: "var(--r)", border: `1.5px solid ${bd}`, background: bg, color: "var(--ink)",
              fontSize: 16.5, fontFamily: "var(--font-body)", fontWeight: 500, transition: "all .15s ease",
              cursor: done ? "default" : "pointer",
            }}>
              <span style={{ flex: "none", width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center",
                fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15,
                background: isPicked || (reveal && isRight) ? (reveal && isRight ? "var(--success)" : "var(--accent)") : "var(--bg-2)",
                color: isPicked || (reveal && isRight) ? "#fff" : "var(--muted)" }}>
                {["א", "ב", "ג", "ד", "ה"][i]}
              </span>
              <span style={{ flex: 1 }}>{opt.label}</span>
              {reveal && isRight && <Icon name="check" size={20} stroke={3} style={{ color: "var(--success)" }} />}
            </button>
          )
        })}
      </div>
      {done
        ? <Feedback correct={q.options[picked].verdict === q.correctVerdict} text={q.options[picked].feedback} />
        : <Button variant="primary" disabled={picked == null} onClick={submit} style={{ width: "100%" }}>בדיקה</Button>}
    </div>
  )
}

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

const EXERCISE_COMPONENTS = { mcq: MCQ, tf: TrueFalse, match: DragMatch, fill: FillBlanks, scenario: ScenarioExercise }
export { MCQ, TrueFalse, DragMatch, FillBlanks, ScenarioExercise, EXERCISE_COMPONENTS, Feedback }
