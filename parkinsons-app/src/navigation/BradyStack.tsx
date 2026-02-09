import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestMenu from '../screens/Bradykinesia/TestMenu';
import SingleTap from '../screens/Bradykinesia/SingleTap';
import AlternatingTap from '../screens/Bradykinesia/AlternatingTap';
import FineMotorTap from '../screens/Bradykinesia/FineMotorTap';
import Results from '../screens/Bradykinesia/Results';
import type { BradyStackParamList } from '../screens/Bradykinesia/TestMenu';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<BradyStackParamList>();

export default function BradyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="TestMenu" component={TestMenu} options={{ title: 'Bradykinesia tests' }} />
      <Stack.Screen name="SingleTap" component={SingleTap} options={{ title: 'Single tap' }} />
      <Stack.Screen name="AlternatingTap" component={AlternatingTap} options={{ title: 'Alternating tap' }} />
      <Stack.Screen name="FineMotorTap" component={FineMotorTap} options={{ title: 'Fine motor' }} />
      <Stack.Screen name="Results" component={Results} options={{ title: 'Results', headerBackVisible: false }} />
    </Stack.Navigator>
  );
}
