// helpers.js — Board utility functions (from react-source/core/ui-board.js L97-206)
// Pure functions: no Svelte imports, no DOM dependencies.

export function generateBoardRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function boardUid() {
  return 'b' + Date.now() + Math.random().toString(36).slice(2, 6);
}

export function getWorldTables(campId) {
  if (typeof CAMPAIGNS !== 'undefined' && CAMPAIGNS[campId]) {
    return CAMPAIGNS[campId].tables || {};
  }
  return {};
}

export function getWorldMeta(campId) {
  if (typeof CAMPAIGNS !== 'undefined' && CAMPAIGNS[campId]) {
    return CAMPAIGNS[campId].meta || { name: campId, icon: '◈' };
  }
  return { name: campId, icon: '◈' };
}

export function extractCardTitle(genId, data) {
  if (!data) return genId;
  if (genId === 'custom') return data.title || 'Custom Card';
  return data.name || data.location || data.situation || data.title ||
    (data.aspects && data.aspects.high_concept) || genId;
}

export function extractCardSummary(genId, data) {
  if (!data) return '';
  if (genId === 'custom') return data.body || '';
  const lines = [];
  if (genId === 'npc_minor' || genId === 'npc_major') {
    const hc = (data.aspects && data.aspects.high_concept) || '';
    const tr = (data.aspects && data.aspects.trouble) || '';
    if (hc) lines.push(hc);
    if (tr) lines.push('► ' + tr);
  } else if (genId === 'scene') {
    if (data.situation) lines.push(data.situation);
    if (data.threat) lines.push('Threat: ' + data.threat);
  } else if (genId === 'encounter') {
    if (data.opposition) lines.push(data.opposition);
    if (data.twist) lines.push('Twist: ' + data.twist);
  } else if (genId === 'seed') {
    if (data.hook) lines.push(data.hook);
    else if (data.premise) lines.push(data.premise);
  } else if (genId === 'compel') {
    if (data.situation) lines.push(data.situation);
  } else if (genId === 'consequence') {
    if (data.mild) lines.push('Mild: ' + data.mild);
    else if (data.moderate) lines.push('Moderate: ' + data.moderate);
  } else if (genId === 'faction') {
    if (data.goal) lines.push('Goal: ' + data.goal);
  } else if (genId === 'challenge') {
    if (data.obstacle) lines.push(data.obstacle);
  } else if (genId === 'campaign') {
    if (data.current_issue) lines.push(data.current_issue);
  } else if (genId === 'countdown') {
    if (data.track_name) lines.push(data.track_name);
    if (data.trigger) lines.push('Trigger: ' + data.trigger);
  } else {
    const keys = ['description', 'text', 'body', 'summary'];
    for (let k = 0; k < keys.length; k++) {
      if (data[keys[k]]) { lines.push(data[keys[k]]); break; }
    }
  }
  return lines.slice(0, 2).join('\n');
}

export function extractCardTags(genId, data) {
  const tags = [];
  if (!data) return tags;
  if (genId === 'custom') {
    const typeLabel = { aspect: 'Aspect', npc: 'NPC', location: 'Location', clue: 'Clue', other: 'Other' }[data.type] || 'Custom';
    return [typeLabel];
  }
  if (genId === 'npc_minor' || genId === 'npc_major') {
    const skills = data.skills || [];
    skills.slice(0, 2).forEach(s => tags.push('+' + s.r + ' ' + s.name));
  } else if (genId === 'scene') {
    if (data.zone) tags.push(data.zone);
  } else if (genId === 'challenge' || genId === 'contest') {
    if (data.skills_needed) tags.push(data.skills_needed.slice(0, 2).join(' · '));
  } else if (genId === 'countdown') {
    if (typeof data.boxes === 'number') tags.push(data.boxes + ' Boxes');
  } else if (genId === 'consequence') {
    if (data.moderate) tags.push('Moderate');
    else if (data.severe) tags.push('Severe');
    else if (data.mild) tags.push('Mild');
  }
  return tags;
}

export const STICKY_COLORS = [
  { bg: '#fff9c4', text: '#5a4e00', label: '#8a7800' },
  { bg: '#d4f5e4', text: '#0d4d2a', label: '#0d6e3a' },
  { bg: '#fde8d8', text: '#6a2a00', label: '#b84a1a' },
  { bg: '#e8e4fc', text: '#2a2060', label: '#5a50b0' },
];

export const LABEL_STYLES = [
  { bg: 'color-mix(in srgb,var(--accent) 10%,var(--panel))', border: 'var(--accent)', text: 'var(--accent)' },
  { bg: 'color-mix(in srgb,var(--c-green,#34c759) 10%,var(--panel))', border: 'var(--c-green,#34c759)', text: 'var(--c-green,#34c759)' },
  { bg: 'color-mix(in srgb,var(--c-red,#ff3b30) 10%,var(--panel))', border: 'var(--c-red,#ff3b30)', text: 'var(--c-red,#ff3b30)' },
  { bg: 'color-mix(in srgb,var(--c-purple,#a78bfa) 10%,var(--panel))', border: 'var(--c-purple,#a78bfa)', text: 'var(--c-purple,#a78bfa)' },
  { bg: 'color-mix(in srgb,var(--c-amber,#f4b942) 10%,var(--panel))', border: 'var(--c-amber,#f4b942)', text: 'var(--c-amber,#f4b942)' },
];
