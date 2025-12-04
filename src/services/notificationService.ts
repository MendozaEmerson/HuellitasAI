// src/services/notificationService.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from './api';
import { supabase } from './supabase';

// Configurar cómo se muestran las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Solicitar permisos de notificaciones al usuario
 */
export async function requestNotificationPermissionsAsync(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      console.log('✅ Permisos de notificaciones ya otorgados');
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status === 'granted') {
      console.log('✅ Permisos de notificaciones otorgados');
      return true;
    } else {
      console.warn('⚠️ Permisos de notificaciones denegados');
      return false;
    }
  } catch (error) {
    console.error('❌ Error solicitando permisos:', error);
    return false;
  }
}

/**
 * Registrar dispositivo para notificaciones y guardar token en backend
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E6F4FE',
    });
  }

  if (Device.isDevice) {
    // Solicitar permisos si no los tiene
    const hasPermission = await requestNotificationPermissionsAsync();
    
    if (!hasPermission) {
      console.warn('⚠️ Permisos de notificaciones no otorgados');
      return null;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('✅ Expo Push Token:', token);

      // Guardar token en backend
      await saveTokenToBackend(token);

    } catch (error) {
      console.error('❌ Error obteniendo Expo token:', error);
    }
  } else {
    console.warn('⚠️ Las notificaciones push solo funcionan en dispositivos físicos');
  }

  return token;
}

/**
 * Guardar token en el backend
 */
async function saveTokenToBackend(token: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('⚠️ No hay usuario autenticado');
      return;
    }

    await api.put(`/users/${user.id}`, {
      push_notification_token: token,
    });

    console.log('✅ Token guardado en backend');
  } catch (error) {
    console.error('❌ Error guardando token en backend:', error);
  }
}

/**
 * Enviar notificación de prueba (para desarrollo)
 */
export async function sendTestNotificationAsync(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Match encontrado!",
        body: "Tienes un nuevo match con Firulais",
        data: { type: 'new_match', match_id: '123' }
      },
      trigger: {
        seconds: 2,
        repeats: false,
      } as any
    });
    console.log("✅ Notificación de prueba programada");
  } catch (error) {
    console.error("❌ Error programando notificación de prueba:", error);
  }
}

/**
 * Configurar listeners de notificaciones
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) {
  // Listener: Notificación recibida (app en foreground)
  const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
    console.log('📬 Notificación recibida:', notification.request.content);
    onNotificationReceived?.(notification);
  });

  // Listener: Usuario toca la notificación
  const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('👆 Notificación tocada:', response);
    onNotificationTapped?.(response);
  });

  return () => {
    receivedListener.remove();
    responseListener.remove();
  };
}
