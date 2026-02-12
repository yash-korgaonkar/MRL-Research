import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';

export type BradyStackParamList = {
  TestMenu: undefined;
  SingleTap: undefined;
  AlternatingTap: undefined;
  FineMotorTap: undefined;
  Results: { severity: number; testType: string };
};

type Props = {
  navigation: NativeStackNavigationProp<BradyStackParamList, 'TestMenu'>;
};

const TESTS = [
  { key: 'SingleTap' as const, title: 'Single-target tap', desc: 'One large button — speed & fatigue' },
  { key: 'AlternatingTap' as const, title: 'Alternating tap', desc: 'Two large buttons — coordination & rhythm' },
  { key: 'FineMotorTap' as const, title: 'Fine motor', desc: 'Two small buttons — precision' },
];

export default function TestMenu({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bradykinesia tests</Text>
      <Text style={styles.subtitle}>30 seconds each. Fullscreen, distraction-free.</Text>

      {TESTS.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={styles.card}
          onPress={() => navigation.navigate(t.key)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>{t.title}</Text>
          <Text style={styles.cardDesc}>{t.desc}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 24 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: colors.textSecondary },
});
