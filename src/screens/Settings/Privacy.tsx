import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';

export default function PrivacyScreen() {
    return (
        <ScrollView className="flex-1 bg-primary px-4" showsVerticalScrollIndicator={false}>
            <View className="bg-surface rounded-2xl p-5 mt-4 mb-4">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
                    <Text className="text-text-primary text-lg font-semibold ml-2">
                        Your Data is Private
                    </Text>
                </View>

                <PrivacyItem
                    icon="lock-closed"
                    title="Encrypted Storage"
                    description="All data is stored in Firebase with encryption at rest and in transit."
                />
                <PrivacyItem
                    icon="person"
                    title="Personal Data Only"
                    description="Your health data is linked only to your account and is not shared with anyone."
                />
                <PrivacyItem
                    icon="eye-off"
                    title="No Tracking"
                    description="This app does not include any analytics, advertising, or third-party tracking."
                />
                <PrivacyItem
                    icon="cloud-upload"
                    title="Cloud Sync"
                    description="Data syncs to Firebase so you don't lose your history. You can request deletion at any time."
                />
                <PrivacyItem
                    icon="medkit"
                    title="Not Medical Advice"
                    description="This app is for personal tracking only and does not provide medical diagnoses or recommendations."
                />
            </View>
        </ScrollView>
    );
}

function PrivacyItem({
    icon,
    title,
    description,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
}) {
    return (
        <View className="flex-row mb-4">
            <View className="w-8 h-8 rounded-lg bg-surface-elevated items-center justify-center mr-3 mt-0.5">
                <Ionicons name={icon} size={16} color={Colors.accent} />
            </View>
            <View className="flex-1">
                <Text className="text-text-primary text-sm font-semibold">{title}</Text>
                <Text className="text-text-secondary text-xs mt-0.5">{description}</Text>
            </View>
        </View>
    );
}
