import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signIn } from '../../services/firebase.service';
import { Colors } from '../../theme/colors';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type LoginNav = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
    const navigation = useNavigation<LoginNav>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await signIn(email.trim(), password);
        } catch (e: any) {
            setError(e.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-primary"
        >
            <View className="flex-1 justify-center px-8">
                {/* Logo / Title */}
                <View className="items-center mb-12">
                    <Text className="text-4xl font-bold text-accent mb-2">
                        TremorSync
                    </Text>
                    <Text className="text-text-secondary text-base">
                        Parkinson's Monitoring
                    </Text>
                </View>

                {/* Form */}
                <View className="bg-surface rounded-2xl p-6 mb-6">
                    <Text className="text-text-primary text-lg font-semibold mb-4">
                        Welcome back
                    </Text>

                    <TextInput
                        className="bg-surface-elevated rounded-xl px-4 py-3.5 text-text-primary text-base mb-3"
                        placeholder="Email"
                        placeholderTextColor={Colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TextInput
                        className="bg-surface-elevated rounded-xl px-4 py-3.5 text-text-primary text-base mb-4"
                        placeholder="Password"
                        placeholderTextColor={Colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {error ? (
                        <Text className="text-danger text-sm mb-3">{error}</Text>
                    ) : null}

                    <TouchableOpacity
                        className="bg-accent rounded-xl py-3.5 items-center"
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Signup link */}
                <TouchableOpacity
                    className="items-center"
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text className="text-text-secondary text-sm">
                        Don't have an account?{' '}
                        <Text className="text-accent font-semibold">Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
