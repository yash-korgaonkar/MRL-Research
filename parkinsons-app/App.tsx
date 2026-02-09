import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initFirebase } from './src/services/firebase.service';
import { BleProvider } from './src/context/BleContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  useEffect(() => {
    initFirebase();
  }, []);

  return (
    <SafeAreaProvider>
      <BleProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </BleProvider>
    </SafeAreaProvider>
  );
}
