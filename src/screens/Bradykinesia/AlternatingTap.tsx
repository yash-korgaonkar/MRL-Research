import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Haptics from 'expo-haptics';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { startTest, recordTap, finishTest, setLastResult } from '../../store/bradykinesiaSlice';
import { extractAllFeatures, computeBradykinesiaSeverity } from '../../utils/severity';
import { interTapIntervals } from '../../utils/stats';
import { saveBradykinesiaTest } from '../../services/bradykinesia.service';
import { BradykinesiaStackParamList } from '../../navigation/MainTabs';
import { Colors } from '../../theme/colors';

type Nav = StackNavigationProp<BradykinesiaStackParamList, 'AlternatingTap'>;
const TEST_DURATION = 30;
const COUNTDOWN_SECONDS = 3;

export default function AlternatingTapScreen() {
    const navigation = useNavigation<Nav>();
    const dispatch = useAppDispatch();
    const uid = useAppSelector((s) => s.auth.uid);
    const baseline = useAppSelector((s) => s.bradykinesia.baseline);

    const [phase, setPhase] = useState<'countdown' | 'active' | 'done'>('countdown');
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
    const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
    const [tapCount, setTapCount] = useState(0);
    const [lastSide, setLastSide] = useState<'left' | 'right' | null>(null);
    const timestampsRef = useRef<number[]>([]);

    useEffect(() => {
        if (phase !== 'countdown') return;
        if (countdown <= 0) {
            dispatch(startTest('alternating'));
            setPhase('active');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [phase, countdown]);

    useEffect(() => {
        if (phase !== 'active') return;
        if (timeLeft <= 0) {
            finishTestAndNavigate();
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [phase, timeLeft]);

    const handleTap = useCallback(
        (side: 'left' | 'right') => {
            if (phase !== 'active') return;
            const now = Date.now();
            timestampsRef.current.push(now);
            dispatch(recordTap({ timestamp: now, side }));
            setTapCount((c) => c + 1);
            setLastSide(side);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
        [phase, dispatch]
    );

    const finishTestAndNavigate = useCallback(async () => {
        setPhase('done');
        dispatch(finishTest());
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const timestamps = timestampsRef.current;
        const features = extractAllFeatures(timestamps);
        const itis = interTapIntervals(timestamps);
        const severity = computeBradykinesiaSeverity(
            features,
            baseline?.alternatingTap || null
        );

        const result = {
            userId: uid || 'unknown',
            timestamp: Date.now(),
            testType: 'alternating' as const,
            taps: timestamps.length,
            interTapIntervals: itis,
            features,
            severity,
        };

        dispatch(setLastResult(result));
        try {
            if (!__DEV__ && uid) await saveBradykinesiaTest(result);
        } catch (e) {
            console.warn('Failed to save test:', e);
        }

        navigation.replace('Results');
    }, [uid, baseline, dispatch, navigation]);

    return (
        <View className="flex-1 bg-primary">
            <StatusBar hidden />

            {phase === 'countdown' && (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-text-secondary text-lg mb-4">Get ready...</Text>
                    <Text className="text-accent font-bold" style={{ fontSize: 96 }}>
                        {countdown}
                    </Text>
                </View>
            )}

            {phase === 'active' && (
                <View className="flex-1">
                    <View className="pt-12 px-6 pb-4 flex-row justify-between items-center">
                        <Text className="text-text-secondary text-lg">
                            Taps: <Text className="text-text-primary font-bold">{tapCount}</Text>
                        </Text>
                        <Text
                            className="text-2xl font-bold"
                            style={{ color: timeLeft <= 5 ? Colors.danger : Colors.accent }}
                        >
                            {timeLeft}s
                        </Text>
                    </View>

                    <View className="flex-1 flex-row px-4 pb-8 gap-4">
                        {/* Left Button */}
                        <TouchableOpacity
                            className="flex-1 rounded-3xl items-center justify-center"
                            style={{
                                backgroundColor:
                                    lastSide === 'left'
                                        ? Colors.accent + '30'
                                        : Colors.accent + '10',
                                borderWidth: 2,
                                borderColor: Colors.accent + '40',
                            }}
                            onPress={() => handleTap('left')}
                            activeOpacity={0.6}
                        >
                            <Text className="text-accent text-xl font-bold">L</Text>
                        </TouchableOpacity>

                        {/* Right Button */}
                        <TouchableOpacity
                            className="flex-1 rounded-3xl items-center justify-center"
                            style={{
                                backgroundColor:
                                    lastSide === 'right'
                                        ? Colors.success + '30'
                                        : Colors.success + '10',
                                borderWidth: 2,
                                borderColor: Colors.success + '40',
                            }}
                            onPress={() => handleTap('right')}
                            activeOpacity={0.6}
                        >
                            <Text className="text-success text-xl font-bold">R</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-text-secondary text-sm text-center pb-4">
                        Alternate between left and right
                    </Text>
                </View>
            )}

            {phase === 'done' && (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-success text-2xl font-bold">Done!</Text>
                </View>
            )}
        </View>
    );
}
