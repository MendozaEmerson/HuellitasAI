import { AxiosResponse } from 'axios';
import api from './api';

// 1. Interfaz de datos CRUDOS del Backend (lo que llega de la API)
interface BackendLostReport {
    report_id: string;
    owner_user_id: string;
    pet_name: string;
    species: string;
    breed: string;
    image_url: string | null; // Puede venir nulo
    status: 'Activa' | 'Encontrada';
    last_seen_location_text: string;
    lost_date: string;
    description?: string;
}

// 2. Interfaz LIMPIA para tu App (Debe coincidir con Pet de petmodel.tsx)
export interface LostReport {
    id: string;
    name: string;
    type: 'dog' | 'cat' | 'other';
    breed: string;
    imageUrl: string;
    location: string;
    createdAt: string; // ✅ CORREGIDO: Antes era 'date'
    status: 'lost' | 'found';
    userId: string;
    description?: string;
}

interface FeedResponse {
    success: boolean;
    data: BackendLostReport[];
}

class FeedService {

    async getLostReports(): Promise<LostReport[]> {
        try {
            const response: AxiosResponse<FeedResponse> = await api.get('/lost-reports', {
                params: {
                    status: 'Activa',
                    limit: 20
                }
            });

            if (!response.data.success || !response.data.data) {
                return [];
            }

            console.log("Datos crudos del backend (primer item):", response.data.data[0]); // Debug

            // --- EL ADAPTADOR ---
            return response.data.data.map((item) => ({
                id: item.report_id,
                userId: item.owner_user_id,
                name: item.pet_name,
                type: this.mapSpecies(item.species),
                breed: item.breed || 'Raza no especificada',

                // ✅ CORRECCIÓN DE IMAGEN:
                // Aseguramos que si es null, undefined o string vacío, use el placeholder.
                imageUrl: (item.image_url && item.image_url.trim() !== '')
                    ? item.image_url
                    : 'https://placehold.co/400x300/png?text=Sin+Imagen',

                location: item.last_seen_location_text || 'Ubicación desconocida',

                // ✅ CORRECCIÓN DE FECHA: Mapeamos lost_date a createdAt
                createdAt: item.lost_date,

                status: item.status === 'Activa' ? 'lost' : 'found',
                description: item.description
            }));

        } catch (error) {
            console.error('Error fetching feed:', error);
            throw new Error('No se pudieron cargar los reportes.');
        }
    }

    private mapSpecies(species: string): 'dog' | 'cat' | 'other' {
        const s = species?.toLowerCase() || '';
        if (s.includes('perro') || s.includes('dog') || s.includes('canino')) return 'dog';
        if (s.includes('gato') || s.includes('cat') || s.includes('felino')) return 'cat';
        return 'other';
    }
}

export const feedService = new FeedService();
