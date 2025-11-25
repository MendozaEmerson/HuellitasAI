import { useState } from 'react';
import { Alert } from 'react-native';
// Interfaz actualizada y el nuevo modelo de ubicación
import { LocationState, ReportFormData, ReportType } from '@/src/models/reportmodel';
import { reportService } from '@/src/services/report';
// Librerías para la imagen
import * as ImagePicker from 'expo-image-picker';


const initialFormData: ReportFormData = {
    reportType: 'lost',
    pet_name: '',
    species: '',
    breed: '',
    description: '',
    contactInfo: '',
    lost_date: new Date(), // Usamos la fecha actual como valor inicial
    last_seen_location_text: '',
};

const initialLocationState: LocationState = {
    latitude: null,
    longitude: null,
    address: 'Select location',
};

// Se elimina la función de subir a Supabase Storage (se encarga el backend de servicio).

export const useReportViewModel = () => {
    const [formData, setFormData] = useState<ReportFormData>(initialFormData);
    const [locationState, setLocationState] = useState<LocationState>(initialLocationState);
    const [imageUri, setImageUri] = useState<string | null>(null); // URI temporal en el dispositivo
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Funciones del Formulario ---

    const setReportType = (type: ReportType) => {
        setFormData(prev => ({ ...prev, reportType: type }));
    };

    const handleChange = (name: keyof ReportFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Futura función para seleccionar ubicación con Expo-Location/Map
    const handleLocationSelect = () => {
        // Simulación: establecer una ubicación
        setLocationState({
            latitude: -16.4090, // Ejemplo: Arequipa
            longitude: -71.5375,
            address: 'Av. Ejército, Arequipa, Perú'
        });
        // Alinear con el nuevo nombre de campo
        setFormData(prev => ({ ...prev, last_seen_location_text: 'Av. Ejército, Arequipa, Perú' }));
        Alert.alert('Ubicación Simulada', 'Ubicación de Arequipa seleccionada.');
    }

    // Función para seleccionar la foto desde la galería/cámara
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Se necesita permiso para acceder a la galería.");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!pickerResult.canceled) {
            setImageUri(pickerResult.assets[0].uri);
        }
    };


    // --- Función de Publicación Final (Simplificada) ---
    const handleSubmitReport = async () => {
        // 1. Validaciones de UI (siguen en el VM)
        if (!imageUri || !formData.last_seen_location_text || !formData.species || !formData.contactInfo) {
            setError("Faltan campos obligatorios (Foto, Tipo, Ubicación, Contacto).");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            // 2. LLAMADA AL SERVICIO (Toda la complejidad HTTP está oculta)
            const reportData = await reportService.createReport(imageUri, formData);

            // 3. Manejo de éxito
            Alert.alert("¡Éxito!", `Reporte #${reportData.data.report.id} publicado y enviado a IA.`);
            setFormData(initialFormData); // Limpiar formulario
            setImageUri(null);

        } catch (e) {
            // 4. Manejo de errores (el servicio relanza el error como una cadena limpia)
            let errorMessage = "Error desconocido al publicar el reporte.";
            if (e instanceof Error) {
                errorMessage = e.message;
            }

            setError(errorMessage);
            Alert.alert("Error de Publicación", errorMessage);
            console.error('Error de VM:', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        locationState,
        imageUri,
        isSubmitting,
        error,
        setReportType,
        handleChange,
        pickImage,
        handleLocationSelect, // Exponer la función de ubicación
        handleSubmitReport,
    };
};
