import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';

const SIZE = 160;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;

type Props = {
  severity: number; // 0–10
  active?: boolean;
};

export default function SeverityDial({ severity, active }: Props) {
  const clamped = Math.min(10, Math.max(0, severity));
  const progress = clamped / 10;
  const dashOffset = 2 * Math.PI * R * (1 - progress);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={colors.surfaceElevated}
          strokeWidth={STROKE}
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={active ? colors.tremorActive : colors.tremorInactive}
          strokeWidth={STROKE}
          strokeDasharray={`${2 * Math.PI * R}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.labelWrap} pointerEvents="none">
        <Text style={styles.value}>{clamped}</Text>
        <Text style={styles.unit}>/ 10</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  svg: { transform: [{ rotate: '0deg' }] },
  labelWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 42, fontWeight: '700', color: colors.text },
  unit: { fontSize: 18, color: colors.textSecondary },
});
