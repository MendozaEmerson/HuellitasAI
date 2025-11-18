import { useState } from 'react';

import { PetCard } from '@/components/pet-card';
import { Pet } from '@/src/models/petmodel';
import { useAuthViewModel } from '@/src/viewmodels/authviewmodel';

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Max',
    imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400',
    location: 'Colonia Roma, CDMX',
    type: 'dog',
    status: 'lost',
    createdAt: new Date().toISOString(),
    userId: '123',
  },
  {
    id: '2',
    name: 'Luna',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
    location: 'Condesa, CDMX',
    type: 'cat',
    status: 'lost',
    createdAt: new Date().toISOString(),
    userId: '123',
  },
    {
    id: '3',
    name: 'Rocky',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    location: 'Polanco, CDMX',
    type: 'dog',
    status: 'lost',
    createdAt: new Date().toISOString(),
    userId: '123',
  },
];

export default function HomeTab() {
  // const router = useRouter(); 

  // 3. Consumimos el estado y la función del ViewModel
  const { signOut, isLoading } = useAuthViewModel();
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePetPress = (pet: Pet) => {
    //pantalla de detalles
    console.log('Ver detalles de:', pet.name);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mascotas perdidas</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}></Text>
        </TouchableOpacity>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o ubicación..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Lista de mascotas */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF9500" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard 
              pet={item} 
              onPress={() => handlePetPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No se encontraron mascotas
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
