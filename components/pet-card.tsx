import { Pet } from '@/src/models/petmodel';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PetCardProps {
  pet: Pet;
  onPress: () => void;
}

export function PetCard({ pet, onPress }: PetCardProps) {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: pet.imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{pet.name}</Text>
        
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location}>{pet.location}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  button: {
    backgroundColor: '#FF9500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});