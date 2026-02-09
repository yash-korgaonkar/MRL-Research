# Patient-Facing Parkinson's Monitoring App

React Native (Expo) app for patients to monitor tremor and run self-administered bradykinesia tests. Data is stored securely in Firebase. Live tremor updates come from a BLE device (e.g. Raspberry Pi).

## Tech stack

- **Mobile:** React Native (Expo), TypeScript, React Navigation, react-native-ble-plx, react-native-svg, React Native Reanimated, Expo Haptics
- **Backend:** Firebase Auth, Cloud Firestore

## Setup

1. **Install dependencies**

   ```bash
   cd parkinsons-app
   npm install
   ```

2. **Firebase**

   - Create a project at [Firebase Console](https://console.firebase.google.com).
   - Enable **Authentication** (Email/Password).
   - Create a **Firestore** database.
   - In Firestore, create composite indexes (if prompted by the app):
     - Collection `tremorEvents`: fields `userId` (Ascending), `timestamp` (Descending).
     - Collection `bradyTests`: fields `userId` (Ascending), `timestamp` (Descending).
   - Add a web app and copy the config. Create a `.env` (or use `app.config.js` with `extra`) with:
     - `EXPO_PUBLIC_FIREBASE_API_KEY`
     - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
     - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `EXPO_PUBLIC_FIREBASE_APP_ID`

3. **BLE (Pi contract)**

   The app expects BLE notifications with JSON:

   ```json
   { "t": 1700000000, "tremor": true, "freq": 5.1, "rms": 0.92, "sev": 7, "p": 0.88 }
   ```

   Update `SERVICE_UUID` and `CHAR_UUID` in `src/services/ble.service.ts` to match your Pi GATT service/characteristic.

4. **Run**

   ```bash
   npx expo start
   ```

   **Note:** `react-native-ble-plx` requires native code. For full BLE support use a **development build** (`npx expo prebuild` then run on device/simulator). Expo Go may not support BLE on all devices.

## App structure

- **Auth:** Login, Signup
- **Dashboard:** Live tremor status, severity dial (0–10), frequency, time since last tremor, 24h sparkline
- **Tremor:** History (daily/weekly/monthly), event detail, trends (severity & duration over time)
- **Bradykinesia:** 30s tests — Single-target tap, Alternating tap, Fine motor; results with severity (Mild/Moderate/Severe)
- **Settings:** Profile, Device pairing (BLE), Privacy

## Data model (Firestore)

- **users/{uid}:** `createdAt`, `baselineComplete`
- **tremorEvents/{eventId}:** `userId`, `timestamp`, `durationSec`, `frequencyHz`, `rms`, `severity` (0–10), `probability`
- **bradyTests/{testId}:** `userId`, `timestamp`, `testType`, `taps`, `interTapIntervals`, `features`, `severity` (0–10)
- **baselines/{userId}:** `singleTap`, `alternatingTap`, `fineMotorTap` (meanInterval, variance, tapCount)

## Design

- Dark mode first, calm palette, red only when tremor is active
- Rounded cards, clear typography, no medical jargon
