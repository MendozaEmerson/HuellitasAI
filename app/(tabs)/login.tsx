import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, StyleSheet } from 'react-native';


export default function ActivitiesScreen() {

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Crear Cuenta
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Esto es un texto
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 54,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerSubtitle: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },

});
