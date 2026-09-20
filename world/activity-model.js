(function (root) {
  'use strict';
  const labels = { ok: 'Reachable', running: 'Work running', queued: 'Work queued', stopping: 'Work stopping', available: 'Supervisors available', idle: 'Observed', failed: 'Check failed', blocked: 'Access required', cancelled: 'Work cancelled', skipped: 'Work skipped', neutral: 'Work completed', unknown: 'Not observed' };
  function classify(signal, now = Date.now()) {
    if (!signal || !Object.hasOwn(labels, signal.state)) return { state: 'unknown', label: 'Not observed', active: false };
    const checked = Date.parse(signal.checkedAt);
    const ttl = signal.staleAfterSeconds;
    if (!Number.isFinite(checked) || !Number.isFinite(ttl) || ttl <= 0 || checked > now + 60000 || now - checked > ttl * 1000) {
      return { state: 'stale', label: 'Observation expired', active: false };
    }
    return { state: signal.state, label: labels[signal.state], active: signal.state === 'running' };
  }
  function summarize(signals, now = Date.now()) {
    const checks = signals.map(signal => classify(signal, now));
    for (const state of ['failed', 'blocked', 'stale', 'running', 'queued', 'stopping', 'available', 'cancelled', 'skipped', 'neutral', 'ok', 'idle']) {
      const match = checks.find(check => check.state === state);
      if (match) return match;
    }
    return classify(null, now);
  }
  const api = { classify, summarize };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TownActivityModel = api;
})(typeof window === 'undefined' ? {} : window);
