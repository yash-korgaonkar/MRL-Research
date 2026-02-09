import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { timeSince } from '../../utils/time';

type Props = {
  active: boolean;
  severity: number;
  frequencyHz: number;
  lastTremorEndTime: number | null;
};

export default function LiveTremorCard({
  active,
  severity,
  frequencyHz,
  lastTremorEndTime,
}: Props) {
  return (
    <View style={[styles.card, active && styles.cardActive]}>
      <View style={styles.row}>
        <View style={[styles.dot, active && styles.dotActive]} />
        <Text style={styles.status}>{active ? 'Tremor detected' : 'No tremor'}</Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Severity</Text>
          <Text style={[styles.statValue, active && styles.statValueActive]}>{severity}/10</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Frequency</Text>
          <Text style={styles.statValue}>{frequencyHz.toFixed(1)} Hz</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Last tremor</Text>
          <Text style={styles.statValue}>
            {lastTremorEndTime ? timeSince(lastTremorEndTime) : '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardActive: { borderColor: colors.tremorActive },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.tremorInactive,
    marginRight: 10,
  },
  dotActive: { backgroundColor: colors.tremorActive },
  status: { fontSize: 18, fontWeight: '600', color: colors.text },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '600', color: colors.text },
  statValueActive: { color: colors.tremorActive },
});
