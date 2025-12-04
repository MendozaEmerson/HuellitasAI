import React from 'react';
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 1. IMPORTAR COMPONENTES REUTILIZABLES
import PhotosPlaceholder from '../../components/report/photosplaceholder';

// 2. IMPORTAR FUNCIONES Y HOOKS
import { useSightingViewModel } from '@/src/viewmodels/sightingviewmodel';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const COLORS = {
    primary: '#3b5998',
    secondary: '#ff8c00',
    background: '#f4f7f9',
    card: '#fff',
    text: '#333',
    placeholder: '#999',
    border: '#ddd',
    danger: '#ff4444',
    success: '#4caf50', // Verde para diferenciar Avistamiento
};

export default function CreateSightingScreen() {
    const {
        formData,
        isSubmitting,
        error,
        isLoadingLocation,
        handleChange,
        handleSubmitSighting,
        pickImage,
        handleLocationSelect,
        imageUri
    } = useSightingViewModel();

    // Claves tipadas para handleChange
    const descriptionKey = 'description' as keyof typeof formData;
    const locationKey = 'location_text' as keyof typeof formData;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header Verde para diferenciar */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reportar Avistamiento</Text>
                <Text style={styles.headerSubtitle}>¿Encontraste una mascota en la calle?</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* 1. SECCIÓN FOTOS */}
                <PhotosPlaceholder imageUri={imageUri} onUploadPress={pickImage} />

                {/* 2. UBICACIÓN Y HORA */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>¿Dónde y Cuándo?</Text>

                    <Text style={styles.label}>Ubicación del Avistamiento</Text>

                    {/* Input Híbrido: Texto Editable + Botón GPS */}
                    <View style={styles.locationContainer}>
                        <TextInput
                            style={styles.locationTextInput}
                            placeholder="Dirección o referencia (o usa el GPS ->)"
                            // Usamos .toString() por seguridad, aunque location_text ya es string
                            value={formData.location_text?.toString() || ''}
                            onChangeText={(text) => handleChange(locationKey, text)}
                            multiline
                        />

                        <TouchableOpacity
                            style={styles.gpsButton}
                            onPress={handleLocationSelect}
                            disabled={isLoadingLocation}
                        >
                            {isLoadingLocation ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <MaterialIcons name="my-location" size={24} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.helperText}>Toca el icono para obtener tu ubicación actual.</Text>

                    <Text style={[styles.label, { marginTop: 15 }]}>Fecha del Avistamiento</Text>
                    <View style={styles.dateInputDisplay}>
                        <FontAwesome name="calendar" size={18} color={COLORS.success} />
                        <Text style={styles.placeholderText}>
                            {formData.sighting_date.toLocaleString()} (Ahora)
                        </Text>
                    </View>
                </View>

                {/* 3. DESCRIPCIÓN */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalles Adicionales</Text>

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="¿Cómo se ve? ¿Está herido? ¿Tiene collar?"
                        multiline
                        numberOfLines={4}
                        value={formData.description}
                        onChangeText={(text) => handleChange(descriptionKey, text)}
                    />
                </View>

                {/* BOTÓN PUBLICAR */}
                {error && <Text style={styles.errorText}>Error: {error}</Text>}

                <TouchableOpacity
                    style={styles.publishButton}
                    onPress={handleSubmitSighting}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={COLORS.card} />
                    ) : (
                        <Text style={styles.publishText}>Publicar Avistamiento</Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 20 },
    header: {
        paddingTop: Platform.OS === 'android' ? 30 : 10,
        paddingBottom: 20,
        backgroundColor: COLORS.success,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        elevation: 8,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.card,
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    section: {
        backgroundColor: COLORS.card,
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.success,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },

    // Estilos de Ubicación Híbrida
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    locationTextInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: '#fff',
        height: 50,
    },
    gpsButton: {
        backgroundColor: COLORS.success,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    helperText: {
        fontSize: 12,
        color: COLORS.placeholder,
        marginBottom: 10,
    },

    dateInputDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    placeholderText: {
        color: COLORS.text,
        marginLeft: 10,
    },
    errorText: {
        color: COLORS.danger,
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    publishButton: {
        backgroundColor: COLORS.secondary,
        padding: 15,
        borderRadius: 50,
        marginHorizontal: 15,
        alignItems: 'center',
        marginTop: 10,
        elevation: 5,
    },
    publishText: {
        color: COLORS.card,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
