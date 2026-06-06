# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview the production build
npm run lint      # ESLint
npm run scorm     # Wrap dist/ into release/ai-fundamentals-scorm.zip (requires build first)
npm run package   # build + scorm + verify in one shot
```

There is no test suite. Verify changes by running `npm run dev` and exercising the affected screens in the browser.

## Architecture

### Screen routing
All navigation lives in `App.jsx` as a single `screen` state string (`"map"`, `"lesson"`, `"quiz"`, `"copilot"`, `"interactive"`, `"final"`, `"results"`, `"achievements"`, `"certificate"`, `"diagnostic-gate"`). There is no router library. A bottom `TabBar` (from `ui.jsx`) is visible only on `"map"` and `"achievements"` screens; all other screens hide it. There is no TopBar or Hero component.

**`diagnostic-gate` screen** — shown after M0's video lesson (m0/l1) completes, both on first play and revision. Renders `DiagnosticGate` (defined inline in `App.jsx`): explains the quiz purpose, recommends taking it, offers Skip → map or "לביצוע" → opens m0/l2 quiz. If user skips, M0 is considered complete (the quiz is optional).

### Content data model
Course content is split across two locations:

- `src/data.jsx` — `MODULES` array (all 9 module/lesson metadata), `LESSON_CONTENT` and `QUIZZES` for M0–M1, `COPILOT` exercises for M1/M8, `BADGES`, `INITIAL_PROGRESS`.
- `src/content/m2.js` … `m7.js` — one file per module, each default-exporting `{ lessonContent, quiz, copilot }`. Merged into the main maps by `src/content/index.js` via `Object.assign`.

To add or edit content for M2–M7, edit only the corresponding `src/content/m*.js` file. Keys are `"mid/lid"` strings (e.g. `"m3/l2"`).

### Lesson kinds and which component renders them
| `kind` | Component | Notes |
|--------|-----------|-------|
| `reading` / `video` | `LessonScreen` (lesson.jsx) | |
| `quiz` | `QuizRunner` (lesson.jsx) | |
| `copilot` | `CopilotExercise` (copilot.jsx) | |
| `interactive` | `INTERACTIONS[les.sim]` (interactions.jsx) | `les.sim` is the sim key |
| `final` | `FinalTaskScreen` (final.jsx) | |

### Optional lessons
A lesson object can carry `optional: true`. Optional lessons are **excluded** from all completion checks — they never block module-done status, module unlock, badge awards, or course completion. Every place that computes completion must filter: `mod.lessons.filter(l => !l.optional)`.

Files that contain this filter: `moduleState()` and `unlockedSet()` in `coursemap.jsx`; `modStats()` in `coursemap.jsx`; `applyDone()`, `isCourseDone()`, `completeSimpleLesson()`, and `finishQuiz()` in `App.jsx`.

The optional badge (`⭐ בונוס XP`) is rendered next to the lesson title in BoardMap and JourneyMap lesson lists when the lesson is not yet done.

**Current optional lesson:** M0 / l2 — "שאלון אבחון" (12-question diagnostic quiz, `QUIZZES["m0"]`, 20 XP per question). Accessed via the `diagnostic-gate` screen after the M0 video.

### UI primitives
All shared components (`Icon`, `Button`, `Card`, `ProgressBar`, `ProgressRing`, `Medal`, etc.) are in `src/ui.jsx`. Icons are all from `lucide-react` — use the `<Icon name="...">` wrapper, never import Lucide components directly in other files.

Inline styles reference CSS custom properties defined in `src/styles/tokens.css`. Use `var(--accent)`, `var(--surface)`, `var(--ink)`, etc. — never hardcode hex values.

### Theming
Single theme only — iOS light design language. No `themes.css`, no `aurora.css`, no theme switcher. Background is `#F2F2F7`, cards are white, separators are 0.5px.

**Accent colour rule:** The accent is always red (`#FF3B30` / `var(--accent)`). Never use blue or indigo as accent — anywhere, ever.

### Progress and persistence
`src/scorm.js` is a thin bridge: if `window.SCORM` (injected by `scorm/scorm-api.js` in LMS builds) is present it uses SCORM suspend data; otherwise it falls back to `localStorage`. `scormSave` is called on every progress state change. Progress shape: `{ xp, level, done: string[], badges: string[], scores: {} }`.

**Important:** `<App>` is rendered without `StrictMode` to prevent double-invocation of SCORM `Initialize` in dev.

### SCORM packaging
`vite.config.js` sets `base: './'` so all asset URLs are relative — mandatory for the package to work at arbitrary LMS paths. `assetsInlineLimit: 0` ensures all assets appear as separate files so `make-scorm.mjs` can list them in `imsmanifest.xml`. After `npm run build`, `make-scorm.mjs` injects `scorm-api.js` as the first `<script>` (before the module bundle), adds `lang="he" dir="rtl"` to `<html>`, and zips everything into `release/`.

### Styling conventions
- All layout is inline styles; no CSS modules or Tailwind.
- RTL is set at the document level (`dir="rtl"`); flex containers automatically mirror.
- Design tokens are iOS system values (hex). Radii: `--r-sm` 10 px, `--r` 14 px, `--r-lg` 16 px, `--r-xl` 20 px. All colours via `var(--token)` — never hardcode hex in JSX.
- Animations are CSS `@keyframes` defined in `tokens.css` and applied via inline `animation:` style props. No external animation libraries. All animations must be SCORM-safe (bundled by Vite, no CDN).
- Responsive breakpoint at 640 px: `--maxw` grows from 430 px (mobile) to 900 px (desktop). `--side-pad` goes 16 px → 24 px.
- Desktop hover: use `.card-hover` class (opacity) and `.row-hover` class (background) — defined in `tokens.css`. Button press uses CSS `:active` scale(0.97).
- **Revision mode:** completed lessons can be replayed step-by-step without re-awarding XP. Both `completeSimpleLesson` and `finishQuiz` in `App.jsx` check `progress.done.includes(key)` and short-circuit before calling `applyDone`.
- Course map has three views (board / list / journey) stored in `localStorage` under `"cm-view"`. Default is `"board"`. Segmented control has a CSS sliding pill.
