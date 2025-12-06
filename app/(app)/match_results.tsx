import { MatchResult } from '@/src/models/matchmodel';
import { useMatchViewModel } from '@/src/viewmodels/matchviewmodel';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const COLORS = {
    primary: '#3b5998',
    background: '#f8f9fa',
    card: '#fff',
    text: '#2c3e50',
    subtext: '#7f8c8d',
    success: '#4caf50', // Verde para alta coincidencia
    warning: '#ff9800'  // Naranja para media coincidencia
};

export default function MatchResultsScreen() {
    const router = useRouter();
    const { matches, isLoading, refreshing, error, onRefresh } = useMatchViewModel();

    const handleViewDetails = (match: MatchResult) => {
        // Aquí podrías navegar a un detalle específico si lo deseas
        // Por ahora, solo logueamos
        console.log("Ver detalle del match:", match.match_id);
        // router.push({ pathname: "/(app)/pet-details", params: { id: match.sighting_id } });
    };

    // --- Renderizado de Item Individual ---
    const renderMatchItem = ({ item }: { item: MatchResult }) => {
        // Convertir score 0-1 a porcentaje
        const percentage = Math.round(item.ai_distance_score * 100);
        const scoreColor = percentage > 80 ? COLORS.success : COLORS.warning;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => handleViewDetails(item)}
            >
                <Image
                    source={{ uri: item.sighting_image_url }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />

                {/* Badge de Similitud */}
                <View style={[styles.matchBadge, { backgroundColor: scoreColor }]}>
                    <Text style={styles.matchText}>
                        {percentage}% Similitud
                    </Text>
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.petName}>
                            {item.pet_name || 'Mascota detectada'}
                        </Text>
                        <Text style={styles.speciesText}>{item.species}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="location-on" size={16} color={COLORS.subtext} />
                        <Text style={styles.locationText} numberOfLines={1}>
                            {item.location_text || 'Ubicación desconocida'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="access-time" size={16} color={COLORS.subtext} />
                        <Text style={styles.dateText}>
                            Encontrado el: {new Date(item.sighting_date).toLocaleDateString()}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => handleViewDetails(item)}
                    >
                        <Text style={styles.contactButtonText}>Ver Detalles y Contactar</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    // --- Renderizado de Estado Vacío ---
    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="image-search" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>Buscando coincidencias...</Text>
            <Text style={styles.emptyText}>
                Nuestra IA está comparando tus reportes con los avistamientos recientes.
                {"\n\n"}
                Te notificaremos cuando encontremos una mascota similar a la tuya.
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                <Text style={styles.refreshButtonText}>Actualizar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Nativo */}
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Mis Coincidencias',
                    headerBackTitle: 'Atrás',
                }}
            />

            {isLoading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Analizando similitudes...</Text>
                </View>
            ) : matches.length === 0 ? (
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    <EmptyState />
                </ScrollView>
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.match_id}
                    renderItem={renderMatchItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16 },
    loadingText: { marginTop: 10, color: COLORS.subtext },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 20,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.subtext,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    refreshButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    refreshButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },

    // Card Styles
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    cardImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#eee',
    },
    matchBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 5,
    },
    matchText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    speciesText: {
        fontSize: 12,
        color: COLORS.subtext,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    locationText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 6,
        flex: 1,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.subtext,
        marginLeft: 6,
    },
    contactButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    contactButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
