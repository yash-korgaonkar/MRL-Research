import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    onSnapshot,
    Unsubscribe,
    limit,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase.service';
import { TremorEvent, LiveTremorReading } from '../models/TremorEvent';

const COLLECTION_TREMOR_EVENTS = 'tremorEvents';
const COLLECTION_LIVE_STREAM = 'liveStream';

// ── Live Stream (Firestore real-time, replaces BLE) ────────────────────

export function subscribeLiveTremor(
    userId: string,
    callback: (reading: LiveTremorReading) => void
): Unsubscribe {
    if (__DEV__ && !getFirebaseDb()) {
        return mockTremorStream(callback);
    }

    const docRef = doc(getFirebaseDb(), COLLECTION_LIVE_STREAM, userId);
    return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
            const data = snap.data() as LiveTremorReading;
            callback({ ...data, source: 'live' });
        }
    });
}

// ── Mock stream for development ────────────────────────────────────────

export function mockTremorStream(
    callback: (reading: LiveTremorReading) => void
): Unsubscribe {
    let active = true;
    let tremorActive = false;
    let cycleCount = 0;

    const interval = setInterval(() => {
        if (!active) return;
        cycleCount++;

        // Toggle tremor every 8–15 cycles
        if (cycleCount % (8 + Math.floor(Math.random() * 8)) === 0) {
            tremorActive = !tremorActive;
        }

        const reading: LiveTremorReading = {
            t: Date.now(),
            tremor: tremorActive,
            freq: tremorActive ? 3 + Math.random() * 5 : 0,
            rms: tremorActive ? 0.3 + Math.random() * 0.7 : 0.02 + Math.random() * 0.05,
            sev: tremorActive ? Math.floor(2 + Math.random() * 8) : 0,
            p: tremorActive ? 0.6 + Math.random() * 0.4 : 0.02 + Math.random() * 0.1,
            source: 'mock',
        };

        callback(reading);
    }, 2000);

    return () => {
        active = false;
        clearInterval(interval);
    };
}

// ── Tremor Event CRUD ──────────────────────────────────────────────────

export async function saveTremorEvent(event: Omit<TremorEvent, 'id'>): Promise<string> {
    const docRef = await addDoc(
        collection(getFirebaseDb(), COLLECTION_TREMOR_EVENTS),
        event
    );
    return docRef.id;
}

export async function getTremorHistory(
    userId: string,
    startTime: number,
    endTime: number
): Promise<TremorEvent[]> {
    const q = query(
        collection(getFirebaseDb(), COLLECTION_TREMOR_EVENTS),
        where('userId', '==', userId),
        where('timestamp', '>=', startTime),
        where('timestamp', '<=', endTime),
        orderBy('timestamp', 'desc'),
        limit(200)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TremorEvent));
}

export async function getRecentTremorEvents(
    userId: string,
    count: number = 50
): Promise<TremorEvent[]> {
    const q = query(
        collection(getFirebaseDb(), COLLECTION_TREMOR_EVENTS),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(count)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TremorEvent));
}
