import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/Settings/Profile';
import DevicePairing from '../screens/Settings/DevicePairing';
import Privacy from '../screens/Settings/Privacy';
import { colors } from '../theme/colors';

export type SettingsStackParamList = {
  Profile: undefined;
  DevicePairing: undefined;
  Privacy: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Settings' }} />
      <Stack.Screen name="DevicePairing" component={DevicePairing} options={{ title: 'Device pairing' }} />
      <Stack.Screen name="Privacy" component={Privacy} options={{ title: 'Privacy' }} />
    </Stack.Navigator>
  );
}
