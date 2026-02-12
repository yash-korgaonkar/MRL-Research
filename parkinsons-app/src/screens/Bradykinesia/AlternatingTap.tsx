import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TapTestBase from './TapTestBase';
import type { BradyStackParamList } from './TestMenu';
import { colors } from '../../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<BradyStackParamList, 'AlternatingTap'>;
};

export default function AlternatingTap({ navigation }: Props) {
  const onComplete = (severity: number) => {
    navigation.replace('Results', { severity, testType: 'Alternating tap' });
  };

  return (
    <TapTestBase testType="alternating" title="Alternating tap" onComplete={onComplete}>
      {({ running, onTap }) => (
        <View style={styles.row}>
          <TouchableOpacity style={styles.bigButton} onPress={onTap} activeOpacity={0.9}>
            <Text style={styles.bigButtonText}>L</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bigButton} onPress={onTap} activeOpacity={0.9}>
            <Text style={styles.bigButtonText}>R</Text>
          </TouchableOpacity>
        </View>
      )}
    </TapTestBase>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 24 },
  bigButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButtonText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
