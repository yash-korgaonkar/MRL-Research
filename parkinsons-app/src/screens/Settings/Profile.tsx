import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/firebase.service';
import type { SettingsStackParamList } from '../../navigation/SettingsStack';
import { colors } from '../../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<SettingsStackParamList, 'Profile'>;
};

export default function Profile({ navigation }: Props) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
      </View>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('DevicePairing')}
      >
        <Text style={styles.linkText}>Device pairing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Privacy')}
      >
        <Text style={styles.linkText}>Privacy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 24 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  label: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  value: { fontSize: 16, color: colors.text },
  link: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  linkText: { fontSize: 16, color: colors.primary, fontWeight: '500' },
  signOut: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
  },
  signOutText: { color: colors.tremorActive, fontSize: 16, fontWeight: '600' },
});
