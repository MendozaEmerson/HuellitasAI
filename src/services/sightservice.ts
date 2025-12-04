import { SightingFormData, SightingSuccessResponse } from '@/src/models/sightingmodel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import api from './api';
import { supabase } from './supabase';

function isAxiosError(e: any): e is AxiosError {
    return e && typeof e === 'object' && 'isAxiosError' in e && e.isAxiosError === true;
}

class SightingService {

    private async getPushTokenAndUserId() {
        const token = await AsyncStorage.getItem('expo_push_token');
        const { data: { user } } = await supabase.auth.getUser();
        return { pushToken: token, userId: user?.id };
    }

    /**
     * Crea un reporte de avistamiento
     */
    async createSighting(imageUri: string, formData: SightingFormData): Promise<SightingSuccessResponse> {

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Debes iniciar sesión para reportar un avistamiento.");

        const { pushToken, userId } = await this.getPushTokenAndUserId();

        // --- PREPARACIÓN DE LA IMAGEN ---
        let uri = imageUri;
        if (Platform.OS === 'android' && !uri.startsWith('file://') && !uri.startsWith('content://')) {
            uri = 'file://' + uri;
        }

        const uriParts = uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `sighting-${Date.now()}.${fileExtension}`;

        let mimeType = 'image/jpeg';
        if (fileExtension.toLowerCase() === 'png') mimeType = 'image/png';

        // --- CONSTRUCCIÓN DEL FORMDATA ---
        const data = new FormData();

        // 1. Adjuntar la imagen
        data.append('image', {
            uri: uri,
            name: fileName,
            type: mimeType,
        } as any);

        // 2. Adjuntar campos requeridos por /api/sighting-reports
        // Nota: El backend espera 'sighting_date'
        data.append('sighting_date', formData.sighting_date.toISOString()); // ISO completo para fecha y hora

        data.append('description', formData.description || '');
        data.append('location_text', formData.location_text || '');

        // 3. Datos adicionales
        data.append('user_id', userId || '');
        data.append('push_token', pushToken || '');
        // Si el backend soporta 'status' en el POST, lo enviamos (ej: En_Calle)
        // Si no lo soporta en el POST, puedes omitirlo o preguntar a tu compañero.
        // data.append('status', formData.status); 

        try {
            console.log("Enviando avistamiento...", { uri });

            const response: AxiosResponse<SightingSuccessResponse> = await api.post('/sighting-reports', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                transformRequest: (data) => data,
            });

            if (response.status === 201) {
                return response.data;
            }

            throw new Error(`Publicación fallida. Código: ${response.status}`);

        } catch (e) {
            let errorMessage = "Error desconocido al reportar avistamiento.";
            let status = 0;

            if (isAxiosError(e)) {
                status = e.response?.status || 0;
                console.log("ERROR BACKEND (Sighting):", JSON.stringify(e.response?.data, null, 2));

                if (e.response?.data && typeof e.response.data === 'object') {
                    const errorData = e.response.data as any;
                    errorMessage = errorData.error || errorData.message || `Error ${status}: Verifique los datos.`;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }

            throw new Error(`[HTTP ${status}] ${errorMessage}`);
        }
    }
}

export const sightingService = new SightingService();
