import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

type DataPoint = { time: number; severity: number };

type Props = {
  data: DataPoint[];
  width?: number;
  height?: number;
  label?: string;
};

export default function Sparkline({
  data,
  width = 280,
  height = 60,
  label = 'Last 24h',
}: Props) {
  if (data.length < 2) {
    return (
      <View style={[styles.wrap, { width, height }]}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No data yet</Text>
        </View>
      </View>
    );
  }

  const minY = 0;
  const maxY = 10;
  const padding = { top: 4, right: 4, bottom: 4, left: 4 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom - 18;

  const xScale = (i: number) =>
    padding.left + (i / (data.length - 1)) * chartWidth;
  const yScale = (v: number) =>
    padding.top + chartHeight - ((v - minY) / (maxY - minY)) * chartHeight;

  const d = data
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.severity)}`)
    .join(' ');

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Text style={styles.label}>{label}</Text>
      <Svg width={width} height={height - 18}>
        <Path
          d={d}
          fill="none"
          stroke={colors.primary}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 12 },
});
