import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatDateTime } from '../../utils/time';
import { severityLabel, severityColor } from '../../utils/severity';
import { colors } from '../../theme/colors';
import type { TremorStackParamList } from '../../navigation/TremorStack';

type Props = NativeStackScreenProps<TremorStackParamList, 'Detail'>;

export default function Detail({ route }: Props) {
  const { event } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.date}>{formatDateTime(event.timestamp)}</Text>
        <View style={[styles.badge, { backgroundColor: severityColor(event.severity) }]}>
          <Text style={styles.badgeText}>{severityLabel(event.severity)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Severity</Text>
          <Text style={styles.value}>{event.severity}/10</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{event.durationSec.toFixed(1)} seconds</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Frequency</Text>
          <Text style={styles.value}>{event.frequencyHz.toFixed(1)} Hz</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Probability</Text>
          <Text style={styles.value}>{(event.probability * 100).toFixed(0)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  date: { fontSize: 16, color: colors.textSecondary, marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 20,
  },
  badgeText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 15, color: colors.textSecondary },
  value: { fontSize: 15, fontWeight: '600', color: colors.text },
});
