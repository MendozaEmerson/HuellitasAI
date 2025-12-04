import { Stack } from 'expo-router';

export default function AuthLayout() {
    // Este stack agrupa las pantallas de login y registro
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    );
}
