import {Stack, useNavigation} from 'expo-router';
import React from 'react';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function AppLayout() {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
        </Stack>
    );
}
