import { BleManager, Device, State } from 'react-native-ble-plx';

export interface BLEStreamPayload {
  t: number;      // Unix timestamp
  tremor: boolean;
  freq: number;
  rms: number;
  sev: number;
  p: number;
}

const SERVICE_UUID = '00001800-0000-1000-8000-00805f9b34fb'; // replace with your Pi service
const CHAR_UUID = '00002a00-0000-1000-8000-00805f9b34fb';   // replace with your Pi characteristic

let manager: BleManager | null = null;

export function getBleManager(): BleManager {
  if (!manager) {
    manager = new BleManager();
  }
  return manager;
}

export async function scanForDevices(
  onDevice: (device: Device) => void,
  timeoutMs: number = 10000
): Promise<void> {
  const ble = getBleManager();
  await ble.startDeviceScan(null, { allowDuplicates: false }, (err, device) => {
    if (err) return;
    if (device) onDevice(device);
  });
  await new Promise((r) => setTimeout(r, timeoutMs));
  ble.stopDeviceScan();
}

export async function connectToDevice(deviceId: string): Promise<Device> {
  const ble = getBleManager();
  const device = await ble.connectToDevice(deviceId);
  await device.discoverAllServicesAndCharacteristics();
  return device;
}

export async function disconnectDevice(deviceId: string): Promise<void> {
  const ble = getBleManager();
  await ble.cancelDeviceConnection(deviceId);
}

export async function subscribeToTremorStream(
  deviceId: string,
  onPayload: (payload: BLEStreamPayload) => void
): Promise<() => void> {
  const device = await connectToDevice(deviceId);
  const subscription = device.monitorCharacteristicForService(
    SERVICE_UUID,
    CHAR_UUID,
    (err, characteristic) => {
      if (err || !characteristic?.value) return;
      try {
        const raw = characteristic.value;
        const decoded: Record<string, unknown> =
          typeof raw === 'string'
            ? (() => {
                try {
                  return JSON.parse(raw);
                } catch {
                  if (typeof (globalThis as unknown as { atob?: (s: string) => string }).atob === 'function') {
                    return JSON.parse((globalThis as unknown as { atob: (s: string) => string }).atob(raw));
                  }
                  return {};
                }
              })()
            : (raw as Record<string, unknown>);
        onPayload({
          t: Number(decoded.t) ?? 0,
          tremor: !!decoded.tremor,
          freq: Number(decoded.freq) || 0,
          rms: Number(decoded.rms) || 0,
          sev: Number(decoded.sev) ?? 0,
          p: Number(decoded.p) ?? 0,
        });
      } catch {
        // ignore parse errors
      }
    }
  );
  return () => {
    subscription.remove();
  };
}

export async function getBleState(): Promise<State> {
  return getBleManager().state();
}

export function destroyBleManager(): void {
  if (manager) {
    manager.destroy();
    manager = null;
  }
}
