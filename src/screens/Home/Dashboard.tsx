import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateLiveReading } from '../../store/tremorSlice';
import { subscribeLiveTremor, mockTremorStream } from '../../services/tremor.service';
import { Colors, ChartColors } from '../../theme/colors';
import { timeSince } from '../../utils/time';
import SeverityDial from './SeverityDial';
import LiveTremorCard from './LiveTremorCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
    const dispatch = useAppDispatch();
    const { live, isStreaming, lastTremorTime } = useAppSelector((s) => s.tremor);
    const uid = useAppSelector((s) => s.auth.uid);
    const sparklineData = useRef<number[]>([0, 0, 0, 0, 0, 0, 0]).current;
    const [sparkline, setSparkline] = React.useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        if (uid) {
            // Use mock in dev, Firestore in prod
            const handler = (reading: any) => {
                dispatch(updateLiveReading(reading));
                // Update sparkline (rolling window of 7 severity readings)
                setSparkline((prev) => {
                    const next = [...prev.slice(1), reading.sev || 0];
                    return next;
                });
            };

            // Always try to subscribe to live data first
            unsubscribe = subscribeLiveTremor(uid, handler);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [uid, dispatch]);

    const severity = live?.sev ?? 0;

    return (
        <SafeAreaView className="flex-1 bg-primary" edges={['top']}>
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="pt-4 pb-2 flex-row justify-between items-start">
                    <View>
                        <Text className="text-2xl font-bold text-text-primary">Dashboard</Text>
                        <Text className="text-text-secondary text-sm mt-1">
                            Real-time tremor monitoring
                        </Text>
                    </View>
                    {live?.source && (
                        <View
                            className={`px-3 py-1 rounded-full ${live.source === 'live' ? 'bg-success/20' : 'bg-warning/20'
                                }`}
                        >
                            <Text
                                className={`text-xs font-bold ${live.source === 'live' ? 'text-success' : 'text-warning'
                                    }`}
                            >
                                {live.source === 'live' ? 'LIVE DATA' : 'DEMO MODE'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Severity Dial */}
                <View className="bg-surface rounded-2xl p-4 items-center mb-4">
                    <Text className="text-text-secondary text-sm mb-2 font-medium">
                        Current Severity
                    </Text>
                    <SeverityDial score={severity} size={180} />
                    <Text
                        className="text-sm font-semibold mt-2"
                        style={{
                            color:
                                severity <= 3
                                    ? Colors.success
                                    : severity <= 6
                                        ? Colors.warning
                                        : Colors.danger,
                        }}
                    >
                        {severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : 'Severe'}
                    </Text>
                </View>

                {/* Live Tremor Card */}
                <LiveTremorCard reading={live} isStreaming={isStreaming} />

                {/* Time Since Last Tremor */}
                <View className="bg-surface rounded-2xl p-4 flex-row justify-between items-center mb-4">
                    <Text className="text-text-secondary text-sm">Last Tremor</Text>
                    <Text className="text-text-primary text-base font-semibold">
                        {lastTremorTime ? timeSince(lastTremorTime) : 'None recorded'}
                    </Text>
                </View>

                {/* 24h Sparkline */}
                <View className="bg-surface rounded-2xl p-4 mb-8">
                    <Text className="text-text-secondary text-sm mb-3 font-medium">
                        Severity Trend
                    </Text>
                    <LineChart
                        data={{
                            labels: [],
                            datasets: [
                                {
                                    data: sparkline.length > 0 ? sparkline : [0],
                                    strokeWidth: 2,
                                },
                            ],
                        }}
                        width={screenWidth - 64}
                        height={120}
                        withDots={false}
                        withInnerLines={false}
                        withOuterLines={false}
                        withVerticalLabels={false}
                        withHorizontalLabels={false}
                        chartConfig={{
                            ...ChartColors,
                            backgroundGradientFromOpacity: 0,
                            backgroundGradientToOpacity: 0,
                            fillShadowGradientFrom: Colors.accent,
                            fillShadowGradientTo: Colors.accent,
                            fillShadowGradientFromOpacity: 0.3,
                            fillShadowGradientToOpacity: 0,
                        }}
                        bezier
                        style={{ marginLeft: -16 }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
