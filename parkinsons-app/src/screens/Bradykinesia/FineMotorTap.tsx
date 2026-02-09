import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TapTestBase from './TapTestBase';
import type { BradyStackParamList } from './TestMenu';
import { colors } from '../../theme/colors';

type Props = {
  navigation: NativeStackNavigationProp<BradyStackParamList, 'FineMotorTap'>;
};

export default function FineMotorTap({ navigation }: Props) {
  const onComplete = (severity: number) => {
    navigation.replace('Results', { severity, testType: 'Fine motor' });
  };

  return (
    <TapTestBase testType="fine" title="Fine motor" onComplete={onComplete}>
      {({ onTap }) => (
        <View style={styles.row}>
          <TouchableOpacity style={styles.smallButton} onPress={onTap} activeOpacity={0.9}>
            <Text style={styles.smallButtonText}>•</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={onTap} activeOpacity={0.9}>
            <Text style={styles.smallButtonText}>•</Text>
          </TouchableOpacity>
        </View>
      )}
    </TapTestBase>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 32 },
  smallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButtonText: { color: colors.white, fontSize: 28, fontWeight: '700' },
});
