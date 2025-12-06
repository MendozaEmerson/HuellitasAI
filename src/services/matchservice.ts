import { MatchResponse, MatchResult } from '@/src/models/matchmodel';
import { AxiosResponse } from 'axios';
import api from './api';
import { supabase } from './supabase';

class MatchService {
    /**
     * Obtiene las coincidencias para el usuario actual.
     */
    async getMyMatches(): Promise<MatchResult[]> {
        try {
            // 1. Obtener el ID del usuario actual de Supabase
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('No hay usuario autenticado');
            }
            console.log(`Llamando a GET /matches/user/${user.id}`);

            // 2. Llamar al endpoint: /api/matches/user/{userId}
            const response: AxiosResponse<MatchResponse> = await api.get(`/matches/user/${user.id}`, {
                params: {
                    limit: 10, // Traemos las mejores 10 coincidencias
                    status: 'Pending' // Solo las pendientes de revisión
                }
            });

            console.log("✅ Respuesta HTTP:", response.status); // LOG 2
            console.log("📦 Datos recibidos:", JSON.stringify(response.data, null, 2)); // JSON

            if (!response.data.success || !response.data.data) {
                console.warn("⚠️ La respuesta indica fallo o data vacía");
                return [];
            }

            // Mapeamos o retornamos directo (agregamos fallback de imagen si falta)
            return response.data.data.map(match => ({
                ...match,
                sighting_image_url: match.sighting_image_url || 'https://placehold.co/400x300/png?text=Ver+Coincidencia'
            }));

        } catch (e) {
            console.error('Error fetching matches:', e);
            throw new Error('No se pudieron cargar las coincidencias.');
        }
    }
}

export const matchService = new MatchService();
