import { AuthViewModel } from '@/src/models/authmodel';
import api from '@/src/services/api';
import { supabase } from '@/src/services/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
// Importamos registerForPushNotificationsAsync pero la usaremos con cuidado
import { registerForPushNotificationsAsync } from '@/src/services/notificationService';
import Constants from 'expo-constants'; // Necesario para detectar Expo Go

const AuthContext = createContext<AuthViewModel | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    // Función auxiliar segura para registrar notificaciones
    const safeRegisterNotifications = async () => {
        try {
            // Verificamos si estamos en Expo Go para evitar el crash
            const isExpoGo = Constants.appOwnership === 'expo';
            if (isExpoGo) {
                console.log("⚠️ Expo Go detectado: Saltando registro de Push Notifications para evitar crash.");
                return;
            }

            await registerForPushNotificationsAsync();
        } catch (e) {
            console.log("⚠️ Error no crítico al registrar notificaciones (probablemente en Expo Go):", e);
        }
    };

    useEffect(() => {
        // 1. Verificar sesión guardada al arrancar
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setIsAuthenticated(!!session);

                if (session) {
                    safeRegisterNotifications();
                }
            } catch (error) {
                console.error("Error verificando sesión:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // 2. Escuchar cambios en tiempo real
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsAuthenticated(!!session);
            setIsLoading(false);

            if (session) {
                safeRegisterNotifications();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // --- Login ---
    const signIn = async (email: string, pass: string) => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });

        if (error) {
            Alert.alert("Error al iniciar sesión", error.message);
            setIsLoading(false);
        }
    };

    // --- Registro ---
    const signUp = async (email: string, pass: string): Promise<boolean> => {
        setIsLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password: pass,
        });

        if (error) {
            Alert.alert("Error en el registro", error.message);
            setIsLoading(false);
            return false;
        }

        // Sincronizar con backend
        try {
            if (data.user) {
                await api.post('/auth/sync', {
                    user_id: data.user.id,
                    email: data.user.email,
                    full_name: email.split('@')[0],
                });
                console.log('✅ Usuario sincronizado con backend');
            }
        } catch (backendError) {
            console.error('⚠️ Error sincronizando con backend:', backendError);
        }

        Alert.alert("Registro Exitoso", "¡Cuenta creada!");
        setIsLoading(false);
        return true;
    };

    // --- Cerrar Sesión ---
    const signOut = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
        setIsLoading(false);
    };

    const value: AuthViewModel = {
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthViewModel() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthViewModel debe ser usado dentro de un AuthProvider');
    }
    return context;
}
