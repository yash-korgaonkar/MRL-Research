import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppSelector } from '../../store/hooks';
import { signOut } from '../../services/firebase.service';
import { Colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { SettingsStackParamList } from '../../navigation/MainTabs';

type Nav = StackNavigationProp<SettingsStackParamList, 'SettingsMenu'>;

export default function ProfileScreen() {
    const navigation = useNavigation<Nav>();
    const { email, uid } = useAppSelector((s) => s.auth);

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                        } catch (e) {
                            console.warn('Sign out failed:', e);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView className="flex-1 bg-primary" showsVerticalScrollIndicator={false}>
            {/* Profile Card */}
            <View className="bg-surface rounded-2xl p-5 mx-4 mt-4 mb-4 items-center">
                <View className="w-16 h-16 rounded-full bg-accent items-center justify-center mb-3">
                    <Text className="text-white text-2xl font-bold">
                        {email ? email[0].toUpperCase() : '?'}
                    </Text>
                </View>
                <Text className="text-text-primary text-base font-semibold">
                    {email || 'Unknown'}
                </Text>
                <Text className="text-text-secondary text-xs mt-1">
                    ID: {uid?.slice(0, 8) || '—'}
                </Text>
            </View>

            {/* Menu Items */}
            <View className="mx-4 mb-4">
                <MenuItem
                    icon="bluetooth"
                    label="Device Connection"
                    onPress={() => navigation.navigate('DevicePairing')}
                />
                <MenuItem
                    icon="shield-checkmark"
                    label="Privacy & Data"
                    onPress={() => navigation.navigate('Privacy')}
                />
            </View>

            {/* Sign Out */}
            <TouchableOpacity
                className="bg-surface rounded-2xl p-4 mx-4 mb-8 flex-row items-center justify-center"
                onPress={handleSignOut}
                activeOpacity={0.7}
            >
                <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
                <Text className="text-danger text-base font-semibold ml-2">
                    Sign Out
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function MenuItem({
    icon,
    label,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            className="bg-surface rounded-xl p-4 mb-2 flex-row items-center"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons name={icon} size={20} color={Colors.accent} />
            <Text className="text-text-primary text-base ml-3 flex-1">{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
    );
}
