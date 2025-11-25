import { ReportFormData } from '@/src/models/reportmodel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError, AxiosResponse } from 'axios';
import api from './api';
import { supabase } from './supabase';


/**
 * Define la estructura de respuesta de éxito que esperamos del backend
 */
interface ReportSuccessResponse {
    success: boolean;
    data: {
        report: { id: string }; // Solo necesitamos la ID para el alert en el VM
        image: any; // El objeto de imagen devuelto
    };
}

/**
 * Función de verificación de tipo: comprueba si el objeto de error es un error de Axios.
 */
function isAxiosError(e: any): e is AxiosError {
    return e && typeof e === 'object' && 'isAxiosError' in e && e.isAxiosError === true;
}


/**
 * Servicio encargado de la comunicación con el endpoint /lost-reports.
 */
class ReportService {

    // Función para obtener el token de usuario (usando el modelo temporal de AsyncStorage)
    private async getPushTokenAndUserId() {
        const token = await AsyncStorage.getItem('expo_push_token');
        const { data: { user } } = await supabase.auth.getUser();

        return {
            pushToken: token,
            userId: user?.id
        };
    }

    /**
     * Crea un nuevo reporte de mascota perdida/encontrada y lo envía al backend.
     * @param imageUri URI temporal de la foto en el dispositivo.
     * @param formData Datos del formulario.
     */
    async createReport(imageUri: string, formData: ReportFormData): Promise<ReportSuccessResponse> {

        // El usuario debe estar autenticado para obtener el token de acceso al BE
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error("ERR_AUTH_MISSING: El usuario debe iniciar sesión para publicar un reporte.");
        }

        // Obtener datos auxiliares (token, id del usuario)
        const { pushToken, userId } = await this.getPushTokenAndUserId();

        // 1. Preparar FormData para enviar archivo y datos
        const data = new FormData();

        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        // Adjuntar la imagen (el backend se encarga de subirla a Cloud Storage)
        data.append('image', {
            uri: imageUri,
            name: `report-${Date.now()}.${fileType}`,
            type: `image/${fileType}`,
        } as any);

        // 2. Adjuntar los campos del formulario
        data.append('pet_name', formData.pet_name || 'Desconocido');
        data.append('species', formData.species);
        data.append('breed', formData.breed || '');
        data.append('description', formData.description || '');
        data.append('lost_date', formData.lost_date.toISOString().split('T')[0]);
        data.append('last_seen_location_text', formData.last_seen_location_text);

        // 3. Adjuntar datos para el Backend (aunque no estén en el body del Swagger)
        // El backend los usa para trazabilidad y notificaciones.
        data.append('user_id', userId || 'unknown');
        data.append('contactInfo', formData.contactInfo);
        data.append('status', formData.reportType);
        data.append('push_token', pushToken || ''); // Enviamos el token al BE

        try {
            // 4. LLAMADA CLAVE: Tipamos la respuesta de Axios
            const response: AxiosResponse<ReportSuccessResponse> = await api.post('/lost-reports', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Axios tipa la respuesta, lo que resuelve los errores de TS.
            if (response.status === 201) {
                // Ya que tipamos, podemos acceder a .data sin error
                return response.data;
            }

            // Si el status es 200 pero el BE devuelve un mensaje de error dentro del cuerpo, lanzamos error
            throw new Error(`Publicación fallida. Código: ${response.status}`);

        } catch (e) {
            // 5. MANEJO DE ERRORES CORREGIDO: Usando el Type Guard isAxiosError
            let errorMessage = "Error desconocido de red o servidor.";
            let status = 0;

            if (isAxiosError(e)) {
                // CASO 1: Error de Axios (el más común)
                status = e.response?.status || 0; // Usamos encadenamiento opcional (?) por si no hay response
                // El mensaje de error del BE generalmente está en e.response.data.message
                errorMessage = (e.response?.data as any)?.message || `Error ${status} del servidor.`;
            } else if (e instanceof Error) {
                // CASO 2: Error de JavaScript o validación de Supabase/Frontend
                errorMessage = e.message;
            }

            // Relanzamos una excepción con la información limpia para que el ViewModel la atrape
            throw new Error(`[HTTP ${status}] ${errorMessage}`);
        }
    }
}

// Exportamos una instancia del servicio para usarlo en el ViewModel
export const reportService = new ReportService();
