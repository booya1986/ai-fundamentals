// content/index.js — aggregates per-module content files into merged maps.
import m2 from './m2.js'
import m3 from './m3.js'
import m4 from './m4.js'
import m5 from './m5.js'
import m6 from './m6.js'
import m7 from './m7.js'

const MODS = { m2, m3, m4, m5, m6, m7 }

// lessonContent / copilot are keyed "mid/lid" → merge directly.
export const LESSON_CONTENT_EXTRA = Object.assign({}, ...Object.values(MODS).map((m) => m.lessonContent || {}))
export const COPILOT_EXTRA = Object.assign({}, ...Object.values(MODS).map((m) => m.copilot || {}))
// each module file's `quiz` is that module's quiz → key by module id.
export const QUIZZES_EXTRA = Object.fromEntries(
  Object.entries(MODS).filter(([, m]) => m.quiz).map(([id, m]) => [id, m.quiz])
)
