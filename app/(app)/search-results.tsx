import api from '@/src/services/api';
import { useLocalSearchParams, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface SearchResult {
  id: string;
  pet_name: string;
  species: string;
  breed: string;
  image_url: string;
  similarity_score: number;
  status: 'lost' | 'found';
  last_seen_location_text: string;
  lost_date: string;
}

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ imageUri: string }>();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.imageUri) {
      searchMatches();
    } else {
      setError('No se proporcionó una imagen');
      setIsLoading(false);
    }
  }, [params.imageUri]);

  const searchMatches = async () => {
    try {
        setError(null);
      // Preparar FormData
      const formData = new FormData();
      formData.append('image', {
        uri: params.imageUri,
        name: 'search.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/lost-reports/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setResults(response.data.data.matches || []);
      } else {
        setError('No se encontraron coincidencias');
      }
    } catch (err) {
      console.error('Error buscando matches:', err);
      setError('Error al buscar coincidencias');
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.resultCard}>
      <Image source={{ uri: item.image_url }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.pet_name}</Text>
        <Text style={styles.resultBreed}>{item.breed} • {item.species}</Text>
        <Text style={styles.resultLocation}>📍 {item.last_seen_location_text}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Similitud:</Text>
          <View style={[
            styles.scoreBadge,
            { backgroundColor: item.similarity_score > 0.7 ? '#4caf50' : '#ff9800' }
          ]}>
            <Text style={styles.scoreValue}>
              {Math.round(item.similarity_score * 100)}%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Resultados de Búsqueda',
        }}
      />
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3b5998" />
            <Text style={styles.loaderText}>Buscando coincidencias...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron coincidencias</Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
              </Text>
            </View>
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={renderResult}
              contentContainerStyle={styles.listContent}
            />
          </>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  listContent: {
    padding: 16,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImage: {
    width: 120,
    height: 120,
  },
  resultInfo: {
    flex: 1,
    padding: 12,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  resultBreed: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  resultLocation: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#555',
    marginRight: 8,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorText: {
    fontSize: 16,
    color: '#c62828',
  },
});