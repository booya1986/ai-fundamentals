// scorm.js — thin bridge over window.SCORM with a localStorage fallback.
// Works identically standalone (no LMS API → localStorage) and in-LMS.
const KEY = "ai-course-progress-v1"
let _live = null

function scormInit() {
  if (_live !== null) return _live
  _live = (typeof window !== "undefined" && window.SCORM) ? window.SCORM.init() : false
  return _live
}

export function scormLoad(fallback) {
  scormInit()
  if (_live) {
    try { const sd = window.SCORM.getSuspendData(); if (sd) return JSON.parse(sd) } catch (e) {}
  }
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch (e) {}
  return JSON.parse(JSON.stringify(fallback))
}

export function scormSave(progress, meta) {
  try { localStorage.setItem(KEY, JSON.stringify(progress)) } catch (e) {}
  if (_live && window.SCORM) {
    window.SCORM.setSuspendData(JSON.stringify(progress))
    if (meta) {
      if (typeof meta.progressMeasure === "number") window.SCORM.set("cmi.progress_measure", meta.progressMeasure.toFixed(4))
      window.SCORM.set("cmi.completion_status", meta.completed ? "completed" : "incomplete")
      if (typeof meta.scoreScaled === "number" && meta.scoreMax > 0) {
        window.SCORM.set("cmi.score.scaled", meta.scoreScaled.toFixed(4))
        window.SCORM.set("cmi.score.raw", meta.scoreRaw)
        window.SCORM.set("cmi.score.min", 0)
        window.SCORM.set("cmi.score.max", meta.scoreMax)
      }
      if (meta.completed) window.SCORM.set("cmi.success_status", meta.passed ? "passed" : "unknown")
    }
    window.SCORM.commit()
  }
}

export function scormTerminate() {
  if (_live && window.SCORM) window.SCORM.terminate()
}

export function isLive() { return !!_live }
