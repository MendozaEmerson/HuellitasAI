import { AuthViewModel } from '@/src/models/authmodel';
import { supabase } from '@/src/services/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import api from '@/src/services/api';
import { registerForPushNotificationsAsync } from '@/src/services/notificationService';

const AuthContext = createContext<AuthViewModel | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // 1. Verificar sesión guardada al arrancar
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setIsAuthenticated(!!session);
                
                // Si hay sesión, registrar notificaciones
                if (session) {
                    registerForPushNotificationsAsync();
                }
            } catch (error) {
                console.error("Error verificando sesión:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // 2. Escuchar cambios en tiempo real (Login, Logout, Expiración)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsAuthenticated(!!session);
            setIsLoading(false);
            
            // Registrar notificaciones cuando usuario inicia sesión
            if (session) {
                registerForPushNotificationsAsync();
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
        // onAuthStateChange registrará notificaciones automáticamente
    };

    // --- Registro (Nuevo) ---
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

        // ⭐ NUEVO: Sincronizar con backend
        try {
            const response = await api.post('/auth/sync', {
                user_id: data.user!.id,
                email: data.user!.email,
                full_name: email.split('@')[0], // Temporal: usar parte del email
            });
            console.log('✅ Usuario sincronizado con backend:', response.data);
        } catch (backendError) {
            console.error('⚠️ Error sincronizando con backend:', backendError);
            // No falla el registro, solo log del error
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
