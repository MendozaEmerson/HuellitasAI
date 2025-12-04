import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator,
  Image, 
  Linking,
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import api from '@/src/services/api';

interface ReportDetails {
  id: string;
  pet_name: string;
  species: string;
  breed: string;
  description: string;
  image_url: string;
  status: 'lost' | 'found';
  last_seen_location_text: string;
  lost_date: string;
  contact_info: string;
  user_id: string;
}

export default function PetDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportDetails();
  }, [params.id]);

  const loadReportDetails = async () => {
    try {
      const response = await api.get(`/lost-reports/${params.id}`);
      if (response.data.success) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando detalles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContact = () => {
    if (report?.contact_info) {
      // Detectar si es email o teléfono
      if (report.contact_info.includes('@')) {
        Linking.openURL(`mailto:${report.contact_info}`);
      } else {
        Linking.openURL(`tel:${report.contact_info}`);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b5998" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró el reporte</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: report.pet_name,
          headerBackTitle: 'Atrás',
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Image 
            source={{ uri: report.image_url }}
            style={styles.image}
          />
          
          <View style={styles.content}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {report.status === 'lost' ? '🔴 Perdido' : '🟢 Encontrado'}
              </Text>
            </View>

            <Text style={styles.name}>{report.pet_name}</Text>
            <Text style={styles.breed}>{report.breed} • {report.species}</Text>
            <Text style={styles.location}>📍 {report.last_seen_location_text}</Text>
            <Text style={styles.date}>
              📅 {new Date(report.lost_date).toLocaleDateString('es-ES')}
            </Text>

            {report.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{report.description}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContact}
            >
              <Text style={styles.contactButtonText}>Contactar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  breed: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  contactButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});