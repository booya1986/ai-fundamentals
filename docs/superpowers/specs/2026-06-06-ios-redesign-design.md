# iOS Redesign — יסודות ה-AI

**Date:** 2026-06-06
**Status:** Approved for implementation

---

## Context

The current platform has a functional but visually dated design with 4 selectable themes, heavy use of colored gradients, and a desktop-first layout. The goal is a 10x visual improvement by adopting a native iOS design language — clean, precise, light-mode first, mobile-first (390px baseline). The user specifically referenced iOS apps like Settings, Reminders, and Notes as the target aesthetic. No profile features are in scope.

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F2F2F7` | Screen background (iOS system grouped) |
| `--surface` | `#FFFFFF` | Cards, cells |
| `--surface-2` | `#F2F2F7` | Nested backgrounds, inset areas |
| `--ink` | `#000000` | Primary text |
| `--ink-soft` | `#3C3C43` | Secondary text |
| `--muted` | `#8E8E93` | Tertiary text, labels |
| `--line` | `#E5E5EA` | Separators (0.5px) |
| `--line-strong` | `#C6C6C8` | Tab bar border |
| `--accent` | `#FF3B30` | Red (iOS system red, replaces current oklch red) |
| `--accent-deep` | `#D70015` | Pressed state |
| `--success` | `#34C759` | Correct answers, earned badges |
| `--warning` | `#FF9500` | XP, level, in-progress |
| `--danger` | `#FF3B30` | Wrong answers (same as accent) |
| `--gold` | `#FFCC00` | Badge gradients |

### Typography

All text uses the system font stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`

| Role | Size | Weight | Usage |
|---|---|---|---|
| Large Title | 34px | 700 | Screen titles (nav-bar) |
| Title 1 | 28px | 700 | Section headers |
| Title 2 | 22px | 700 | Stats, big numbers |
| Headline | 17px | 600 | Card titles, option labels |
| Body | 15px | 400 | Content text |
| Footnote | 13px | 400 | Descriptions |
| Caption | 12px | 400 | Metadata |
| Label | 11px / 13px | 600 | Section headers (UPPERCASE + letter-spacing) |

### Spacing & Radii

| Token | Value |
|---|---|
| `--r-sm` | `10px` |
| `--r` | `14px` |
| `--r-lg` | `16px` |
| `--r-xl` | `20px` |
| Screen padding | `16px` horizontal |
| Cell height | `44–56px` |
| Separator | `0.5px solid #E5E5EA` |

### Shadows

| Level | Value |
|---|---|
| Card | `0 1px 4px rgba(0,0,0,0.08)` |
| Elevated | `0 4px 16px rgba(0,0,0,0.12)` |
| Tab bar bg | `rgba(242,242,247,0.92) + backdrop-filter:blur(20px)` |

### Squircle Icons (module icons)

Each module gets a squircle (40×40, border-radius 10px) with a two-stop gradient. Suggested per module:
- M0: `#636366 → #48484A` (gray, diagnostic)
- M1: `#FF3B30 → #FF6B6B` (red, core concepts)
- M2: `#FF9500 → #FFCC00` (orange, tools)
- M3: `#AF52DE → #BF5AF2` (purple, prompts)
- M4: `#34C759 → #30D158` (green, productivity)
- M5: `#0A84FF → #32ADE6` (blue, advanced tools)
- M6: `#FF2D55 → #FF375F` (pink-red, ethics)
- M7: `#5856D6 → #6E6DD0` (indigo, custom assistants)
- M8: `#FFCC00 → #FF9500` (gold, certificate)

---

## Screen Specifications

### 1. Course Map (`screen = "map"`)

**Layout:**
- Status bar (14px padding top)
- Large title nav: org label in `--accent` (11px uppercase), course title 32px/700
- XP progress card: white card, level badge (squircle), level number + name, progress bar (`--accent`), "XP / 300" label
- Section label: "מודולים" (uppercase, `--muted`)
- Module list: single white grouped card, `border-radius: 14px`, cells separated by `0.5px` lines

**Module cell states:**
- **Completed:** squircle icon (colored gradient) + module title (15px/600) + "N שיעורים · הושלם" (12px `--muted`) + green `✓` (18px) on far left
- **In progress:** squircle icon + title + progress bar row (thin 3px bar + "N%" in `--warning`) + `›` disclosure
- **Locked:** gray squircle (#E5E5EA) + title + "נעול" (`--muted`) + 0.45 opacity on entire cell

**Tab bar (sticky bottom):**
- 2 tabs only: קורס (🏠) + הישגים (🏆)
- Active tab label in `--accent`, icon colored
- Frosted glass background: `rgba(242,242,247,0.92)` + `backdrop-filter: blur(20px)`
- `0.5px solid #C6C6C8` top border

---

### 2. Achievements (`screen = "achievements"`)

**Layout:**
- Large title "ההישגים שלי" + back link "‹ קורס" in `--accent`
- 3 stat pills row: XP (red), רמה (orange), N/7 באדג'ים (green) — white cards, 22px bold numbers
- Overall progress bar: white card, gradient bar `--accent → --warning` (left-to-right in RTL)
- Section label "הושגו · N" (uppercase, `--muted`)
- Earned badges grouped card: each row = squircle icon + name (15px/600) + description (12px `--muted`) + green "הושג" pill (background `#E8F8ED`, color `#34C759`)
- Section label "עוד לפניך · N"
- Locked badges grouped card: gray squircle + title + description — entire card at 0.55 opacity
- Tab bar (same as course map, הישגים tab active)

---

### 3. Lesson — Reading (`kind = "reading"`)

**Layout:**
- Nav: breadcrumb "מודול N · שיעור N" (12px `--muted`) + title (28px/700) + back "‹ חזרה" (`--accent`)
- Progress bar: thin 3px, `--accent` fill, "שיעור N מתוך N" label + percentage
- Content card: white, 16px padding, body text (15px/400, line-height 1.65)
- Highlight box inside content: `#FFF5F5` bg, `3px right border --accent`, label 12px/600 `--accent`, text 13px
- Key points section label + white grouped card: numbered squircle (colored) + point text (14px)
- Sticky CTA: `btn-primary`

---

### 4. Lesson — Video (`kind = "video"`)

**Layout:** Same nav + progress as Reading, then:
- Video player: `border-radius: 16px`, black background, 16:9 aspect ratio, dark gradient overlay, centered play button (60×60, frosted glass `rgba(255,255,255,0.15)`, `backdrop-filter: blur(10px)`), duration badge bottom-left, scrubber bar bottom (3px, `--accent` fill)
- Description card below player
- Key points (same as reading)
- Sticky CTA

---

### 5. Quiz — Question (`kind = "quiz"`)

**Layout:**
- Nav: "חידון · שאלה N מתוך N" + title "בחן את עצמך"
- Progress dots: N colored pills (28×5px, green=done, red=current, gray=pending)
- Question card: white, 18px padding, 17px/600 question text
- Options grouped card: each row = radio circle (26×26, `border: 1.5px solid #D1D1D6`) + option text (15px)
  - Selected (pre-submit): `--accent` filled circle with `✓`, option text in `--accent`, row background `#FFF5F5`
- XP hint: centered footnote "+20 XP ⚡" in `--warning`
- Sticky CTA: "הגש תשובה ›" — active only when option selected

**Post-submit — correct:**
- Correct option row: `#F0FDF4` bg, green `✓` circle, text `#16A34A`
- Other options: 0.45 opacity
- Feedback banner: `#F0FDF4` bg, `#BBF7D0` border, green check circle, title + explanation text
- `+20 XP` pill (white card, orange text)
- CTA: "השאלה הבאה ›"

**Post-submit — wrong:**
- Selected wrong option: `#FFF5F5` bg, red `✕` circle, strikethrough text
- Correct option: `#F0FDF4` bg, green `✓` + "התשובה הנכונה" label
- Feedback banner: `#FFF5F5` bg, `#FECACA` border, tone of encouragement
- 2 CTAs: "המשך בכל זאת ›" (primary) + "נסה שוב" (ghost)

---

### 6. Quiz Results (`screen = "results"`)

**Layout:**
- Centered score ring: 120×120 SVG, outer ring `--success` stroke, inner percentage (34px/700) + "N/N נכון" label
- Headline "כל הכבוד!" + quiz title
- 3 stat pills: XP earned (orange), correct count (green), wrong count (red)
- New badge card (if earned): squircle icon (large, 48×48) + "באדג' חדש!" label + name + description
- Level progress card: XP bar with gradient
- 2 CTAs: "המשך לשיעור הבא ›" (primary) + "חזור למפת הקורס" (ghost white card)

---

### 7. Copilot Exercise (`kind = "copilot"`)

**Layout:**
- Task card: section label "המשימה" + body text
- Template card (dark `#1C1C1E` bg, `border-radius: 16px`): section label + "העתק ✓" red pill button; RICE template in monospace with color-coded labels (orange/green/blue/purple)
- Open in tool card: white, squircle tool icon + "פתח ב-[Tool]" title + "הפרומפט הועתק" subtitle + `›`
- Reflection section: label "שיקוף" + white card with text area (gray placeholder `--muted`)
- Sticky CTA: disabled (gray) until reflection filled

---

### 8. Interactive Simulation (`kind = "interactive"`)

**Layout:**
- Instruction card: white, body text
- Sentence card: white, 20px/500 sentence with blank `___` (dashed red border, red text, 18px)
- Word chips: pill buttons (22px radius); unselected = white + `#E5E5EA` border; selected = `--accent` bg + white text
- Probability bars card (revealed after selection): bar rows — name label (right-aligned, 46px wide) + colored bar + percentage
  - Winner: `--accent` bar on `#FFE5E5` bg
  - Others: `#8E8E93` / `#C7C7CC`
- Sticky CTA: "סיבוב הבא ›"

---

## Navigation & Tab Bar

The tab bar replaces the current floating theme-switcher and TopBar achievements button. It is always visible when `screen` is `"map"` or `"achievements"`. It is hidden on all inner screens (lesson, quiz, copilot, interactive, results, certificate).

Tab definitions:
```js
[
  { id: "map",          label: "קורס",   emoji: "🏠" },
  { id: "achievements", label: "הישגים", emoji: "🏆" },
]
```

---

## Removed / Simplified

- **Theme switcher removed** — single Light theme only (the 4-theme system is eliminated)
- **Hero component removed** — replaced by Large Title nav pattern
- **TopBar removed** — XP/level moves to the course map XP card; achievements icon moves to tab bar
- **Board/Journey map toggle removed** — single list view only
- **Profile tab** — not in scope, no changes to profile-related code

---

## Implementation Approach

### Files to change

| File | Change |
|---|---|
| `src/styles/tokens.css` | Replace OKLCH tokens with iOS system values above; remove aurora/gradient tokens |
| `src/styles/themes.css` | Delete entirely — single theme only |
| `src/styles/aurora.css` | Delete entirely |
| `src/App.jsx` | Remove `<Hero>`, `<TopBar>`, theme switcher; add `<TabBar>` component; adjust screen routing |
| `src/App.css` | Strip to bare minimum (body reset, font stack) |
| `src/coursemap.jsx` | Rewrite: iOS grouped module list replacing board/journey views |
| `src/lesson.jsx` | Restyle all lesson types with new patterns |
| `src/gamification.jsx` | Restyle `AchievementsView` and `ResultsScreen` per spec above |
| `src/copilot.jsx` | Restyle: dark template card, copy button, open-in-tool row |
| `src/ui.jsx` | Update `Button`, `Card`, `ProgressBar`, `ProgressRing`, `Medal` to iOS patterns; add `TabBar` component |
| `src/index.css` | Update background to `#F2F2F7`, font stack |

### Key patterns to reuse

- `ProgressRing` in `ui.jsx` — keep SVG ring, update colors to use `--success` / `--accent`
- `Medal` in `ui.jsx` — keep logic, restyle as squircle (border-radius 10px) instead of circle
- `Confetti` in `ui.jsx` — keep as-is
- `scorm.js` — no changes
- All content data files (`data.jsx`, `content/m*.js`) — no changes

### Inline styles pattern

All layout stays as inline `style` props (no CSS Modules added). Use `var(--token)` throughout. Example:

```jsx
// Module cell
<div style={{
  padding: "13px 16px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: "var(--surface)",
  borderBottom: "0.5px solid var(--line)"
}}>
```

### RTL

No changes needed — document-level `dir="rtl"` handles flex mirroring. `marginInlineStart` / `marginInlineEnd` for directional spacing.

---

## Verification

1. `npm run dev` → open on mobile viewport (375–390px wide in DevTools)
2. Walk through: Course Map → tap in-progress module → Video lesson → Reading lesson → Quiz (answer correct, answer wrong) → Results → Achievements tab → badge earned state
3. Check tab bar hides on inner screens, reappears on map/achievements
4. Confirm accent is `#FF3B30` (never blue) in all states
5. Confirm locked module cells are visually distinct but not invisible
6. `npm run build` → no errors → `npm run scorm` → verify package integrity
