import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#c8f384ff', dark: '#6cdfb8ff' }}
      headerImage={
        <Image
          source={require('@/assets/images/logoSN.png')}
          style={styles.headerLogo}
        />
      }>

      {/* Bienvenida */}
      <ThemedView style={styles.welcomeContainer}>
        <ThemedText type="title" style={styles.welcomeTitle}>
          Inicio
        </ThemedText>
        <ThemedText style={styles.welcomeSubtitle}>
          Plataforma de Aprendizaje Personalizado para Estudiantes con TEA
        </ThemedText>
      </ThemedView>

      {/* algo*/}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Pantalla de Inicio
        </ThemedText>
      </ThemedView>

      {/* Niveles */}
      <ThemedView style={styles.sectionContainer}>
        {/* Tabla de Niveles */}
        <View style={styles.tableContainer}>
          {/* Nivel 1 */}
          <View style={[styles.levelCard, styles.level1]}>
            <View style={styles.levelHeader}>
              <ThemedText type="defaultSemiBold" style={styles.levelNumber}>
                Nivel 1
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.levelLabel}>
                Necesita Apoyo
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    height: 128,
    width: 300,
    bottom: 50,
    left: 50,
    position: 'absolute',
    //transform: [{ translateX: -100 }]
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  welcomeTitle: {
    textAlign: 'center',
  },
  welcomeSubtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  tableContainer: {
    gap: 16,
    marginTop: 12,
  },
  levelCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    gap: 10,
  },
  level1: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 15,
    color: '#333',
  },
  levelLabel: {
    fontSize: 11,
    color: '#555',
  },
});
