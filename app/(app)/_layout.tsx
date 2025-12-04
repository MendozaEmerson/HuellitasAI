import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create_report"
        options={{
          title: 'Reporte',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create_avistamiento"
        options={{
          title: 'Avistamiento',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Usuario',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="settings.fill" color={color} />,
        }}
      />
      {/* Esta pantalla no es accesible */}
      <Tabs.Screen
        name="search-results"
        options={{
          href: null, // ← Esto la oculta de los tabs
          title: 'Resultados de Búsqueda',
        }}
      />
      {/* Nueva pantalla de detalles */}
      <Tabs.Screen
        name="pet-details"
        options={{
          href: null, // Oculta de los tabs
          title: 'Detalles',
        }}
      />
    </Tabs>
  );
}
