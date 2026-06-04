// ui.jsx — shared UI primitives (ported from prototype, ES module).
import React from 'react'
import {
  Sparkles, BarChart3, MessageSquare, Wand2, Shield, Rocket, Flag, Star, Flame,
  Check, GraduationCap, Lock, LockOpen, Play, Zap, Trophy, ArrowRight, ArrowLeft,
  X, BookOpen, Clock, LayoutGrid, Route, Map as MapIcon, Cpu, Database, Terminal,
  Scale, Briefcase, Lightbulb, Copy, ExternalLink, AlertTriangle,
} from 'lucide-react'
const { useState, useEffect, useRef } = React

/* ---------- Icons (one unified set — lucide-react) ---------- */
const ICONS = {
  spark: Sparkles, sparkles: Sparkles, graph: BarChart3, chat: MessageSquare, wand: Wand2,
  shield: Shield, rocket: Rocket, flag: Flag, star: Star, flame: Flame, fire: Flame,
  check: Check, cap: GraduationCap, lock: Lock, unlock: LockOpen, play: Play, bolt: Zap,
  trophy: Trophy, arrow: ArrowRight, arrowback: ArrowLeft, x: X, book: BookOpen, clock: Clock,
  grid: LayoutGrid, path: Route, map: MapIcon, cpu: Cpu, database: Database, terminal: Terminal,
  scale: Scale, briefcase: Briefcase, lightbulb: Lightbulb, copy: Copy, link: ExternalLink, alert: AlertTriangle,
}

function Icon({ name, size = 22, stroke = 2, fill = false, style, className }) {
  const L = ICONS[name] || Sparkles
  return (
    <L size={size} strokeWidth={stroke} fill={fill ? "currentColor" : "none"}
      style={style} className={className} aria-hidden="true" />
  )
}

/* ---------- Button ---------- */
function Button({ children, variant = "primary", size = "md", icon, iconEnd, full, disabled, onClick, style }) {
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 15, gap: 7 },
    md: { padding: "12px 20px", fontSize: 16.5, gap: 9 },
    lg: { padding: "15px 28px", fontSize: 18, gap: 10 },
  }
  const variants = {
    primary: { background: "var(--accent)", color: "#fff", boxShadow: "0 6px 16px color-mix(in oklch, var(--accent), transparent 70%)", border: "1px solid transparent" },
    deep: { background: "var(--ink)", color: "var(--bg)", border: "1px solid transparent" },
    soft: { background: "var(--accent-soft)", color: "var(--accent-ink)", border: "1px solid transparent" },
    ghost: { background: "transparent", color: "var(--ink-soft)", border: "1px solid var(--line)" },
    gold: { background: "linear-gradient(135deg, var(--gold), var(--gold-deep))", color: "oklch(0.28 0.06 75)", border: "1px solid transparent", boxShadow: "0 6px 16px oklch(0.7 0.13 80 / 0.35)" },
  }
  const [h, setH] = useState(false)
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: sizes[size].gap, fontFamily: "var(--font-head)", fontWeight: 600,
        fontSize: sizes[size].fontSize, padding: sizes[size].padding,
        borderRadius: 999, transition: "transform .12s ease, box-shadow .2s ease, filter .2s ease",
        width: full ? "100%" : "auto", opacity: disabled ? 0.45 : 1,
        transform: h && !disabled ? "translateY(-1px)" : "none",
        filter: h && !disabled ? "brightness(1.04)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        ...variants[variant], ...style,
      }}>
      {icon && <Icon name={icon} size={size === "lg" ? 21 : 19} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === "lg" ? 21 : 19} />}
    </button>
  )
}

/* ---------- Progress bar ---------- */
function ProgressBar({ value, height = 10, showGlow = true, tone = "var(--accent)" }) {
  return (
    <div style={{ background: "var(--line-soft)", borderRadius: 999, height, overflow: "hidden", position: "relative" }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", borderRadius: 999,
        background: `linear-gradient(90deg, ${tone}, color-mix(in oklch, ${tone}, white 18%))`,
        transition: "width .6s cubic-bezier(.2,.8,.2,1)",
        boxShadow: showGlow ? `0 0 12px color-mix(in oklch, ${tone}, transparent 55%)` : "none",
      }} />
    </div>
  )
}

/* ---------- Progress ring (gradient stroke) ---------- */
let __ringSeq = 0
function ProgressRing({ value, size = 56, stroke = 6, tone = "var(--accent)", from, to, track, children }) {
  const idRef = useRef(null)
  if (idRef.current === null) idRef.current = ++__ringSeq
  const gid = `rg${idRef.current}`
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const off = circ - (Math.max(0, Math.min(100, value)) / 100) * circ
  const c1 = from || tone
  const c2 = to || tone
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track || "var(--line-soft)"} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${gid})`} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-head)", fontWeight: 700 }}>
        {children}
      </div>
    </div>
  )
}

/* ---------- Card ---------- */
function Card({ children, pad = 22, style, hover, onClick }) {
  const [h, setH] = useState(false)
  return (
    <div onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: "var(--surface)", borderRadius: "var(--r-lg)", padding: pad,
        border: `1px solid ${hover && h ? "color-mix(in oklch, var(--accent), transparent 55%)" : "var(--line)"}`,
        boxShadow: hover && h ? "0 22px 48px oklch(0.4 0.05 285 / 0.18), 0 0 0 1px color-mix(in oklch, var(--accent), transparent 70%), 0 0 26px color-mix(in oklch, var(--accent), transparent 86%)" : "var(--shadow-sm)",
        transition: "box-shadow .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s ease",
        transform: hover && h ? "translateY(-7px) scale(1.012)" : "none",
        cursor: onClick ? "pointer" : "default", ...style,
      }}>
      {children}
    </div>
  )
}

/* ---------- Medal / Badge disc ---------- */
const BadgeCtx = React.createContext("gradient")
function Medal({ glyph, tone = "274", size = 72, locked = false, shine = false }) {
  const variant = React.useContext(BadgeCtx)
  const h2 = (Number(tone) + 32) % 360
  const c = `oklch(0.66 0.19 ${tone})`
  const glyphFill = ["star", "flame", "fire", "spark", "check"].includes(glyph)

  if (locked) {
    return (
      <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
        <div style={{ width: size, height: size, borderRadius: "50%", display: "grid", placeItems: "center",
          background: "var(--bg-2)", color: "var(--muted)", border: "2px solid var(--line)" }}>
          <Icon name="lock" size={size * 0.4} stroke={2} style={{ color: "var(--muted)" }} />
        </div>
      </div>
    )
  }

  let box, gloss = false
  if (variant === "flat") {
    box = { background: c, color: "#fff", border: "none", boxShadow: `0 8px 20px oklch(0.6 0.2 ${tone} / 0.35)` }
  } else if (variant === "outline") {
    box = { background: `oklch(0.95 0.05 ${tone})`, color: `oklch(0.45 0.16 ${tone})`, border: `2.5px solid ${c}`, boxShadow: "none" }
  } else {
    box = {
      background: `linear-gradient(155deg, oklch(0.82 0.16 ${tone}) 0%, oklch(0.62 0.21 ${tone}) 45%, oklch(0.5 0.2 ${h2}) 100%)`,
      color: "#fff", border: "none",
      boxShadow: `0 12px 30px oklch(0.6 0.2 ${tone} / 0.45), inset 0 2px 3px oklch(1 0 0 / 0.55), inset 0 -8px 16px oklch(0.3 0.12 ${h2} / 0.6)`,
    }
    gloss = true
  }
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <div style={{ width: size, height: size, borderRadius: "50%", display: "grid", placeItems: "center",
        overflow: "hidden", position: "relative", ...box }}>
        <Icon name={glyph} size={size * 0.46} stroke={2.4} fill={glyphFill && variant !== "outline"}
          style={{ filter: gloss ? "drop-shadow(0 1px 2px oklch(0 0 0 / 0.3))" : "none", zIndex: 2 }} />
        {gloss && (
          <span style={{ position: "absolute", top: "-14%", left: "8%", right: "8%", height: "52%", borderRadius: "50%",
            background: "linear-gradient(oklch(1 0 0 / 0.5), oklch(1 0 0 / 0))", pointerEvents: "none" }} />
        )}
        {shine && gloss && (
          <span style={{ position: "absolute", top: 0, bottom: 0, width: "45%",
            background: "linear-gradient(100deg, transparent, oklch(1 0 0 / 0.45), transparent)",
            animation: "badge-shine 2.6s ease-in-out infinite" }} />
        )}
      </div>
    </div>
  )
}

/* ---------- XP / Streak pills ---------- */
function Pill({ icon, children, tone = "var(--accent)", soft = "var(--accent-soft)", inkTone }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: soft,
      color: inkTone || tone, padding: "7px 13px", borderRadius: 999, fontFamily: "var(--font-head)",
      fontWeight: 700, fontSize: 15.5 }}>
      <Icon name={icon} size={17} fill={["flame", "fire", "bolt", "star"].includes(icon)} />
      {children}
    </div>
  )
}

/* ---------- Confetti burst ---------- */
function Confetti({ run }) {
  if (!run) return null
  const colors = ["var(--accent)", "var(--gold)", "var(--success)", "oklch(0.6 0.2 350)", "oklch(0.65 0.18 200)"]
  const bits = Array.from({ length: 80 })
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 4000, overflow: "hidden" }}>
      {bits.map((_, i) => {
        const left = (i * 37) % 100
        const delay = (i % 7) * 0.08
        const dur = 2.2 + (i % 5) * 0.4
        const sz = 7 + (i % 5) * 2
        const round = i % 2 === 0
        return (
          <span key={i} style={{
            position: "absolute", top: "-6vh", left: `${left}%`, width: sz, height: round ? sz : sz * 0.5,
            background: colors[i % colors.length], borderRadius: round ? "50%" : 2,
            animation: `confetti-fall ${dur}s ${delay}s cubic-bezier(.3,.6,.6,1) forwards`,
          }} />
        )
      })}
    </div>
  )
}

/* ---------- Modal shell ---------- */
function Modal({ open, onClose, children, maxw = 460 }) {
  useEffect(() => {
    if (!open) return
    const h = (e) => e.key === "Escape" && onClose && onClose()
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 3000, display: "grid", placeItems: "center", padding: 20,
      background: "oklch(0.2 0.02 270 / 0.5)", backdropFilter: "blur(6px)", animation: "fade-in .2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: maxw,
        boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)", animation: "pop-in .35s cubic-bezier(.2,.8,.2,1)",
        overflow: "hidden",
      }}>
        {children}
      </div>
    </div>
  )
}

/* ---------- Striped image placeholder ---------- */
function Placeholder({ label, h = 200, style }) {
  return (
    <div className="stripe-ph" style={{ height: h, borderRadius: "var(--r)", fontSize: 13, letterSpacing: ".02em", ...style }}>
      {label}
    </div>
  )
}

export { Icon, Button, ProgressBar, ProgressRing, Card, Medal, BadgeCtx, Pill, Confetti, Modal, Placeholder }
