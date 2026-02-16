import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    setDoc,
    getDoc,
    limit,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase.service';
import { BradykinesiaTest, TestType } from '../models/BradykinesiaTest';
import { UserBaseline } from '../models/UserBaseline';

const COLLECTION_BRADY_TESTS = 'bradyTests';
const COLLECTION_BASELINES = 'baselines';

// ── Test CRUD ──────────────────────────────────────────────────────────

export async function saveBradykinesiaTest(
    test: Omit<BradykinesiaTest, 'id'>
): Promise<string> {
    const docRef = await addDoc(
        collection(getFirebaseDb(), COLLECTION_BRADY_TESTS),
        test
    );
    return docRef.id;
}

export async function getTestHistory(
    userId: string,
    testType?: TestType
): Promise<BradykinesiaTest[]> {
    let q;
    if (testType) {
        q = query(
            collection(getFirebaseDb(), COLLECTION_BRADY_TESTS),
            where('userId', '==', userId),
            where('testType', '==', testType),
            orderBy('timestamp', 'desc'),
            limit(100)
        );
    } else {
        q = query(
            collection(getFirebaseDb(), COLLECTION_BRADY_TESTS),
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(100)
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BradykinesiaTest));
}

// ── Baseline ───────────────────────────────────────────────────────────

export async function saveBaseline(baseline: UserBaseline): Promise<void> {
    await setDoc(
        doc(getFirebaseDb(), COLLECTION_BASELINES, baseline.userId),
        baseline
    );
}

export async function getBaseline(userId: string): Promise<UserBaseline | null> {
    const snap = await getDoc(doc(getFirebaseDb(), COLLECTION_BASELINES, userId));
    if (snap.exists()) {
        return snap.data() as UserBaseline;
    }
    return null;
}
