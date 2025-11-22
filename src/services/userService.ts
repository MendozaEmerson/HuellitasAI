// src/services/userService.ts
import api from './api';

/**
 * Servicio de ejemplo para interactuar con endpoints de usuarios
 * El frontend puede copiar este patrón para otros módulos
 */
export const userService = {
    /**
     * Obtener perfil del usuario actual
     */
    getProfile: async (userId: string) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data.data; // { user_id, email, full_name, ... }
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            throw error;
        }
    },

    /**
     * Actualizar perfil del usuario
     */
    updateProfile: async (userId: string, updates: {
        full_name?: string;
        phone_number?: string;
        push_notification_token?: string;
    }) => {
        try {
            const response = await api.put(`/users/${userId}`, updates);
            return response.data.data;
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            throw error;
        }
    },
};

// Ejemplo de uso en un componente:
// import { userService } from '@/src/services/userService';
// 
// const ProfileScreen = () => {
//     const loadProfile = async () => {
//         const profile = await userService.getProfile('user-id-123');
//         console.log(profile);
//     };
// };
