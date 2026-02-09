import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TapTestBase from './TapTestBase';
import type { BradyStackParamList } from './TestMenu';
import { colors } from '../../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<BradyStackParamList, 'SingleTap'>;
};

export default function SingleTap({ navigation }: Props) {
  const onComplete = (severity: number) => {
    navigation.replace('Results', { severity, testType: 'Single-target tap' });
  };

  return (
    <TapTestBase testType="single" title="Single-target tap" onComplete={onComplete}>
      {({ running, taps, onTap }) => (
        <TouchableOpacity
          style={styles.bigButton}
          onPress={onTap}
          activeOpacity={0.9}
        >
          <Text style={styles.bigButtonText}>Tap</Text>
        </TouchableOpacity>
      )}
    </TapTestBase>
  );
}

const styles = StyleSheet.create({
  bigButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButtonText: { color: colors.white, fontSize: 24, fontWeight: '700' },
});
