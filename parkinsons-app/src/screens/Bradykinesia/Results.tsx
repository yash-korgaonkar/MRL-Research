import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { severityLabel, severityColor } from '../../utils/severity';
import type { BradyStackParamList } from './TestMenu';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<BradyStackParamList, 'Results'>;

export default function Results({ route, navigation }: Props) {
  const { severity, testType } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test complete</Text>
      <Text style={styles.subtitle}>{testType}</Text>
      <View style={[styles.badge, { backgroundColor: severityColor(severity) }]}>
        <Text style={styles.severityValue}>{severity}/10</Text>
        <Text style={styles.severityLabel}>{severityLabel(severity)}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TestMenu')}
      >
        <Text style={styles.buttonText}>Back to tests</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 32 },
  badge: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  severityValue: { fontSize: 36, fontWeight: '700', color: colors.white },
  severityLabel: { fontSize: 18, color: colors.white, marginTop: 4 },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
