// src/services/notificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';
import { supabase } from './supabase';

// Configurar cómo se muestran las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, 
    shouldShowList: true, 
  }),
});

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
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
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
