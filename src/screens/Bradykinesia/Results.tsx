import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { useAppSelector } from '../../store/hooks';
import { Colors, ChartColors, severityColor } from '../../theme/colors';
import { severityLabel } from '../../utils/severity';
import SeverityDial from '../Home/SeverityDial';

const screenWidth = Dimensions.get('window').width;

const testTypeLabels: Record<string, string> = {
    single: 'Single-Target Tap',
    alternating: 'Alternating Tap',
    fine: 'Fine Motor Tap',
};

export default function ResultsScreen() {
    const navigation = useNavigation();
    const result = useAppSelector((s) => s.bradykinesia.lastResult);

    if (!result) {
        return (
            <View className="flex-1 bg-primary items-center justify-center">
                <Text className="text-text-secondary text-base">No results available</Text>
            </View>
        );
    }

    const segLabels = result.features.map((f) => f.rangeLabel);
    const segFrequencies = result.features.map((f) =>
        Math.round(f.tapFrequency * 10) / 10
    );

    return (
        <ScrollView className="flex-1 bg-primary" showsVerticalScrollIndicator={false}>
            {/* Test Type Header */}
            <View className="items-center pt-6 pb-2">
                <Text className="text-text-secondary text-sm">
                    {testTypeLabels[result.testType] || result.testType}
                </Text>
            </View>

            {/* Severity Dial */}
            <View className="bg-surface rounded-2xl p-6 mx-4 mb-4 items-center">
                <SeverityDial score={result.severity} size={180} />
                <Text
                    className="text-lg font-bold mt-2"
                    style={{ color: severityColor(result.severity) }}
                >
                    {severityLabel(result.severity)}
                </Text>
            </View>

            {/* Summary Stats */}
            <View className="bg-surface rounded-2xl p-4 mx-4 mb-4">
                <View className="flex-row justify-around">
                    <StatBox label="Total Taps" value={result.taps.toString()} />
                    <StatBox
                        label="Tap Rate"
                        value={`${(result.taps / 30).toFixed(1)}/s`}
                    />
                    <StatBox
                        label="Severity"
                        value={`${result.severity}/10`}
                        color={severityColor(result.severity)}
                    />
                </View>
            </View>

            {/* Segment Breakdown */}
            {segLabels.length > 0 && (
                <View className="bg-surface rounded-2xl p-4 mx-4 mb-4">
                    <Text className="text-text-primary text-base font-semibold mb-3">
                        Tap Frequency by Segment
                    </Text>
                    <BarChart
                        data={{
                            labels: segLabels,
                            datasets: [{ data: segFrequencies.map((f) => f || 0) }],
                        }}
                        width={screenWidth - 64}
                        height={180}
                        yAxisSuffix="/s"
                        yAxisLabel=""
                        chartConfig={{
                            ...ChartColors,
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            decimalPlaces: 1,
                            barPercentage: 0.6,
                        }}
                        fromZero
                        style={{ borderRadius: 12 }}
                    />
                    <Text className="text-text-secondary text-xs mt-2 text-center">
                        Declining frequency indicates fatigue
                    </Text>
                </View>
            )}

            {/* Done button */}
            <TouchableOpacity
                className="bg-accent rounded-xl py-3.5 mx-4 mb-8 items-center"
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <Text className="text-white text-base font-semibold">Done</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function StatBox({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color?: string;
}) {
    return (
        <View className="items-center">
            <Text className="text-text-secondary text-xs mb-1">{label}</Text>
            <Text
                className="text-xl font-bold"
                style={{ color: color || Colors.textPrimary }}
            >
                {value}
            </Text>
        </View>
    );
}
