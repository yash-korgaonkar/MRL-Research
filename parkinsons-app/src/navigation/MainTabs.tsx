import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Dashboard from '../screens/Home/Dashboard';
import TremorStack from './TremorStack';
import BradyStack from './BradyStack';
import SettingsStack from './SettingsStack';
import { colors } from '../theme/colors';

export type MainTabParamList = {
  Home: undefined;
  Tremor: undefined;
  Tests: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{name}</Text>
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="⌂" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Tremor"
        component={TremorStack}
        options={{
          title: 'Tremor',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="📈" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Tests"
        component={BradyStack}
        options={{
          title: 'Tests',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="✓" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name="⚙" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18, color: colors.textSecondary },
  iconFocused: { color: colors.primary },
});
