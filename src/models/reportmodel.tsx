// Define el estado del reporte (Pérdida o Avistamiento)
export type ReportType = 'lost' | 'found'; // Alineado con el backend

// Define la estructura de datos que se enviará al Backend
export interface ReportFormData {
    reportType: ReportType; // 'lost' o 'found' (Usaremos esto internamente para el status)

    // Campos del formulario alineados con el BE
    pet_name: string; // Corresponde al campo pet_name del BE
    species: 'dog' | 'cat' | 'other' | string; // Corresponde al campo species
    breed: string; // Corresponde al campo breed
    description: string;

    // Campos de Localización y Contacto
    lost_date: Date; // Usaremos Date en el frontend, lo formateamos en el ViewModel
    last_seen_location_text: string; // Corresponde al campo last_seen_location_text

    contactInfo: string; // Campo extra para contactar al dueño
}

// Interfaz para el estado de la ubicación (para el componente de selección)
export interface LocationState {
    latitude: number | null;
    longitude: number | null;
    address: string;
}
