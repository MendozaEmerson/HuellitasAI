import { ReportFormData } from '@/src/models/reportmodel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError, AxiosResponse } from 'axios';
import { Platform } from 'react-native';
import api from './api';
import { supabase } from './supabase';

// Interfaz de respuesta del backend
interface ReportSuccessResponse {
    success: boolean;
    data: {
        report: { id: string };
        image: any;
    };
}

function isAxiosError(e: any): e is AxiosError {
    return e && typeof e === 'object' && 'isAxiosError' in e && e.isAxiosError === true;
}

class ReportService {

    private async getPushTokenAndUserId() {
        const token = await AsyncStorage.getItem('expo_push_token');
        const { data: { user } } = await supabase.auth.getUser();

        return {
            pushToken: token,
            userId: user?.id
        };
    }

    async createReport(imageUri: string, formData: ReportFormData): Promise<ReportSuccessResponse> {

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error("ERR_AUTH_MISSING: El usuario debe iniciar sesión para publicar un reporte.");
        }

        const { pushToken, userId } = await this.getPushTokenAndUserId();

        // --- PREPARACIÓN DE LA IMAGEN ---
        let uri = imageUri;

        // En Android, a veces la URI necesita el prefijo 'file://' si no lo tiene
        if (Platform.OS === 'android' && !uri.startsWith('file://') && !uri.startsWith('content://')) {
            uri = 'file://' + uri;
        }

        // Determinar el tipo de archivo y nombre
        const uriParts = uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `photo.${fileExtension}`;

        // Mapeo simple de extensiones a tipos MIME
        let mimeType = 'image/jpeg'; // Default
        if (fileExtension.toLowerCase() === 'png') {
            mimeType = 'image/png';
        } else if (fileExtension.toLowerCase() === 'jpg' || fileExtension.toLowerCase() === 'jpeg') {
            mimeType = 'image/jpeg';
        }

        // --- CONSTRUCCIÓN DEL FORMDATA ---
        const data = new FormData();

        // 1. Adjuntar la imagen (¡CRÍTICO!)
        // TypeScript a veces se queja de que FormData.append solo acepta string o Blob.
        // En React Native, acepta un objeto { uri, name, type }, así que usamos 'as any'.
        data.append('image', {
            uri: uri,
            name: fileName,
            type: mimeType,
        } as any);

        // 2. Adjuntar campos requeridos (Strings)
        data.append('pet_name', formData.pet_name || 'Desconocido');
        data.append('species', formData.species || 'dog');

        // Formatear fecha
        const dateStr = formData.lost_date instanceof Date
            ? formData.lost_date.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
        data.append('lost_date', dateStr);

        // 3. Adjuntar campos opcionales
        data.append('breed', formData.breed || '');
        data.append('description', formData.description || '');
        data.append('last_seen_location_text', formData.last_seen_location_text || '');

        // 4. Datos extra
        data.append('user_id', userId || '');
        data.append('contactInfo', formData.contactInfo || '');
        data.append('status', formData.reportType);
        data.append('push_token', pushToken || '');

        try {
            console.log("Enviando reporte...", { uri, mimeType, fileName }); // Log útil

            // --- LLAMADA API ---
            const response: AxiosResponse<ReportSuccessResponse> = await api.post('/lost-reports', data, {
                headers: {
                    // En React Native con Axios, es mejor dejar que la librería genere el Content-Type
                    // con el boundary correcto automáticamente.
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                // Esta transformación evita que Axios intente serializar el FormData a JSON
                transformRequest: (data, headers) => {
                    return data;
                },
            });

            if (response.status === 201) {
                return response.data;
            }

            throw new Error(`Publicación fallida. Código: ${response.status}`);

        } catch (e) {
            let errorMessage = "Error desconocido de red o servidor.";
            let status = 0;

            if (isAxiosError(e)) {
                status = e.response?.status || 0;
                console.log("ERROR BACKEND:", JSON.stringify(e.response?.data, null, 2)); // Log detallado

                if (e.response?.data && typeof e.response.data === 'object') {
                    const errorData = e.response.data as any;
                    // Buscar mensaje de error en varias propiedades posibles
                    errorMessage = errorData.error || errorData.message || errorData.detail || `Error ${status}: Verifique los datos.`;
                }
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }

            throw new Error(`[HTTP ${status}] ${errorMessage}`);
        }
    }
}

export const reportService = new ReportService();
