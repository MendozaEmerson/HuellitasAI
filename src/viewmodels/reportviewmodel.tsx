import { LocationState, ReportFormData, ReportType } from '@/src/models/reportmodel';
import { locationService } from '@/src/services/locationservice'; // ⬅️ Nuevo Servicio
import { reportService } from '@/src/services/report';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

const initialFormData: ReportFormData = {
    reportType: 'lost',
    pet_name: '',
    species: '',
    breed: '',
    description: '',
    contactInfo: '',
    lost_date: new Date(),
    last_seen_location_text: '',
};

const initialLocationState: LocationState = {
    latitude: null,
    longitude: null,
    address: 'Seleccionar ubicación',
};

export const useReportViewModel = () => {
    const [formData, setFormData] = useState<ReportFormData>(initialFormData);
    const [locationState, setLocationState] = useState<LocationState>(initialLocationState);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const setReportType = (type: ReportType) => {
        setFormData(prev => ({ ...prev, reportType: type }));
    };

    const handleChange = (name: keyof ReportFormData, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- FUNCIÓN DE UBICACIÓN (Delega al Servicio) ---
    const handleLocationSelect = async () => {
        setIsLoadingLocation(true);
        try {
            // Llamamos al servicio (Lógica encapsulada)
            const locationData = await locationService.getCurrentLocation();

            if (locationData) {
                // Actualizamos el estado de ubicación
                setLocationState({
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    address: locationData.address
                });

                // Actualizamos el formulario
                setFormData(prev => ({
                    ...prev,
                    last_seen_location_text: locationData.address
                }));
            }
        } catch (e) {
            let msg = "Error al obtener ubicación.";
            if (e instanceof Error) msg = e.message;
            Alert.alert("Error", msg);
        } finally {
            setIsLoadingLocation(false);
        }
    };

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

    const handleSubmitReport = async () => {
        if (!imageUri || !formData.last_seen_location_text || !formData.species || !formData.contactInfo) {
            setError("Faltan campos obligatorios (Foto, Tipo, Ubicación, Contacto).");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const reportData = await reportService.createReport(imageUri, formData);
            Alert.alert("¡Éxito!", `Reporte enviado correctamente.`);
            setFormData(initialFormData);
            setImageUri(null);
            setLocationState(initialLocationState);
        } catch (e) {
            let errorMessage = "Error desconocido al publicar el reporte.";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            setError(errorMessage);
            Alert.alert("Error de Publicación", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        locationState,
        imageUri,
        isSubmitting,
        isLoadingLocation,
        error,
        setReportType,
        handleChange,
        pickImage,
        handleLocationSelect,
        handleSubmitReport,
    };
};
