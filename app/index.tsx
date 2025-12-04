import { Link } from 'expo-router';
import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('@/assets/images/Logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Bienvenido a HuellitassAI</Text>
      <Text style={styles.subtitle}>Encuentra a tu mascota perdida</Text>

      <View style={styles.buttonContainer}>
        <Link href="/(auth)/login" asChild>
          <Button title="Iniciar Sesión" color="#3b5998" />
        </Link>
      </View>

      <View style={styles.buttonContainer}>
        <Link href="/(auth)/register" asChild>
          <Button title="Crear Cuenta" color="#FF9500" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 12,
  },
});