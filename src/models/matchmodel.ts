// Estructura de un Match individual según el backend
export interface MatchResult {
    match_id: string;
    report_id: string;
    sighting_id: string;
    ai_distance_score: number; // Ej: 0.85
    status: 'Pending' | 'Confirmed' | 'Rejected';

    // Datos informativos para la tarjeta
    pet_name: string;
    species: string;
    breed: string;
    location_text: string;
    sighting_date: string;

    // Si el backend no la manda, usaremos un placeholder.
    sighting_image_url?: string;
}

export interface MatchResponse {
    success: boolean;
    data: MatchResult[];
}
