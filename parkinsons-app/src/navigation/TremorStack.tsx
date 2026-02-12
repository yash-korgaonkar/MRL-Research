import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TremorHistory from '../screens/Tremor/History';
import TremorDetail from '../screens/Tremor/Detail';
import TremorTrends from '../screens/Tremor/Trends';
import { colors } from '../theme/colors';

export type TremorStackParamList = {
  History: undefined;
  Detail: { event: import('../models/TremorEvent').TremorEvent };
  Trends: undefined;
};

const Stack = createNativeStackNavigator<TremorStackParamList>();

export default function TremorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="History" component={TremorHistory} options={{ title: 'Tremor history' }} />
      <Stack.Screen name="Detail" component={TremorDetail} options={{ title: 'Event' }} />
      <Stack.Screen name="Trends" component={TremorTrends} options={{ title: 'Trends' }} />
    </Stack.Navigator>
  );
}
