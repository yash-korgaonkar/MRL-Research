import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BradykinesiaStackParamList } from '../../navigation/MainTabs';
import { Colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type Nav = StackNavigationProp<BradykinesiaStackParamList, 'TestMenu'>;

const tests = [
    {
        key: 'SingleTap' as const,
        title: 'Single-Target Tap',
        description: 'Tap one large button as fast as you can. Measures speed and fatigue over 30 seconds.',
        icon: 'finger-print' as const,
        color: Colors.accent,
    },
    {
        key: 'AlternatingTap' as const,
        title: 'Alternating Tap',
        description: 'Alternate between two large buttons. Measures coordination and rhythm.',
        icon: 'swap-horizontal' as const,
        color: Colors.success,
    },
    {
        key: 'FineMotorTap' as const,
        title: 'Fine Motor Tap',
        description: 'Alternate between two small buttons. Measures precision under fatigue.',
        icon: 'contract' as const,
        color: Colors.warning,
    },
];

export default function TestMenuScreen() {
    const navigation = useNavigation<Nav>();

    return (
        <ScrollView className="flex-1 bg-primary px-4" showsVerticalScrollIndicator={false}>
            <Text className="text-text-secondary text-sm mt-4 mb-4">
                Each test runs for 30 seconds. Find a comfortable position and tap as quickly
                and accurately as you can.
            </Text>

            {tests.map((test) => (
                <TouchableOpacity
                    key={test.key}
                    className="bg-surface rounded-2xl p-5 mb-3"
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate(test.key)}
                >
                    <View className="flex-row items-center mb-2">
                        <View
                            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                            style={{ backgroundColor: test.color + '20' }}
                        >
                            <Ionicons name={test.icon} size={22} color={test.color} />
                        </View>
                        <Text className="text-text-primary text-lg font-semibold flex-1">
                            {test.title}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                    </View>
                    <Text className="text-text-secondary text-sm ml-13">
                        {test.description}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}
