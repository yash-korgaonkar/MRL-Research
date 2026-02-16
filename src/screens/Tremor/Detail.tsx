import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { TremorStackParamList } from '../../navigation/MainTabs';
import { Colors, severityColor } from '../../theme/colors';
import { formatDateTime, formatDuration } from '../../utils/time';
import SeverityDial from '../Home/SeverityDial';

type Route = RouteProp<TremorStackParamList, 'TremorDetail'>;

export default function TremorDetailScreen() {
    const route = useRoute<Route>();

    // In production, fetch from Firestore by eventId
    // For now, show placeholder data
    const event = {
        id: route.params.eventId,
        timestamp: Date.now() - 3600000,
        durationSec: 45,
        frequencyHz: 5.2,
        rms: 0.78,
        severity: 6,
        probability: 0.85,
    };

    return (
        <ScrollView className="flex-1 bg-primary px-4" showsVerticalScrollIndicator={false}>
            {/* Severity Dial */}
            <View className="bg-surface rounded-2xl p-6 items-center mt-4 mb-4">
                <SeverityDial score={event.severity} size={160} />
                <Text
                    className="text-base font-semibold mt-2"
                    style={{ color: severityColor(event.severity) }}
                >
                    {event.severity <= 3 ? 'Mild' : event.severity <= 6 ? 'Moderate' : 'Severe'}
                </Text>
            </View>

            {/* Details */}
            <View className="bg-surface rounded-2xl p-4 mb-4">
                <DetailRow label="Date & Time" value={formatDateTime(event.timestamp)} />
                <DetailRow label="Duration" value={formatDuration(event.durationSec)} />
                <DetailRow label="Frequency" value={`${event.frequencyHz.toFixed(1)} Hz`} />
                <DetailRow label="RMS Amplitude" value={event.rms.toFixed(3)} />
                <DetailRow
                    label="Detection Confidence"
                    value={`${(event.probability * 100).toFixed(0)}%`}
                    last
                />
            </View>
        </ScrollView>
    );
}

function DetailRow({
    label,
    value,
    last = false,
}: {
    label: string;
    value: string;
    last?: boolean;
}) {
    return (
        <View
            className={`flex-row justify-between py-3 ${last ? '' : 'border-b'
                }`}
            style={{ borderBottomColor: Colors.border }}
        >
            <Text className="text-text-secondary text-sm">{label}</Text>
            <Text className="text-text-primary text-sm font-semibold">{value}</Text>
        </View>
    );
}
