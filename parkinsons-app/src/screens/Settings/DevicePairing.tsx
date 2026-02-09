import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { scanForDevices, connectToDevice, getBleState } from '../../services/ble.service';
import { useBle } from '../../context/BleContext';
import { colors } from '../../theme/colors';

export default function DevicePairing() {
  const { connectStream, connectedDeviceId } = useBle();
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [bleState, setBleState] = useState<string>('Unknown');

  useEffect(() => {
    getBleState().then((s) => setBleState(s));
  }, []);

  const startScan = async () => {
    setScanning(true);
    setDevices([]);
    const seen = new Set<string>();
    await scanForDevices((device) => {
      if (!seen.has(device.id)) {
        seen.add(device.id);
        setDevices((prev) => [...prev.filter((d) => d.id !== device.id), device]);
      }
    }, 10000);
    setScanning(false);
  };

  const connect = async (device: Device) => {
    try {
      await connectStream(device.id);
      Alert.alert('Connected', `Monitoring started for ${device.name ?? device.id}. Live tremor will appear on the Dashboard.`);
    } catch (e) {
      Alert.alert('Connection failed', e instanceof Error ? e.message : 'Could not connect.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device pairing</Text>
      <Text style={styles.subtitle}>Pair your tremor sensor (BLE)</Text>
      <Text style={styles.state}>Bluetooth: {bleState}</Text>
      {connectedDeviceId ? (
        <Text style={styles.connected}>Monitoring active</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, scanning && styles.buttonDisabled]}
        onPress={startScan}
        disabled={scanning}
      >
        {scanning ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.buttonText}>Scan for devices</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deviceRow}
            onPress={() => connect(item)}
          >
            <Text style={styles.deviceName}>{item.name ?? 'Unknown'}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !scanning && devices.length === 0 ? (
            <Text style={styles.empty}>Tap Scan to find devices</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
  state: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  list: { flex: 1 },
  deviceRow: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  deviceName: { fontSize: 16, fontWeight: '600', color: colors.text },
  deviceId: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
  connected: { fontSize: 14, color: colors.success, marginBottom: 8 },
});
