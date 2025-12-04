import { useAuthViewModel } from '@/src/viewmodels/authviewmodel';
import { supabase } from '@/src/services/supabase';
import React, { useState, useEffect } from 'react';
import { 
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet, 
    Text, 
    TouchableOpacity,
    View 
} from 'react-native';

interface UserProfile {
    user_id: string;
    email: string;
    full_name: string;
    phone_number: string;
    created_at: string;
}

export default function ProfileTab() {
    const { signOut } = useAuthViewModel();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [myReportsCount, setMyReportsCount] = useState(0);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                setProfile({
                    user_id: user.id,
                    email: user.email || 'Sin email',
                    full_name: user.user_metadata?.full_name || 'Usuario',
                    phone_number: user.user_metadata?.phone_number || user.phone || 'Sin teléfono',
                    created_at: user.created_at,
                });
            }
        } catch (error) {
            console.error('Error cargando perfil:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

        if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
                <TouchableOpacity onPress={loadProfile} style={styles.retryButton}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Image 
                        source={require('@/assets/images/Logo.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{profile.full_name}</Text>
                    <Text style={styles.email}>{profile.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>📧 Email</Text>
                        <Text style={styles.infoValue}>{profile.email}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>📱 Teléfono</Text>
                        <Text style={styles.infoValue}>{profile.phone_number}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>📅 Miembro desde</Text>
                        <Text style={styles.infoValue}>
                            {new Date(profile.created_at).toLocaleDateString('es-ES')}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#c62828',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#3b5998',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#555',
    },
    infoValue: {
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '600',
    },
    actionButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 12,
    },
    logoutText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});