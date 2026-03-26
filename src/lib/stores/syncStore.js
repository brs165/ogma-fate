// syncStore.js — WebSocket sync: connect/disconnect, room code, role, PartySocket
// Factory: createSyncStore(showToast)
import { writable, get } from 'svelte/store';
import { generateBoardRoomCode } from '../helpers.js';

const OGMA_DEFAULT_SYNC_HOST = 'ogma-sync.brs165.workers.dev';

// createTableSync — low-level WebSocket multiplayer session (mirrors ui.js L1035-1113)
function createTableSync(roomCode, role, onStateUpdate, onRoll, onToast, onPresence) {
  // PartySocket is loaded via CDN global
  if (typeof PartySocket === 'undefined') { console.warn('PartySocket not loaded'); return null; }
  const TABLE_SYNC_HOST = (typeof localStorage !== 'undefined' && localStorage.getItem('ogma_sync_host')) || OGMA_DEFAULT_SYNC_HOST;
  const ws = new PartySocket({ host: TABLE_SYNC_HOST, room: roomCode.toLowerCase(), query: { role } });
  const sync = {
    ws, role, roomCode, connected: false, _lastState: null,
    broadcastState(state) {
      if (sync.role !== 'gm' || !sync.connected) return;
      sync._lastState = state;
      ws.send(JSON.stringify({ type: 'state', payload: state }));
    },
    broadcastLastState() {
      if (sync.role !== 'gm' || !sync.connected || !sync._lastState) return;
      ws.send(JSON.stringify({ type: 'state', payload: sync._lastState }));
    },
    broadcastRoll(data) {
      // MP-20: GM broadcasts dice result
      if (sync.role !== 'gm' || !sync.connected) return;
      ws.send(JSON.stringify(Object.assign({ type: 'roll' }, data)));
    },
    sendRoll(playerId, data) {
      // MP-21: Player sends dice result
      if (sync.role !== 'player' || !sync.connected) return;
      ws.send(JSON.stringify(Object.assign({ type: 'player_roll', playerId }, data)));
    },
    sendCursor(x, y, name, color, id) {
      // MP-22: player broadcasts cursor position
      if (sync.role !== 'player' || !sync.connected) return;
      ws.send(JSON.stringify({ type: 'player_cursor', x, y, name, color, id }));
    },
    sendAction(playerId, action, patch) {
      if (sync.role !== 'player' || !sync.connected) return;
      ws.send(JSON.stringify({ type: 'player_action', playerId, action, patch }));
    },
    disconnect() { ws.close(); sync.connected = false; },
  };
  ws.addEventListener('open', () => { sync.connected = true; });
  ws.addEventListener('close', () => { sync.connected = false; });
  ws.addEventListener('message', event => {
    let data;
    try { data = JSON.parse(event.data); } catch (e) { return; }
    switch (data.type) {
      case 'welcome':
        if (data.state && sync.role === 'player') onStateUpdate(data.state);
        break;
      case 'state':
        if (sync.role === 'player') onStateUpdate(data.payload);
        break;
      case 'toast': onToast(data.msg); break;
      case 'presence':
        onPresence(data.connections);
        // MP-07 fix: re-broadcast state when a new player joins (300ms delay)
        if (sync.role === 'gm' && sync._lastState) {
          setTimeout(() => sync.broadcastLastState(), 300);
        }
        break;
      case 'roll':
        onRoll(data); break;
      case 'player_roll':
        if (sync.role === 'gm') onRoll(data);
        break;
      case 'cursor':
        if (sync.role === 'player') onStateUpdate({ type: 'cursor', x: data.x, y: data.y, name: data.name, color: data.color, id: data.id });
        break;
      case 'player_cursor':
        if (sync.role === 'gm') onStateUpdate({ type: 'cursor', x: data.x, y: data.y, name: data.name, color: data.color, id: data.id });
        break;
      case 'player_action':
        if (sync.role === 'gm') onStateUpdate({ type: 'player_action', playerId: data.playerId, patch: data.patch });
        break;
    }
  });
  return sync;
}

export function createSyncStore(showToast) {
  const syncObj    = writable(null);
  const syncStatus = writable('offline'); // 'offline' | 'connecting' | 'connected'
  const roomCode   = writable(() => {
    try { return new URLSearchParams(location.search).get('room') || ''; } catch (e) { return ''; }
  });
  const showJoin   = writable(false);
  const joinInput  = writable('');

  // Initialise roomCode from URL param
  try {
    const urlRoom = new URLSearchParams(location.search).get('room') || '';
    roomCode.set(urlRoom);
  } catch (e) {
    roomCode.set('');
  }

  function connectAsHost() {
    if (typeof PartySocket === 'undefined') { showToast('⚠ Sync not available offline'); return; }
    const code = (() => {
      const cur = get(roomCode);
      return (cur && cur.length === 4) ? cur : generateBoardRoomCode();
    })();
    roomCode.set(code);
    const s = createTableSync(
      code, 'gm',
      () => {},
      roll => showToast(roll.who + ' · ' + (roll.total >= 0 ? '+' : '') + roll.total),
      msg => showToast(msg),
      () => {}
    );
    if (!s) { showToast('⚠ Could not connect'); return; }
    syncObj.set(s);
    syncStatus.set('connecting');
    s.ws.addEventListener('open', () => { syncStatus.set('connected'); showToast('✅ Live — room: ' + code); });
    s.ws.addEventListener('close', () => { syncStatus.set('offline'); });
  }

  function disconnectSync() {
    const s = get(syncObj);
    if (s) s.disconnect();
    syncObj.set(null);
    syncStatus.set('offline');
  }

  return {
    syncObj, syncStatus, roomCode, showJoin, joinInput,
    connectAsHost, disconnectSync,
    createTableSync,
  };
}
