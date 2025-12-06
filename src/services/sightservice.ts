import {
    Sighting,
    SightingFormData,
    SightingSuccessResponse
} from '@/src/models/sightingmodel';
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

    // --- CREATE (POST) ---
    async createSighting(imageUri: string, formData: SightingFormData): Promise<SightingSuccessResponse> {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Debes iniciar sesión para reportar un avistamiento.");

        const { pushToken, userId } = await this.getPushTokenAndUserId();

        let uri = imageUri;
        if (Platform.OS === 'android' && !uri.startsWith('file://') && !uri.startsWith('content://')) {
            uri = 'file://' + uri;
        }

        const uriParts = uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `sighting-${Date.now()}.${fileExtension}`;

        let mimeType = 'image/jpeg';
        if (fileExtension.toLowerCase() === 'png') mimeType = 'image/png';

        const data = new FormData();

        data.append('image', {
            uri: uri,
            name: fileName,
            type: mimeType,
        } as any);

        data.append('sighting_date', formData.sighting_date.toISOString());
        data.append('description', formData.description || '');
        data.append('location_text', formData.location_text || '');
        data.append('user_id', userId || '');
        data.append('push_token', pushToken || '');

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

    // --- GET (LISTAR) ---
    async getSightings(): Promise<Sighting[]> {
        try {
            const response: AxiosResponse<{ success: boolean; data: any[] }> = await api.get('/sighting-reports', {
                params: {
                    limit: 20,
                    status: 'En_Calle'
                }
            });

            if (!response.data.success || !response.data.data) {
                return [];
            }

            console.log(`✅ Avistamientos cargados: ${response.data.data.length}`);

            // EL ADAPTADOR CORREGIDO
            return response.data.data.map((item) => ({
                // 1. CORRECCIÓN DEL ID: Usamos 'sighting_id'
                id: item.sighting_id,

                // 2. CORRECCIÓN DE USUARIO: Usamos 'reporter_user_id'
                userId: item.reporter_user_id,

                imageUrl: (item.image_url && item.image_url.trim() !== '')
                    ? item.image_url
                    : 'https://placehold.co/400x300/png?text=Sin+Imagen',

                location: item.location_text || 'Ubicación desconocida',
                createdAt: item.sighting_date,
                status: 'found', // Para pintar la tarjeta de verde
                description: item.description,

                // 3. CORRECCIÓN DE DATOS FALTANTES:
                // Como 'breed' y 'species' no vienen en el JSON, ponemos valores por defecto
                name: 'Mascota Avistada',
                type: 'other' // Icono genérico de huella
            }));

        } catch (e) {
            console.error('Error fetching sightings:', e);
            throw new Error('No se pudieron cargar los avistamientos.');
        }
    }
}

export const sightingService = new SightingService();
