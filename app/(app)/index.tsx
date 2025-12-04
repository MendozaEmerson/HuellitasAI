import { useHomeViewModel } from '@/src/viewmodels/homeviewmodel';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Asegúrate de importar tu PetCard correctamente
import { PetCard } from '@/components/pet-card';

export default function HomeTab() {
  const router = useRouter();

  const {
    reports,
    isLoading,
    refreshing,
    error,
    searchQuery,
    setSearchQuery,
    onRefresh,
    signOut
  } = useHomeViewModel();

  const handlePetPress = (petId: string) => {
    // Aquí navegarías al detalle
    // router.push(`/(app)/pet-details?id=${petId}`);
    console.log("Ver detalle de:", petId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mascotas Perdidas</Text>
        <TouchableOpacity onPress={() => signOut()} style={styles.logoutButton}>
          <Text style={{ fontSize: 24 }}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, raza..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Lista */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF9500" style={styles.loader} />
      ) : (
        <FlatList
          data={reports}
          // AHORA SÍ FUNCIONA: item.id existe gracias al adaptador
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={() => handlePetPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF9500']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'No se encontraron resultados' : 'No hay reportes activos'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  logoutButton: { padding: 8 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#2c3e50' },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  errorText: { color: '#c62828', textAlign: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  loader: { marginTop: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#7f8c8d' },
});
