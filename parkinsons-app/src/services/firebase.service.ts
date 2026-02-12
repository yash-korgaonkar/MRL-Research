import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { auth as firebaseAuth, db as firebaseDb } from '../firebase/config';
import { TremorEvent, TremorEventCreate } from '../models/TremorEvent';
import { BradykinesiaTest, BradykinesiaTestCreate } from '../models/BradykinesiaTest';
import { UserBaseline } from '../models/UserBaseline';

export function initFirebase(): { auth: Auth; db: Firestore } {
  return { auth: firebaseAuth, db: firebaseDb };
}

export function getFirebaseAuth(): Auth {
  return firebaseAuth;
}

export function getFirebaseDb(): Firestore {
  return firebaseDb;
}

// --- Auth ---
export async function signUp(email: string, password: string): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  await ensureUserDoc(cred.user.uid);
  return cred;
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export function signOut(): Promise<void> {
  return firebaseSignOut(getFirebaseAuth());
}

export function subscribeAuth(cb: (user: User | null) => void): () => void {
  return onAuthStateChanged(getFirebaseAuth(), cb);
}

// --- Users ---
export async function ensureUserDoc(uid: string): Promise<void> {
  const ref = doc(getFirebaseDb(), 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      createdAt: Timestamp.now(),
      baselineComplete: false,
    });
  }
}

export async function setBaselineComplete(uid: string, value: boolean): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), 'users', uid),
    { baselineComplete: value },
    { merge: true }
  );
}

// --- Tremor events ---
export async function saveTremorEvent(data: TremorEventCreate): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), 'tremorEvents'), {
    ...data,
    timestamp: Timestamp.fromMillis(data.timestamp),
  });
  return ref.id;
}

export async function getTremorEvents(
  userId: string,
  fromMs: number,
  toMs: number,
  maxResults: number = 200
): Promise<TremorEvent[]> {
  const col = collection(getFirebaseDb(), 'tremorEvents');
  const q = query(
    col,
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromMillis(fromMs)),
    where('timestamp', '<=', Timestamp.fromMillis(toMs)),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const t = d.data();
    return {
      id: d.id,
      userId: t.userId,
      timestamp: t.timestamp?.toMillis?.() ?? t.timestamp,
      durationSec: t.durationSec,
      frequencyHz: t.frequencyHz,
      rms: t.rms,
      severity: t.severity,
      probability: t.probability,
    } as TremorEvent;
  });
}

// --- Bradykinesia tests ---
export async function saveBradyTest(data: BradykinesiaTestCreate): Promise<string> {
  const ref = await addDoc(collection(getFirebaseDb(), 'bradyTests'), {
    ...data,
    timestamp: Timestamp.fromMillis(data.timestamp),
  });
  return ref.id;
}

export async function getBradyTests(
  userId: string,
  fromMs: number,
  toMs: number,
  maxResults: number = 100
): Promise<BradykinesiaTest[]> {
  const col = collection(getFirebaseDb(), 'bradyTests');
  const q = query(
    col,
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromMillis(fromMs)),
    where('timestamp', '<=', Timestamp.fromMillis(toMs)),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const t = d.data();
    return {
      id: d.id,
      userId: t.userId,
      timestamp: t.timestamp?.toMillis?.() ?? t.timestamp,
      testType: t.testType,
      taps: t.taps ?? [],
      interTapIntervals: t.interTapIntervals ?? [],
      features: t.features ?? {},
      severity: t.severity,
    } as BradykinesiaTest;
  });
}

// --- Baselines ---
export async function getBaseline(userId: string): Promise<UserBaseline | null> {
  const ref = doc(getFirebaseDb(), 'baselines', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    userId: snap.id,
    singleTap: d?.singleTap ?? { meanInterval: 0, variance: 0, tapCount: 0 },
    alternatingTap: d?.alternatingTap ?? { meanInterval: 0, variance: 0, tapCount: 0 },
    fineMotorTap: d?.fineMotorTap ?? { meanInterval: 0, variance: 0, tapCount: 0 },
    updatedAt: d?.updatedAt?.toMillis?.() ?? 0,
  };
}

export async function saveBaseline(data: UserBaseline): Promise<void> {
  const ref = doc(getFirebaseDb(), 'baselines', data.userId);
  await setDoc(ref, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}
