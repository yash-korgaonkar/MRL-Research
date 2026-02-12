import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  subscribeToTremorStream,
  disconnectDevice,
  BLEStreamPayload,
} from '../services/ble.service';
import { processBlePayload } from '../services/tremor.service';

type BleContextValue = {
  connectedDeviceId: string | null;
  connectStream: (deviceId: string) => Promise<void>;
  disconnectStream: () => Promise<void>;
};

const BleContext = createContext<BleContextValue | null>(null);

export function BleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [connectedDeviceId, setConnectedDeviceId] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const disconnectStream = useCallback(async () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    if (connectedDeviceId) {
      try {
        await disconnectDevice(connectedDeviceId);
      } catch {}
      setConnectedDeviceId(null);
    }
  }, [connectedDeviceId]);

  const connectStream = useCallback(
    async (deviceId: string) => {
      if (!user?.uid) return;
      await disconnectStream();
      const unsub = await subscribeToTremorStream(deviceId, (payload: BLEStreamPayload) => {
        processBlePayload(payload, user.uid);
      });
      unsubscribeRef.current = unsub;
      setConnectedDeviceId(deviceId);
    },
    [user?.uid, disconnectStream]
  );

  const value: BleContextValue = {
    connectedDeviceId,
    connectStream,
    disconnectStream,
  };

  return <BleContext.Provider value={value}>{children}</BleContext.Provider>;
}

export function useBle(): BleContextValue {
  const ctx = useContext(BleContext);
  if (!ctx) {
    return {
      connectedDeviceId: null,
      connectStream: async () => {},
      disconnectStream: async () => {},
    };
  }
  return ctx;
}
