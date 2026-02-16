import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

// Home
import DashboardScreen from '../screens/Home/Dashboard';

// Tremor
import TremorHistoryScreen from '../screens/Tremor/History';
import TremorDetailScreen from '../screens/Tremor/Detail';
import TremorTrendsScreen from '../screens/Tremor/Trends';

// Bradykinesia
import TestMenuScreen from '../screens/Bradykinesia/TestMenu';
import SingleTapScreen from '../screens/Bradykinesia/SingleTap';
import AlternatingTapScreen from '../screens/Bradykinesia/AlternatingTap';
import FineMotorTapScreen from '../screens/Bradykinesia/FineMotorTap';
import ResultsScreen from '../screens/Bradykinesia/Results';

// Settings
import ProfileScreen from '../screens/Settings/Profile';
import DevicePairingScreen from '../screens/Settings/DevicePairing';
import PrivacyScreen from '../screens/Settings/Privacy';

// ── Type Definitions ──────────────────────────────────────────────────

export type HomeStackParamList = {
    Dashboard: undefined;
};

export type TremorStackParamList = {
    TremorHistory: undefined;
    TremorDetail: { eventId: string };
    TremorTrends: undefined;
};

export type BradykinesiaStackParamList = {
    TestMenu: undefined;
    SingleTap: undefined;
    AlternatingTap: undefined;
    FineMotorTap: undefined;
    Results: undefined;
};

export type SettingsStackParamList = {
    SettingsMenu: undefined;
    DevicePairing: undefined;
    Privacy: undefined;
};

// ── Stack Navigators ──────────────────────────────────────────────────

const HomeStack = createStackNavigator<HomeStackParamList>();
function HomeStackScreen() {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
        </HomeStack.Navigator>
    );
}

const TremorStack = createStackNavigator<TremorStackParamList>();
function TremorStackScreen() {
    return (
        <TremorStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.textPrimary,
                headerTitleStyle: { fontWeight: '600' },
            }}
        >
            <TremorStack.Screen
                name="TremorHistory"
                component={TremorHistoryScreen}
                options={{ title: 'Tremor History' }}
            />
            <TremorStack.Screen
                name="TremorDetail"
                component={TremorDetailScreen}
                options={{ title: 'Event Detail' }}
            />
            <TremorStack.Screen
                name="TremorTrends"
                component={TremorTrendsScreen}
                options={{ title: 'Trends' }}
            />
        </TremorStack.Navigator>
    );
}

const BradyStack = createStackNavigator<BradykinesiaStackParamList>();
function BradyStackScreen() {
    return (
        <BradyStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.textPrimary,
                headerTitleStyle: { fontWeight: '600' },
            }}
        >
            <BradyStack.Screen
                name="TestMenu"
                component={TestMenuScreen}
                options={{ title: 'Motor Tests' }}
            />
            <BradyStack.Screen
                name="SingleTap"
                component={SingleTapScreen}
                options={{ headerShown: false }}
            />
            <BradyStack.Screen
                name="AlternatingTap"
                component={AlternatingTapScreen}
                options={{ headerShown: false }}
            />
            <BradyStack.Screen
                name="FineMotorTap"
                component={FineMotorTapScreen}
                options={{ headerShown: false }}
            />
            <BradyStack.Screen
                name="Results"
                component={ResultsScreen}
                options={{ title: 'Test Results' }}
            />
        </BradyStack.Navigator>
    );
}

const SettingsStack = createStackNavigator<SettingsStackParamList>();
function SettingsStackScreen() {
    return (
        <SettingsStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.surface },
                headerTintColor: Colors.textPrimary,
                headerTitleStyle: { fontWeight: '600' },
            }}
        >
            <SettingsStack.Screen
                name="SettingsMenu"
                component={ProfileScreen}
                options={{ title: 'Settings' }}
            />
            <SettingsStack.Screen
                name="DevicePairing"
                component={DevicePairingScreen}
                options={{ title: 'Device Connection' }}
            />
            <SettingsStack.Screen
                name="Privacy"
                component={PrivacyScreen}
                options={{ title: 'Privacy & Data' }}
            />
        </SettingsStack.Navigator>
    );
}

// ── Bottom Tabs ───────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.border,
                    borderTopWidth: 0.5,
                    height: 88,
                    paddingBottom: 28,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: Colors.accent,
                tabBarInactiveTintColor: Colors.textSecondary,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Tremor') iconName = focused ? 'pulse' : 'pulse-outline';
                    else if (route.name === 'Motor') iconName = focused ? 'hand-left' : 'hand-left-outline';
                    else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Tremor" component={TremorStackScreen} />
            <Tab.Screen name="Motor" component={BradyStackScreen} />
            <Tab.Screen name="Settings" component={SettingsStackScreen} />
        </Tab.Navigator>
    );
}
