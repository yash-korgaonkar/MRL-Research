import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { Colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function DevicePairingScreen() {
    const isStreaming = useAppSelector((s) => s.tremor.isStreaming);

    return (
        <ScrollView className="flex-1 bg-primary px-4" showsVerticalScrollIndicator={false}>
            {/* Connection Status */}
            <View className="bg-surface rounded-2xl p-5 mt-4 mb-4 items-center">
                <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{
                        backgroundColor: isStreaming ? Colors.success + '20' : Colors.textMuted + '20',
                    }}
                >
                    <Ionicons
                        name={isStreaming ? 'cloud-done' : 'cloud-offline'}
                        size={28}
                        color={isStreaming ? Colors.success : Colors.textMuted}
                    />
                </View>
                <Text
                    className="text-lg font-semibold"
                    style={{ color: isStreaming ? Colors.success : Colors.textSecondary }}
                >
                    {isStreaming ? 'Connected' : 'Not Connected'}
                </Text>
                <Text className="text-text-secondary text-sm mt-1 text-center">
                    {isStreaming
                        ? 'Receiving live tremor data via Firestore'
                        : 'Waiting for data from your monitoring device'}
                </Text>
            </View>

            {/* How It Works */}
            <View className="bg-surface rounded-2xl p-4 mb-4">
                <Text className="text-text-primary text-base font-semibold mb-3">
                    How It Works
                </Text>

                <StepItem
                    number={1}
                    title="Pi Sensor Active"
                    description="Your Raspberry Pi collects accelerometer data and detects tremors."
                />
                <StepItem
                    number={2}
                    title="Data Sent to Cloud"
                    description="Tremor readings are written to Firebase Firestore in real-time."
                />
                <StepItem
                    number={3}
                    title="App Updates Live"
                    description="This app listens for changes and updates the dashboard instantly."
                />
            </View>

            {/* Info */}
            <View className="bg-surface rounded-2xl p-4 mb-8">
                <Text className="text-text-secondary text-sm">
                    In development mode, the app uses simulated tremor data. Connect your
                    Raspberry Pi and configure Firebase to see real sensor data.
                </Text>
            </View>
        </ScrollView>
    );
}

function StepItem({
    number,
    title,
    description,
}: {
    number: number;
    title: string;
    description: string;
}) {
    return (
        <View className="flex-row mb-3">
            <View className="w-7 h-7 rounded-full bg-accent items-center justify-center mr-3 mt-0.5">
                <Text className="text-white text-xs font-bold">{number}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-text-primary text-sm font-semibold">{title}</Text>
                <Text className="text-text-secondary text-xs mt-0.5">{description}</Text>
            </View>
        </View>
    );
}
