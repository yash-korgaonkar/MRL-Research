import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { getTremorEvents } from '../../services/firebase.service';
import { startOfDay, ONE_DAY_MS } from '../../utils/time';
import Sparkline from '../Home/Sparkline';
import { colors } from '../../theme/colors';

const DAYS = 14;

export default function Trends() {
  const { user } = useAuth();
  const [dailySeverity, setDailySeverity] = useState<{ time: number; severity: number }[]>([]);
  const [dailyDuration, setDailyDuration] = useState<{ time: number; duration: number }[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const end = Date.now();
    const start = end - DAYS * ONE_DAY_MS;
    getTremorEvents(user.uid, start, end, 500).then((events) => {
      const byDay = new Map<number, { severity: number[]; duration: number }>();
      for (let d = 0; d < DAYS; d++) {
        const t = startOfDay(end - d * ONE_DAY_MS);
        byDay.set(t, { severity: [], duration: 0 });
      }
      events.forEach((e) => {
        const day = startOfDay(e.timestamp);
        if (byDay.has(day)) {
          const cur = byDay.get(day)!;
          cur.severity.push(e.severity);
          cur.duration += e.durationSec;
          byDay.set(day, cur);
        }
      });
      const severityPoints: { time: number; severity: number }[] = [];
      const durationPoints: { time: number; duration: number }[] = [];
      byDay.forEach((v, time) => {
        const avgSev = v.severity.length ? v.severity.reduce((a, b) => a + b, 0) / v.severity.length : 0;
        severityPoints.push({ time, severity: avgSev });
        durationPoints.push({ time, duration: v.duration });
      });
      severityPoints.sort((a, b) => a.time - b.time);
      durationPoints.sort((a, b) => a.time - b.time);
      setDailySeverity(severityPoints);
      setDailyDuration(durationPoints);
    }).catch(() => {});
  }, [user?.uid]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Trends</Text>
      <Text style={styles.subtitle}>Severity and duration over time</Text>

      <View style={styles.chart}>
        <Text style={styles.chartLabel}>Average severity (last 14 days)</Text>
        <Sparkline data={dailySeverity} label="" width={320} height={120} />
      </View>
      <View style={styles.chart}>
        <Text style={styles.chartLabel}>Total tremor duration per day (seconds)</Text>
        {dailyDuration.length >= 2 ? (
          <Sparkline
            data={dailyDuration.map((p) => ({ time: p.time, severity: p.duration }))}
            label=""
            width={320}
            height={120}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No data yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  chart: { marginBottom: 24 },
  chartLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  empty: { height: 120, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textMuted },
});
