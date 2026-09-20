(function (root) {
  'use strict';
  const labels = { ok: 'Reachable', running: 'Work running', idle: 'Observed', failed: 'Check failed', blocked: 'Access required', unknown: 'Not observed' };
  function classify(signal, now = Date.now()) {
    if (!signal || !labels[signal.state]) return { state: 'unknown', label: 'Not observed', active: false };
    const checked = Date.parse(signal.checkedAt);
    const ttl = signal.staleAfterSeconds;
    if (!Number.isFinite(checked) || !Number.isFinite(ttl) || ttl <= 0 || checked > now + 60000 || now - checked > ttl * 1000) {
      return { state: 'stale', label: 'Observation expired', active: false };
    }
    return { state: signal.state, label: labels[signal.state], active: signal.state === 'running' };
  }
  const api = { classify };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TownActivityModel = api;
})(typeof window === 'undefined' ? {} : window);
