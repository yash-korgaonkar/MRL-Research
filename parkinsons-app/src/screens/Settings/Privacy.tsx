import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';

export default function Privacy() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy</Text>
      <Text style={styles.paragraph}>
        Your data is stored securely and privately. Only you can see your tremor events,
        test results, and trends.
      </Text>
      <Text style={styles.paragraph}>
        We do not share your data with clinicians or third parties. No medical
        interpretation is provided in this app.
      </Text>
      <Text style={styles.paragraph}>
        Tremor and bradykinesia data are stored in your account and can be deleted
        by signing out and requesting account deletion from the sign-in screen.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 },
  paragraph: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
});
