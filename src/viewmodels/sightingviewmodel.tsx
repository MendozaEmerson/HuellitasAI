import { LocationState } from '@/src/models/reportmodel'; // Reutilizamos LocationState
import { SightingFormData } from '@/src/models/sightingmodel';
import { locationService } from '@/src/services/locationservice';
import { sightingService } from '@/src/services/sightservice';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

const initialFormData: SightingFormData = {
    description: '',
    sighting_date: new Date(),
    location_text: '',
    status: 'En_Calle', // Valor por defecto
};

const initialLocationState: LocationState = {
    latitude: null,
    longitude: null,
    address: 'Tocar para obtener ubicación',
};

export const useSightingViewModel = () => {
    const [formData, setFormData] = useState<SightingFormData>(initialFormData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [locationState, setLocationState] = useState<LocationState>(initialLocationState);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const handleChange = (name: keyof SightingFormData, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- UBICACIÓN ---
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
                setFormData(prev => ({ ...prev, location_text: locationData.address }));
            }
        } catch (e) {
            let msg = "Error de ubicación";
            if (e instanceof Error) msg = e.message;
            Alert.alert("Error", msg);
        } finally {
            setIsLoadingLocation(false);
        }
    };

    // --- FOTO ---
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

    // --- PUBLICAR ---
    const handleSubmitSighting = async () => {
        if (!imageUri) {
            setError("La foto es obligatoria para un avistamiento.");
            return;
        }
        if (!formData.location_text) {
            setError("La ubicación es obligatoria.");
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await sightingService.createSighting(imageUri, formData);

            Alert.alert(
                "¡Avistamiento Reportado!",
                "Gracias por tu ayuda. Hemos notificado a los dueños de mascotas similares."
            );

            // Resetear formulario
            setFormData(initialFormData);
            setImageUri(null);
            setLocationState(initialLocationState);

        } catch (e) {
            let errorMessage = "Error al reportar avistamiento.";
            if (e instanceof Error) errorMessage = e.message;

            setError(errorMessage);
            Alert.alert("Error", errorMessage);
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
        handleChange,
        pickImage,
        handleLocationSelect,
        handleSubmitSighting,
    };
};
