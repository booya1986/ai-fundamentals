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

/* ---------- Medal / Badge disc ---------- */
const BadgeCtx = React.createContext("gradient")
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

/* ---------- TabBar ---------- */
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

export { Icon, Button, ProgressBar, ProgressRing, Card, Medal, BadgeCtx, Pill, Confetti, Modal, Placeholder, TabBar }
