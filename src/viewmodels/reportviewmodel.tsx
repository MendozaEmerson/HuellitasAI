import { LocationState, ReportFormData, ReportType } from '@/src/models/reportmodel';
import { locationService } from '@/src/services/locationservice';
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

    const handleLocationSelect = async () => {
        setIsLoadingLocation(true);
        try {
            const locationData = await locationService.getCurrentLocation();
            if (locationData) {
                setLocationState({
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    address: locationData.address
                });
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

    // CAMBIO: Ahora devuelve una Promesa con el string del ID o null
    const handleSubmitReport = async (): Promise<string | null> => {
        if (!imageUri || !formData.last_seen_location_text || !formData.species || !formData.contactInfo) {
            setError("Faltan campos obligatorios (Foto, Tipo, Ubicación, Contacto).");
            return null;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const reportData = await reportService.createReport(imageUri, formData);

            // Ya NO mostramos el Alert aquí para permitir navegación fluida
            // Alert.alert("¡Éxito!", `Reporte enviado correctamente.`); 

            setFormData(initialFormData);
            setImageUri(null);
            setLocationState(initialLocationState);

            // Retornamos el ID para que la vista lo use
            return reportData.data.report.id;

        } catch (e) {
            let errorMessage = "Error desconocido al publicar el reporte.";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            setError(errorMessage);
            Alert.alert("Error de Publicación", errorMessage);
            return null;
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
