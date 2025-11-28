import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface GeoLocation {
    latitude: number;
    longitude: number;
    address: string;
}

class LocationService {

    /**
     * Solicita permisos y obtiene la ubicación actual del usuario.
     * Retorna un objeto con latitud, longitud y dirección formateada.
     */
    async getCurrentLocation(): Promise<GeoLocation | null> {
        try {
            // 1. Pedir permisos
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Necesitamos acceso a tu ubicación para reportar la mascota.'
                );
                return null;
            }

            // 2. Obtener coordenadas actuales
            // Usamos Accuracy.High para mejor precisión en calles
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            const { latitude, longitude } = location.coords;

            // 3. Geocodificación Inversa (Coordenadas -> Texto)
            const addressText = await this.getAddressFromCoordinates(latitude, longitude);

            return {
                latitude,
                longitude,
                address: addressText,
            };

        } catch (error) {
            console.error("LocationService Error:", error);
            throw new Error("No pudimos obtener tu ubicación actual.");
        }
    }

    /**
     * Convierte coordenadas en una dirección legible.
     */
    private async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
        try {
            const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (addressResponse.length > 0) {
                const addr = addressResponse[0];
                // Construimos una dirección legible: Calle + Número + Ciudad + Región
                return [addr.street, addr.streetNumber, addr.city, addr.region]
                    .filter(Boolean) // Elimina nulos o undefined
                    .join(', ');
            }

            // Fallback si no hay dirección
            return `${latitude}, ${longitude}`;

        } catch (error) {
            console.warn("Error en geocodificación inversa:", error);
            return `${latitude}, ${longitude}`; // Fallback seguro
        }
    }
}

export const locationService = new LocationService();
