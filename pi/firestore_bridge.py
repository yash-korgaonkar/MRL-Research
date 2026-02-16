"""
Firestore Bridge — Raspberry Pi → Firebase

This script runs on the Raspberry Pi and writes live tremor readings
to Firebase Firestore. The mobile app subscribes to these updates
in real-time via onSnapshot().

Setup:
  1. pip install firebase-admin
  2. Download your Firebase service account key JSON from:
     Firebase Console → Project Settings → Service Accounts → Generate New Private Key
  3. Set the path to the key in FIREBASE_CREDENTIALS below
  4. Set USER_ID to your Firebase Auth UID

Usage:
  python firestore_bridge.py
"""

import time
import random
import firebase_admin
from firebase_admin import credentials, firestore

# ── Configuration ────────────────────────────────────────────────────
FIREBASE_CREDENTIALS = './serviceAccountKey.json'  # Path to your Firebase service account key
USER_ID = 'YOUR_USER_ID_HERE'                       # Your Firebase Auth UID
UPDATE_INTERVAL = 2                                  # Seconds between updates
# ─────────────────────────────────────────────────────────────────────

def initialize_firebase():
    cred = credentials.Certificate(FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)
    return firestore.client()

def generate_tremor_reading(tremor_active: bool) -> dict:
    """
    Replace this function with your actual sensor processing.
    It should return the BLE-contract-compatible JSON.
    """
    if tremor_active:
        return {
            't': time.time(),
            'tremor': True,
            'freq': round(3.0 + random.random() * 5.0, 1),
            'rms': round(0.3 + random.random() * 0.7, 2),
            'sev': random.randint(2, 9),
            'p': round(0.6 + random.random() * 0.4, 2),
        }
    else:
        return {
            't': time.time(),
            'tremor': False,
            'freq': 0.0,
            'rms': round(0.02 + random.random() * 0.05, 3),
            'sev': 0,
            'p': round(0.02 + random.random() * 0.1, 2),
        }

def main():
    db = initialize_firebase()
    doc_ref = db.collection('liveStream').document(USER_ID)

    print(f'Streaming tremor data for user: {USER_ID}')
    print(f'Update interval: {UPDATE_INTERVAL}s')
    print('Press Ctrl+C to stop\n')

    cycle = 0
    tremor_active = False

    try:
        while True:
            cycle += 1

            # Simulate tremor toggling (replace with actual detection)
            if cycle % (8 + random.randint(0, 7)) == 0:
                tremor_active = not tremor_active

            reading = generate_tremor_reading(tremor_active)
            doc_ref.set(reading)

            status = '🔴 TREMOR' if tremor_active else '🟢 Normal'
            print(f'[{status}] freq={reading["freq"]}Hz rms={reading["rms"]} sev={reading["sev"]}')

            time.sleep(UPDATE_INTERVAL)
    except KeyboardInterrupt:
        print('\nStopped.')

if __name__ == '__main__':
    main()
