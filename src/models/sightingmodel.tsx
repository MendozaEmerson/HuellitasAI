// Estado del avistamiento
// Ajusta estos valores según lo que tu backend soporte (En_Calle, En_Albergue, Reunido)
export type SightingStatus = 'En_Calle' | 'En_Albergue' | 'Reunido';

// Estructura de datos para enviar al Backend
export interface SightingFormData {
    description: string;
    sighting_date: Date; // Requerido: string($date-time)
    location_text: string; // Ubicación donde se vio
    status: SightingStatus; // Estado del avistamiento
    // Nota: La imagen se maneja por separado (imageUri)
}

// Interfaz de respuesta exitosa del backend
export interface SightingSuccessResponse {
    success: boolean;
    data: {
        sighting: { id: string };
        matches_found?: number; // Opcional, si el BE devuelve coincidencias
    };
}
