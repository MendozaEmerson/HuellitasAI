import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';

// PROYECTO EN SUPABASE
const supabaseUrl = 'https://pxwwquvpveobhvwunmik.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4d3dxdXZwdmVvYmh2d3VubWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc4ODIsImV4cCI6MjA3OTAyMzg4Mn0.cGCVe2PjKh9SZtzpV2LoKeb9pstXSGJADRweIp1j7OA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Configuración para que el token se refresque automáticamente
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});
