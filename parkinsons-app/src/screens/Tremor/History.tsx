import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { getTremorEvents } from '../../services/firebase.service';
import { formatDateTime } from '../../utils/time';
import { severityLabel } from '../../utils/severity';
import { colors } from '../../theme/colors';
import type { TremorEvent } from '../../models/TremorEvent';
import type { TremorStackParamList } from '../../navigation/TremorStack';
import { startOfDay, startOfWeek, startOfMonth } from '../../utils/time';

type Range = 'day' | 'week' | 'month';

type Props = { navigation: NativeStackNavigationProp<TremorStackParamList, 'History'> };

export default function History({ navigation }: Props) {
  const { user } = useAuth();
  const [range, setRange] = useState<Range>('week');
  const [events, setEvents] = useState<TremorEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Trends')} style={{ marginRight: 16 }}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>Trends</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const now = Date.now();
    const from =
      range === 'day'
        ? startOfDay(now)
        : range === 'week'
          ? startOfWeek(now)
          : startOfMonth(now);
    const to = now;
    getTremorEvents(user.uid, from, to)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [user?.uid, range]);

  const renderItem = ({ item }: { item: TremorEvent }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { event: item })}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <Text style={styles.date}>{formatDateTime(item.timestamp)}</Text>
        <View style={[styles.badge, item.severity > 6 && styles.badgeHigh]}>
          <Text style={styles.badgeText}>{severityLabel(item.severity)}</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <Text style={styles.stat}>Severity: {item.severity}/10</Text>
        <Text style={styles.stat}>Duration: {item.durationSec.toFixed(1)}s</Text>
        <Text style={styles.stat}>{item.frequencyHz.toFixed(1)} Hz</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['day', 'week', 'month'] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.tab, range === r && styles.tabActive]}
            onPress={() => setRange(r)}
          >
            <Text style={[styles.tabText, range === r && styles.tabTextActive]}>
              {r === 'day' ? 'Daily' : r === 'week' ? 'Weekly' : 'Monthly'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>Loading…</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.muted}>No tremor events in this period</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabs: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: colors.white, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { fontSize: 14, color: colors.text },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
  },
  badgeHigh: { backgroundColor: colors.warning },
  badgeText: { fontSize: 12, color: colors.text, fontWeight: '500' },
  stats: { flexDirection: 'row', gap: 16 },
  stat: { fontSize: 13, color: colors.textSecondary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  muted: { color: colors.textMuted, fontSize: 16 },
});
