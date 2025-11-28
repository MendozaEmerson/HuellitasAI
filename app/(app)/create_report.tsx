import React from 'react';
import {
    ActivityIndicator // Necesario para el loading del GPS
    ,

    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 1. IMPORTAR COMPONENTES HIJOS
import PhotosPlaceholder from '../../components/report/photosplaceholder';
import ReportTypeSelector from '../../components/report/reporttypeselector';

// 2. IMPORTAR FUNCIONES Y HOOKS
import { useReportViewModel } from '@/src/viewmodels/reportviewmodel';
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
};


export default function CreateReportTab() {
    const {
        formData,
        isSubmitting,
        error,
        isLoadingLocation, // Traemos el estado de carga
        setReportType,
        handleChange,
        handleSubmitReport,
        pickImage,
        handleLocationSelect,
        imageUri
    } = useReportViewModel();

    const petNameKey = 'pet_name' as keyof typeof formData;
    const speciesKey = 'species' as keyof typeof formData;
    const breedKey = 'breed' as keyof typeof formData;
    const descriptionKey = 'description' as keyof typeof formData;
    const contactKey = 'contactInfo' as keyof typeof formData;
    // Clave para la ubicación
    const locationKey = 'last_seen_location_text' as keyof typeof formData;


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reporta una Mascota</Text>
                <ReportTypeSelector
                    reportType={formData.reportType}
                    setReportType={setReportType}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* FOTOS */}
                <PhotosPlaceholder imageUri={imageUri} onUploadPress={pickImage} />

                {/* DETALLES */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalles de la Mascota</Text>

                    <Text style={styles.label}>Nombre de la Mascota</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce el nombre (si lo conoces)"
                        value={formData[petNameKey].toString()}
                        onChangeText={(text) => handleChange(petNameKey, text)}
                    />

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.label}>Tipo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Perro, Gato"
                                value={formData[speciesKey].toString()}
                                onChangeText={(text) => handleChange(speciesKey, text)}
                            />
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.label}>Raza</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: Golden Retriever"
                                value={formData[breedKey].toString()}
                                onChangeText={(text) => handleChange(breedKey, text)}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="¿Marcas distintivas? ¿Llevaba collar?"
                        multiline
                        numberOfLines={4}
                        value={formData.description}
                        onChangeText={(text) => handleChange(descriptionKey, text)}
                    />

                    <Text style={styles.label}>Contacto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tu número o correo"
                        value={formData.contactInfo}
                        onChangeText={(text) => handleChange(contactKey, text)}
                    />
                </View>

                {/* UBICACIÓN Y HORA (SECCIÓN MODIFICADA) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ubicación y Hora</Text>

                    <Text style={styles.label}>Última Ubicación Vista</Text>

                    {/* Contenedor Híbrido: Input + Botón GPS */}
                    <View style={styles.locationContainer}>
                        <TextInput
                            style={styles.locationTextInput}
                            placeholder="Escribe la dirección o usa el GPS ->"
                            value={formData[locationKey].toString()}
                            // Ahora PERMITIMOS editar el texto manualmente
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
                    <Text style={styles.helperText}>Toca el icono para usar tu GPS actual.</Text>


                    <Text style={[styles.label, { marginTop: 15 }]}>Fecha del Reporte</Text>
                    <View style={styles.dateInputDisplay}>
                        <FontAwesome name="calendar" size={18} color={COLORS.primary} />
                        <Text style={styles.placeholderText}>
                            {formData.lost_date.toDateString()} (Hoy)
                        </Text>
                    </View>
                </View>

                {/* BOTÓN PUBLICAR */}
                {error && <Text style={styles.errorText}>Error: {error}</Text>}
                <TouchableOpacity
                    style={styles.publishButton}
                    onPress={handleSubmitReport}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color={COLORS.card} />
                    ) : (
                        <Text style={styles.publishText}>Publicar Reporte</Text>
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
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.card,
        textAlign: 'center',
        marginBottom: 5,
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
        color: COLORS.primary,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    col: { width: '48%' },

    // ESTILOS NUEVOS PARA UBICACIÓN HÍBRIDA
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    locationTextInput: {
        flex: 1, // Toma todo el espacio posible
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        backgroundColor: '#fff',
        height: 50, // Altura fija para alinear con botón
    },
    gpsButton: {
        backgroundColor: COLORS.primary,
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

    // Estilo solo visual para fecha (ya no es botón)
    dateInputDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9', // Grisáceo para indicar "no editable" por ahora
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
