import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Colors, ChartColors } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;
type Range = 'day' | 'week' | 'month';

function generateMockChartData(range: Range) {
    const points = range === 'day' ? 8 : range === 'week' ? 7 : 12;
    const labels =
        range === 'day'
            ? ['3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am']
            : range === 'week'
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
        severity: labels.map(() => Math.floor(1 + Math.random() * 8)),
        duration: labels.map(() => Math.floor(5 + Math.random() * 60)),
        labels: labels.slice(0, points),
    };
}

export default function TremorTrendsScreen() {
    const [range, setRange] = useState<Range>('week');
    const data = generateMockChartData(range);

    const chartConfig = {
        ...ChartColors,
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        decimalPlaces: 0,
        barPercentage: 0.6,
    };

    return (
        <ScrollView className="flex-1 bg-primary" showsVerticalScrollIndicator={false}>
            {/* Range Selector */}
            <View className="flex-row mx-4 mt-4 mb-4 bg-surface rounded-xl p-1">
                {(['day', 'week', 'month'] as Range[]).map((r) => (
                    <TouchableOpacity
                        key={r}
                        className={`flex-1 py-2 rounded-lg items-center ${range === r ? 'bg-accent' : ''
                            }`}
                        onPress={() => setRange(r)}
                    >
                        <Text
                            className={`text-sm font-semibold ${range === r ? 'text-white' : 'text-text-secondary'
                                }`}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Severity Over Time */}
            <View className="bg-surface rounded-2xl p-4 mx-4 mb-4">
                <Text className="text-text-primary text-base font-semibold mb-3">
                    Severity Over Time
                </Text>
                <LineChart
                    data={{
                        labels: data.labels,
                        datasets: [{ data: data.severity, strokeWidth: 2 }],
                    }}
                    width={screenWidth - 64}
                    height={200}
                    yAxisSuffix=""
                    yAxisInterval={2}
                    chartConfig={chartConfig}
                    bezier
                    style={{ borderRadius: 12 }}
                    fromZero
                />
            </View>

            {/* Tremor Duration Per Day */}
            <View className="bg-surface rounded-2xl p-4 mx-4 mb-8">
                <Text className="text-text-primary text-base font-semibold mb-3">
                    Tremor Duration (min)
                </Text>
                <BarChart
                    data={{
                        labels: data.labels,
                        datasets: [{ data: data.duration }],
                    }}
                    width={screenWidth - 64}
                    height={200}
                    yAxisSuffix="m"
                    yAxisLabel=""
                    chartConfig={{
                        ...chartConfig,
                        color: (opacity = 1) => `rgba(63, 185, 80, ${opacity})`,
                    }}
                    style={{ borderRadius: 12 }}
                    fromZero
                />
            </View>
        </ScrollView>
    );
}
