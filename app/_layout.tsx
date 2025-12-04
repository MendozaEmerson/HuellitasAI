import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

// 1. Importar el Proveedor y el Hook del ViewModel
import { AuthProvider, useAuthViewModel } from '@/src/viewmodels/authviewmodel';

// Importar servicio de notificaciones
import { 
  setupNotificationListeners,
  registerForPushNotificationsAsync  // ← NUEVA IMPORTACIÓN
} from '@/src/services/notificationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Inicializar listeners de notificaciones
  React.useEffect(() => {
    if (Constants.appOwnership === 'expo') {
      console.log('Expo Go detectado - Saltando configuración de notificaciones');
      return;
    }
    
    Notifications.setNotificationCategoryAsync('new_match', [
      {
        identifier: 'view_match',
        buttonTitle: 'Ver Match',
        options: { opensAppToForeground: true },
      },
    ]);

    const cleanup = setupNotificationListeners(
      (notification) => {
        // Notificación recibida (app abierta)
        console.log('📬 Nueva notificación:', notification.request.content.title);
      },
      (response) => {
        // Usuario tocó la notificación
        const data = response.notification.request.content.data as any;
        
        if (data?.type === 'new_match') {
          console.log('🔔 Match nuevo:', data.match_id);
          // TODO: Descomentar cuando la pantalla de matches esté implementada
          // const router = useRouter();
          // router.push(`/(app)/matches?id=${data.match_id}`);
        }
      }
    );

    return cleanup;
  }, []);

  return (
    // 2. Envolver TODA la aplicación con el AuthProvider
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigation />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Componente interno para manejar la navegación y el consumo del hook
function RootNavigation() {
  // 3. Consumir el ViewModel para obtener el estado
  const { isAuthenticated, isLoading } = useAuthViewModel();
  const router = useRouter();

  const segments = useSegments() as string[];

  React.useEffect(() => {
    // Solo actualizar si está autenticado y no está en Expo Go
    if (!isAuthenticated || isLoading) return;
    
    if (Constants.appOwnership === 'expo') {
      console.log('⚠️ Expo Go detectado - Saltando actualización de token');
      return;
    }

    // Actualizar token en background
    const updateTokenOnAppOpen = async () => {
      try {
        console.log('🔄 Actualizando token de notificaciones...');
        await registerForPushNotificationsAsync();
        console.log('✅ Token actualizado exitosamente');
      } catch (error) {
        console.error('❌ Error actualizando token:', error);
      }
    };

    updateTokenOnAppOpen();
  }, [isAuthenticated, isLoading]); // Se ejecuta cuando cambia el estado de autenticación

  // 4. Lógica de Redirección (El Guardián)
  React.useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!isAuthenticated && inAppGroup) {
      // CASO 1: No está logueado, pero intenta entrar a la App
      router.replace('/');
    } else if (isAuthenticated && (segments.length === 0 || inAuthGroup || segments[0] === 'index')) {
      // CASO 2: Ya está logueado, pero está en Login, Registro o Bienvenida
      router.replace('/(app)');
    }

  }, [isAuthenticated, isLoading, segments, router]);

  // 5. Mostrar pantalla de carga
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 6. Definir la estructura de navegación
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
