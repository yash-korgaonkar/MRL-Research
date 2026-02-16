import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signUp } from '../../services/firebase.service';
import { Colors } from '../../theme/colors';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type SignupNav = StackNavigationProp<AuthStackParamList, 'Signup'>;

export default function SignupScreen() {
    const navigation = useNavigation<SignupNav>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async () => {
        if (!email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await signUp(email.trim(), password);
        } catch (e: any) {
            setError(e.message || 'Signup failed');
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
                <View className="items-center mb-12">
                    <Text className="text-4xl font-bold text-accent mb-2">
                        TremorSync
                    </Text>
                    <Text className="text-text-secondary text-base">
                        Create your account
                    </Text>
                </View>

                <View className="bg-surface rounded-2xl p-6 mb-6">
                    <Text className="text-text-primary text-lg font-semibold mb-4">
                        Get started
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
                        className="bg-surface-elevated rounded-xl px-4 py-3.5 text-text-primary text-base mb-3"
                        placeholder="Password"
                        placeholderTextColor={Colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        className="bg-surface-elevated rounded-xl px-4 py-3.5 text-text-primary text-base mb-4"
                        placeholder="Confirm Password"
                        placeholderTextColor={Colors.textSecondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    {error ? (
                        <Text className="text-danger text-sm mb-3">{error}</Text>
                    ) : null}

                    <TouchableOpacity
                        className="bg-accent rounded-xl py-3.5 items-center"
                        onPress={handleSignup}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="items-center"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-text-secondary text-sm">
                        Already have an account?{' '}
                        <Text className="text-accent font-semibold">Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
