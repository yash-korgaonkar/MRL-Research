import React from 'react';
import { View, Text } from 'react-native';
import { LiveTremorReading } from '../../models/TremorEvent';
import { Colors } from '../../theme/colors';

interface LiveTremorCardProps {
    reading: LiveTremorReading | null;
    isStreaming: boolean;
}

export default function LiveTremorCard({ reading, isStreaming }: LiveTremorCardProps) {
    const isTremor = reading?.tremor ?? false;

    return (
        <View
            className="rounded-2xl p-4 mb-4"
            style={{
                backgroundColor: isTremor ? Colors.dangerDim + '30' : Colors.surface,
                borderWidth: 1,
                borderColor: isTremor ? Colors.danger + '60' : Colors.border,
            }}
        >
            {/* Status Badge */}
            <View className="flex-row items-center mb-3">
                <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                        backgroundColor: !isStreaming
                            ? Colors.textMuted
                            : isTremor
                                ? Colors.danger
                                : Colors.success,
                    }}
                />
                <Text
                    className="text-base font-semibold"
                    style={{
                        color: !isStreaming
                            ? Colors.textMuted
                            : isTremor
                                ? Colors.danger
                                : Colors.success,
                    }}
                >
                    {!isStreaming
                        ? 'Not Connected'
                        : isTremor
                            ? 'Tremor Detected'
                            : 'No Tremor'}
                </Text>
            </View>

            {/* Metrics Row */}
            {reading && (
                <View className="flex-row justify-between">
                    <MetricItem
                        label="Frequency"
                        value={`${reading.freq.toFixed(1)} Hz`}
                        active={isTremor}
                    />
                    <MetricItem
                        label="RMS"
                        value={reading.rms.toFixed(2)}
                        active={isTremor}
                    />
                </View>
            )}
        </View>
    );
}

function MetricItem({
    label,
    value,
    active,
}: {
    label: string;
    value: string;
    active: boolean;
}) {
    return (
        <View className="items-center flex-1">
            <Text className="text-text-secondary text-xs mb-1">{label}</Text>
            <Text
                className="text-lg font-semibold"
                style={{ color: active ? Colors.textPrimary : Colors.textSecondary }}
            >
                {value}
            </Text>
        </View>
    );
}
