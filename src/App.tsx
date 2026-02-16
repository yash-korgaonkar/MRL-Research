import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistor } from './store/store';
import RootNavigator from './navigation/RootNavigator';
import { Colors } from './theme/colors';

// Import global CSS for NativeWind
import '../global.css';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Provider store={store}>
                <PersistGate
                    loading={
                        <View className="flex-1 items-center justify-center bg-primary">
                            <ActivityIndicator size="large" color={Colors.accent} />
                        </View>
                    }
                    persistor={persistor}
                >
                    <SafeAreaProvider>
                        <StatusBar style="light" />
                        <RootNavigator />
                    </SafeAreaProvider>
                </PersistGate>
            </Provider>
        </GestureHandlerRootView>
    );
}
