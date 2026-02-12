import { saveTremorEvent } from './firebase.service';
import { tremorToSeverity } from '../utils/severity';
import { BLEStreamPayload } from './ble.service';

export interface LiveTremorState {
  active: boolean;
  severity: number;
  frequencyHz: number;
  rms: number;
  probability: number;
  lastUpdateTime: number;
  lastTremorEndTime: number | null;
}

let currentState: LiveTremorState = {
  active: false,
  severity: 0,
  frequencyHz: 0,
  rms: 0,
  probability: 0,
  lastUpdateTime: 0,
  lastTremorEndTime: null,
};

let tremorStartTime: number | null = null;
const listeners: Set<(state: LiveTremorState) => void> = new Set();

export function getLiveTremorState(): LiveTremorState {
  return { ...currentState };
}

export function subscribeLiveTremor(cb: (state: LiveTremorState) => void): () => void {
  listeners.add(cb);
  cb(currentState);
  return () => listeners.delete(cb);
}

function setState(next: Partial<LiveTremorState>): void {
  currentState = { ...currentState, ...next };
  listeners.forEach((cb) => cb(currentState));
}

export function processBlePayload(payload: BLEStreamPayload, userId: string): void {
  const now = Date.now();
  const wasActive = currentState.active;

  if (payload.tremor) {
    if (!tremorStartTime) tremorStartTime = payload.t * 1000 || now;
    const severity = payload.sev >= 0 && payload.sev <= 10 ? payload.sev : tremorToSeverity(payload.rms, payload.freq);
    setState({
      active: true,
      severity,
      frequencyHz: payload.freq,
      rms: payload.rms,
      probability: payload.p,
      lastUpdateTime: now,
    });
  } else {
    if (wasActive && tremorStartTime) {
      const durationSec = (now - tremorStartTime) / 1000;
      const severity = currentState.severity;
      saveTremorEvent({
        userId,
        timestamp: tremorStartTime,
        durationSec,
        frequencyHz: currentState.frequencyHz,
        rms: currentState.rms,
        severity,
        probability: currentState.probability,
      }).catch(() => {}); // never block on network
      setState({ lastTremorEndTime: now });
      tremorStartTime = null;
    }
    setState({
      active: false,
      severity: 0,
      frequencyHz: payload.freq,
      rms: payload.rms,
      probability: payload.p,
      lastUpdateTime: now,
    });
  }
}

export function resetLiveTremor(): void {
  tremorStartTime = null;
  setState({
    active: false,
    severity: 0,
    frequencyHz: 0,
    rms: 0,
    probability: 0,
    lastUpdateTime: 0,
    lastTremorEndTime: null,
  });
}
