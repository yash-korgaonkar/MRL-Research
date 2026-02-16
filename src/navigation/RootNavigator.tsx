import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { subscribeToAuthChanges } from '../services/firebase.service';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser, setLoading } from '../store/authSlice';
import AuthNavigator from './AuthNavigator';
import MainTabs from './MainTabs';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../theme/colors';

const customDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: Colors.background,
        card: Colors.surface,
        text: Colors.textPrimary,
        border: Colors.border,
        primary: Colors.accent,
        notification: Colors.danger,
    },
};

export default function RootNavigator() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading } = useAppSelector((s) => s.auth);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((user) => {
            if (user) {
                dispatch(setUser({ uid: user.uid, email: user.email || '' }));
            } else {
                dispatch(clearUser());
            }
        });
        return unsubscribe;
    }, [dispatch]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-primary">
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    return (
        <NavigationContainer theme={customDarkTheme}>
            {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
