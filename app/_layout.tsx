
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NativeBaseProvider } from 'native-base';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PackageProvider } from '@/context/PackageContext';
import { RouteProvider } from '@/context/RouteContext';
import { SimulationModeProvider } from '@/context/SimulationModeContext';
import { LogBox } from 'react-native';
SplashScreen.preventAutoHideAsync();

const AppLayout: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded && !isLoading) {
            SplashScreen.hideAsync();
        }
    }, [loaded, isLoading]);

    if (!loaded || isLoading) {
        return null;
    }

    LogBox.ignoreAllLogs()
    return (
        <NativeBaseProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(app)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            </ThemeProvider>
        </NativeBaseProvider>
    );
};

const RootLayout: React.FC = () => {
    return (
        <AuthProvider>
            <RouteProvider>
                <PackageProvider>
                    <SimulationModeProvider>
                        <AppLayout />
                    </SimulationModeProvider>
                </PackageProvider>
            </RouteProvider>
        </AuthProvider>
    );
};

export default RootLayout;
