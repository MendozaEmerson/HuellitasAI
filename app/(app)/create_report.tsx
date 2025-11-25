import React from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// 1. IMPORTAR COMPONENTES HIJOS (Responsabilidad separada)
import PhotosPlaceholder from '../../components/report/photosplaceholder';
import ReportTypeSelector from '../../components/report/reporttypeselector';

// 2. IMPORTAR FUNCIONES Y HOOKS
import { useReportViewModel } from '@/src/viewmodels/reportviewmodel';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Colores base (Para mantener la vista concisa, solo definimos los colores aquí)
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
    // 3. Conexión al ViewModel
    const {
        formData,
        isSubmitting,
        error,
        setReportType,
        handleChange,
        handleSubmitReport,
        pickImage,
        handleLocationSelect,
        imageUri
    } = useReportViewModel();

    // Nombres de campo del BE para el ViewModel
    const petNameKey = 'pet_name' as keyof typeof formData;
    const speciesKey = 'species' as keyof typeof formData;
    const breedKey = 'breed' as keyof typeof formData;
    const descriptionKey = 'description' as keyof typeof formData;
    const contactKey = 'contactInfo' as keyof typeof formData;


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header (Responsabilidad: Mostrar el selector de tipo) */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reporta una Mascota</Text>
                <ReportTypeSelector
                    reportType={formData.reportType}
                    setReportType={setReportType}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                {/* 1. SECCIÓN FOTOS */}
                <PhotosPlaceholder imageUri={imageUri} onUploadPress={pickImage} />

                {/* 2. SECCIÓN DETALLES */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalles de la Mascota</Text>

                    <Text style={styles.label}>Nombre de la Mascota</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Introduce el nombre (si lo conoces)"
                        value={formData[petNameKey].toString()}
                        onChangeText={(text) => handleChange(petNameKey, text)}
                    />

                    {/* Fila Tipo y Raza */}
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

                    <Text style={styles.label}>Descripción y Señas Particulares</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="¿Marcas distintivas? ¿Llevaba collar?"
                        multiline
                        numberOfLines={4}
                        value={formData.description}
                        onChangeText={(text) => handleChange(descriptionKey, text)}
                    />

                    <Text style={styles.label}>Información de Contacto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tu número o correo para contacto"
                        value={formData.contactInfo}
                        onChangeText={(text) => handleChange(contactKey, text)}
                    />
                </View>

                {/* 3. SECCIÓN UBICACIÓN Y TIEMPO */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ubicación y Hora</Text>

                    {/* Campo Ubicación */}
                    <Text style={styles.label}>Última Ubicación Vista</Text>
                    <TouchableOpacity style={styles.locationInput} onPress={handleLocationSelect}>
                        <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                        <Text
                            style={[
                                styles.placeholderText,
                                formData.last_seen_location_text && { color: COLORS.text }
                            ]}
                        >
                            {formData.last_seen_location_text || 'Seleccionar ubicación'}
                        </Text>
                    </TouchableOpacity>

                    {/* Campo Fecha y Hora (Simulación) */}
                    <Text style={styles.label}>Fecha del Reporte</Text>
                    <TouchableOpacity style={styles.locationInput}>
                        <FontAwesome name="calendar" size={18} color={COLORS.primary} />
                        <Text style={styles.placeholderText}>
                            {formData.lost_date.toDateString()}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Botón Publicar y Errores */}
                {error && <Text style={styles.errorText}>Error: {error}</Text>}
                <TouchableOpacity
                    style={styles.publishButton}
                    onPress={handleSubmitReport}
                    disabled={isSubmitting}
                >
                    <Text style={styles.publishText}>
                        {isSubmitting ? 'Publicando...' : 'Publicar Reporte'}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 50 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Estilos de la Aplicación (Solo los estilos de la estructura principal) ---

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 20,
    },
    header: {
        paddingTop: Platform.OS === 'android' ? 30 : 10,
        paddingBottom: 20,
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
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
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    col: {
        width: '48%',
    },
    locationInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    placeholderText: {
        color: COLORS.placeholder,
        marginLeft: 10,
        flex: 1,
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
        marginTop: 20,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
    },
    publishText: {
        color: COLORS.card,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
