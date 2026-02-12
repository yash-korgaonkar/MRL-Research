import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../hooks/useAuth';
import { finishTest } from '../../services/bradykinesia.service';
import type { BradyTestType } from '../../models/BradykinesiaTest';
import { colors } from '../../theme/colors';

const DURATION_MS = 30 * 1000;

type Props = {
  testType: BradyTestType;
  title: string;
  onComplete: (severity: number) => void;
  children: (props: {
    countdown: number;
    running: boolean;
    taps: number;
    onTap: () => void;
    buttonStyle?: object;
  }) => React.ReactNode;
};

export default function TapTestBase({ testType, title, onComplete, children }: Props) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'running' | 'done'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [taps, setTaps] = useState(0);
  const [remainingSec, setRemainingSec] = useState(30);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const timestampsRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  timestampsRef.current = timestamps;

  const startCountdown = useCallback(() => {
    setPhase('countdown');
    setCountdown(3);
    setTaps(0);
    setTimestamps([]);
    timestampsRef.current = [];
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setPhase('running');
          startTimeRef.current = Date.now();
          setRemainingSec(30);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          const intervalRef = setInterval(() => {
            setRemainingSec((s) => {
              if (s <= 1) {
                clearInterval(intervalRef);
                return 0;
              }
              return s - 1;
            });
          }, 1000);
          timerRef.current = setTimeout(() => {
            clearInterval(intervalRef);
            setPhase('done');
            const ts = timestampsRef.current;
            if (user?.uid && ts.length >= 2) {
              finishTest(user.uid, testType, ts, startTimeRef.current, false)
                .then((r) => onComplete(r.severity))
                .catch(() => onComplete(0));
            } else {
              onComplete(0);
            }
          }, DURATION_MS);
          return 0;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        return c - 1;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, user?.uid, testType, onComplete]);

  const onTap = useCallback(() => {
    if (phase !== 'running') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const now = Date.now();
    setTimestamps((prev) => {
      const next = [...prev, now];
      timestampsRef.current = next;
      return next;
    });
    setTaps((n) => n + 1);
  }, [phase]);

  if (phase === 'idle') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>30 seconds. Tap when the test starts.</Text>
        <TouchableOpacity style={styles.startBtn} onPress={startCountdown}>
          <Text style={styles.startBtnText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'countdown') {
    return (
      <View style={styles.container}>
        <Text style={styles.countdown}>{countdown || 'Go!'}</Text>
      </View>
    );
  }

  if (phase === 'running') {
    return (
      <View style={styles.container}>
        <Text style={styles.timer}>{remainingSec}s</Text>
        <Text style={styles.tapCount}>{taps} taps</Text>
        {children({
          countdown: 0,
          running: true,
          taps,
          onTap,
        })}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 32 },
  startBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startBtnText: { color: colors.white, fontSize: 18, fontWeight: '600' },
  countdown: { fontSize: 72, fontWeight: '700', color: colors.primary },
  timer: { fontSize: 24, color: colors.textSecondary, marginBottom: 8 },
  tapCount: { fontSize: 18, color: colors.text, marginBottom: 24 },
});
