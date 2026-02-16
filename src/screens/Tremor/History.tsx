import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TremorStackParamList } from '../../navigation/MainTabs';
import { useAppSelector } from '../../store/hooks';
import { TremorEvent } from '../../models/TremorEvent';
import { getRecentTremorEvents } from '../../services/tremor.service';
import { Colors, severityColor } from '../../theme/colors';
import { formatDateTime, formatDuration } from '../../utils/time';
import { Ionicons } from '@expo/vector-icons';

type Nav = StackNavigationProp<TremorStackParamList, 'TremorHistory'>;

// Generate sample data for development
function generateMockHistory(): TremorEvent[] {
    const events: TremorEvent[] = [];
    const now = Date.now();
    for (let i = 0; i < 20; i++) {
        events.push({
            id: `mock-${i}`,
            userId: 'mock',
            timestamp: now - i * 3600000 * (1 + Math.random() * 3),
            durationSec: 10 + Math.random() * 120,
            frequencyHz: 3 + Math.random() * 5,
            rms: 0.3 + Math.random() * 0.7,
            severity: Math.floor(1 + Math.random() * 9),
            probability: 0.6 + Math.random() * 0.4,
        });
    }
    return events.sort((a, b) => b.timestamp - a.timestamp);
}

export default function TremorHistoryScreen() {
    const navigation = useNavigation<Nav>();
    const uid = useAppSelector((s) => s.auth.uid);
    const [events, setEvents] = useState<TremorEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, [uid]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            if (__DEV__) {
                setEvents(generateMockHistory());
            } else if (uid) {
                const data = await getRecentTremorEvents(uid, 50);
                setEvents(data);
            }
        } catch (e) {
            console.warn('Failed to load tremor history:', e);
            if (__DEV__) setEvents(generateMockHistory());
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: TremorEvent }) => (
        <TouchableOpacity
            className="bg-surface rounded-2xl p-4 mb-3"
            activeOpacity={0.7}
            onPress={() =>
                navigation.navigate('TremorDetail', { eventId: item.id || '' })
            }
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className="text-text-primary text-base font-semibold">
                        {formatDateTime(item.timestamp)}
                    </Text>
                    <Text className="text-text-secondary text-sm mt-1">
                        Duration: {formatDuration(item.durationSec)}
                    </Text>
                </View>
                <View
                    className="rounded-full px-3 py-1"
                    style={{ backgroundColor: severityColor(item.severity) + '25' }}
                >
                    <Text
                        className="text-sm font-bold"
                        style={{ color: severityColor(item.severity) }}
                    >
                        {item.severity}/10
                    </Text>
                </View>
            </View>

            <View className="flex-row mt-1">
                <Text className="text-text-secondary text-xs mr-4">
                    {item.frequencyHz.toFixed(1)} Hz
                </Text>
                <Text className="text-text-secondary text-xs">
                    RMS {item.rms.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-primary">
            {/* Trends button */}
            <TouchableOpacity
                className="flex-row items-center bg-surface mx-4 mt-3 mb-2 rounded-xl p-3"
                onPress={() => navigation.navigate('TremorTrends')}
                activeOpacity={0.7}
            >
                <Ionicons name="trending-up" size={20} color={Colors.accent} />
                <Text className="text-accent text-sm font-semibold ml-2 flex-1">
                    View Trends & Charts
                </Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id || item.timestamp.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Ionicons name="pulse-outline" size={48} color={Colors.textMuted} />
                        <Text className="text-text-secondary text-base mt-4">
                            No tremor events recorded
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
