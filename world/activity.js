(() => {
  'use strict';
  const names = { pizza: 'Food maps', resume: 'Resume Revamped', duo: 'DuoCalculator', builthere: 'BuiltHere.City', homelab: 'Homelab', travel: 'Side Quests' };
  const classify = window.TownActivityModel.classify;
  let snapshot = null, connectionFailed = false, inFlight = false;
  const status = document.querySelector('#activity-summary');
  const panel = document.querySelector('#activity-cards');
  function signals(scene) { return snapshot?.buildings?.[scene]?.signals ?? []; }
  function sceneState(scene) {
    if (connectionFailed) return { state: 'unknown', label: 'Feed unavailable', active: false };
    return window.TownActivityModel.summarize(signals(scene));
  }
  function add(parent, tag, text, cls) {
    const el = document.createElement(tag); el.textContent = text;
    if (cls) el.className = cls;
    parent.append(el); return el;
  }
  function render() {
    status.textContent = connectionFailed ? 'Activity feed unavailable · prior observations below' : snapshot ? 'Observed project activity · refreshes every 30 seconds' : 'Loading project observations…';
    panel.replaceChildren();
    for (const [scene, name] of Object.entries(names)) {
      const card = document.createElement('article'); card.className = 'activity-card';
      card.dataset.state = sceneState(scene).state;
      add(card, 'h3', name);
      const rows = signals(scene);
      if (!rows.length) add(card, 'p', 'No source connected. Exhibit animation is illustrative.');
      for (const signal of rows) {
        const result = connectionFailed ? { label: 'Feed unavailable · last observation' } : classify(signal);
        const row = add(card, 'div', '', 'activity-signal');
        add(row, 'strong', `${signal.label} · ${result.label}`);
        add(row, 'p', signal.detail || 'No additional detail.');
        const date = Date.parse(signal.checkedAt);
        add(row, 'small', Number.isFinite(date) ? `Observed ${new Date(date).toLocaleString()}${signal.eventAt ? ` · Event ${new Date(signal.eventAt).toLocaleString()}` : ''}` : 'Observation time unavailable');
        if (signal.url && /^https:\/\//.test(signal.url)) {
          const a = add(row, 'a', 'Source ↗'); a.href = signal.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        }
      }
      panel.append(card);
    }
    document.querySelectorAll('[data-hotspot-id]').forEach(button => {
      const id = button.dataset.hotspotId;
      const scene = id === 'taco-door' ? 'pizza' : id === 'side-quests-door' ? 'travel' : id.replace('-door', '');
      if (!names[scene] || !id.endsWith('-door')) return;
      let badge = button.querySelector('.activity-badge');
      if (!badge) { badge = document.createElement('span'); badge.className = 'activity-badge'; button.append(badge); }
      const result = sceneState(scene); badge.textContent = result.label; badge.dataset.state = result.state;
      button.title = `${names[scene]}: ${result.label}. See observed activity below.`;
    });
    const scene = document.querySelector('#game-stage').dataset.scene;
    const result = sceneState(scene);
    document.querySelectorAll('.npc').forEach(npc => {
      npc.dataset.sourceState = result.state;
      npc.classList.toggle('has-observed-work', result.active);
    });
    const room = document.querySelector('#room-activity');
    room.textContent = scene === 'town' ? 'Explore a building or open the activity board.' : `${names[scene]} · ${result.label}. See the activity board for source evidence.`;
  }
  async function refresh() {
    if (inFlight) return;
    inFlight = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`activity.json?t=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error('Feed request failed');
      const next = await response.json();
      if (next.schemaVersion !== 1 || !next.buildings || typeof next.buildings !== 'object') throw new Error('Invalid activity feed');
      for (const building of Object.values(next.buildings)) {
        if (!building || !Array.isArray(building.signals) || building.signals.some(s => !s || typeof s.label !== 'string' || typeof s.detail !== 'string')) throw new Error('Invalid source records');
      }
      snapshot = next; connectionFailed = false;
    } catch (_) { connectionFailed = true; }
    finally { clearTimeout(timeout); inFlight = false; render(); }
  }
  document.querySelector('#refresh-activity').addEventListener('click', refresh);
  new MutationObserver(render).observe(document.querySelector('#game-stage'), { attributes: true, attributeFilter: ['data-scene'] });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  setInterval(() => { render(); if (!document.hidden) refresh(); }, 30000);
  refresh();
})();
