import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { subscribeLiveTremor, getLiveTremorState } from '../../services/tremor.service';
import { getTremorEvents } from '../../services/firebase.service';
import { startOfDay, ONE_DAY_MS } from '../../utils/time';
import LiveTremorCard from './LiveTremorCard';
import SeverityDial from './SeverityDial';
import Sparkline from './Sparkline';
import { colors } from '../../theme/colors';

export default function Dashboard() {
  const { user } = useAuth();
  const [state, setState] = useState(getLiveTremorState());
  const [sparklineData, setSparklineData] = useState<{ time: number; severity: number }[]>([]);

  useEffect(() => {
    const unsub = subscribeLiveTremor(setState);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const from = startOfDay(Date.now());
    const to = Date.now();
    getTremorEvents(user.uid, from, to, 100)
      .then((events) => {
        const points = events
          .map((e) => ({ time: e.timestamp, severity: e.severity }))
          .sort((a, b) => a.time - b.time);
        setSparklineData(points);
      })
      .catch(() => {});
  }, [user?.uid, state.lastUpdateTime]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Live tremor status</Text>

      <View style={styles.dialWrap}>
        <SeverityDial severity={state.severity} active={state.active} />
      </View>

      <LiveTremorCard
        active={state.active}
        severity={state.severity}
        frequencyHz={state.frequencyHz}
        lastTremorEndTime={state.lastTremorEndTime}
      />

      <View style={styles.sparkWrap}>
        <Sparkline data={sparklineData} label="Last 24h" width={320} height={80} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  dialWrap: { alignItems: 'center', marginBottom: 24 },
  sparkWrap: { marginTop: 24 },
});
