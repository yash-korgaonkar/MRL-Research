# TremorSync

A mobile app for tracking Parkinsonian tremor and bradykinesia (slowness of movement) between doctor visits.

A Raspberry Pi bridge writes live tremor readings (frequency, RMS amplitude, severity score, and detection confidence) to Firebase Firestore, and the app subscribes to them in real time. Alongside passive tremor monitoring, the app runs guided finger-tapping tests that measure motor slowing against the user's own baseline.

## Features

- **Live tremor monitoring:** real-time dashboard with a severity dial, current frequency, and amplitude
- **Tremor history and trends:** event log, trend charts over time, and JSON export to share with a clinician
- **Bradykinesia tests:** single-tap, alternating-tap, and fine-motor tapping tests
- **Motor feature extraction:** tap frequency, inter-tap interval variance, and fatigue slope computed per 30-second segment and compared to a personal baseline
- **Accounts and privacy:** Firebase Authentication with Google and Apple sign-in, device pairing, and privacy settings

## Stack

React Native (Expo) · TypeScript · Redux Toolkit · Firebase (Auth, Firestore) · Python + Firebase Admin on Raspberry Pi · Docker for the JS toolchain

## Structure

| Path | Contents |
|---|---|
| `src/screens/` | Home dashboard, tremor history/trends/detail, bradykinesia tests, auth, settings |
| `src/services/` | Firebase, tremor, and bradykinesia data services |
| `src/utils/` | Statistics and severity/feature extraction |
| `pi/firestore_bridge.py` | Raspberry Pi script that publishes tremor readings to Firestore |

## Running locally

```bash
cp .env.example .env    # fill in your Firebase project config
npm install
npx expo start          # open in Expo Go
```

On the Raspberry Pi:

```bash
pip install firebase-admin
python pi/firestore_bridge.py
```

See `DOCKER_GUIDE.md` to run the toolchain in Docker.

## Disclaimer

TremorSync is a research prototype, not a medical device, and is not intended for diagnosis.
