import { useState, useEffect, useCallback } from 'react';
import { PetCard } from '@/components/pet-card';
import { useAuthViewModel } from '@/src/viewmodels/authviewmodel';
import api from '@/src/services/api';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Interfaz para el reporte del backend
interface LostReport {
  id: string;
  pet_name: string;
  species: string;
  breed: string;
  image_url: string;
  status: 'lost' | 'found';
  last_seen_location_text: string;
  lost_date: string;
  user_id: string;
}

export default function HomeTab() {
  const router = useRouter();
  const { signOut, isLoading: authLoading } = useAuthViewModel();
  
  const [reports, setReports] = useState<LostReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar reportes desde el backend
  const loadReports = async () => {
    try {
      setError(null);
      console.log('🔄 Iniciando carga de reportes...');
      
      // Verificar sesión primero
      const { data: { session } } = await supabase.auth.getSession();
      console.log('📌 Sesión actual:', session ? 'Activa' : 'No hay sesión');
      
      const response = await api.get('/lost-reports', {
        params: {
          limit: 50,
          status: 'lost',
        }
      });

      console.log('✅ Respuesta del servidor:', {
        status: response.status,
        success: response.data.success,
        dataCount: response.data.data?.length || 0
      });

      if (response.data.success) {
        const reportData = response.data.data || [];
        setReports(reportData);
        
        if (reportData.length === 0) {
          console.warn('⚠️ No hay reportes en la base de datos');
        }
      } else {
        throw new Error('La respuesta del servidor no fue exitosa');
      }
    } catch (err: any) {
      console.error('❌ Error completo:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config?.url
      });
      
      let errorMessage = 'Error al cargar reportes';
      
      if (err.response?.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Cierra sesión y vuelve a entrar.';
      } else if (err.response?.status === 404) {
        errorMessage = 'El servidor no encontró el endpoint de reportes.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (!err.response) {
        errorMessage = 'No se pudo conectar al servidor. Verifica tu internet.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar reportes al montar el componente
  useEffect(() => {
    loadReports();
  }, []);

  // Función para refrescar con pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadReports();
  }, []);

  const handlePetPress = (report: LostReport) => {
    // Navegar a pantalla de detalles con el ID del reporte
    router.push(`/(app)/pet-details?id=${report.id}`);
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Filtrar reportes por búsqueda
  const filteredReports = reports.filter(report =>
    report.pet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.last_seen_location_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mascotas perdidas</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, ubicación o raza..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista de mascotas */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF9500" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard
              pet={{
                id: item.id,
                name: item.pet_name,
                imageUrl: item.image_url,
                location: item.last_seen_location_text,
                type: item.species === 'dog' ? 'dog' : item.species === 'cat' ? 'cat' : 'other',
                status: item.status,
                createdAt: item.lost_date,
                userId: item.user_id,
              }}
              onPress={() => handlePetPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF9500']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No se encontraron resultados' : 'No hay reportes aún'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  loader: {
    marginTop: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});