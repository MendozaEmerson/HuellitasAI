import { useAuthViewModel } from '@/src/viewmodels/authviewmodel';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Image, KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuthViewModel();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    await signIn(email, pass);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Logo */}
          <Image 
            source={require('@/assets/images/Logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>Huellitas AI</Text>
          <Text style={styles.subtitle}>Iniciar Sesión</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#3b5998" />
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                value={pass}
                onChangeText={setPass}
                secureTextEntry
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#999"
              />

              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>

              <Link href="/(auth)/register" asChild>
                <TouchableOpacity style={styles.registerLink}>
                  <Text style={styles.registerLinkText}>
                    ¿No tienes cuenta? <Text style={styles.registerLinkBold}>Regístrate aquí</Text>
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 18, 
    marginBottom: 30, 
    color: '#7f8c8d' 
  },
  formContainer: { 
    width: '100%' 
  },
  label: { 
    marginBottom: 8, 
    color: '#555', 
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 25,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#555',
    fontSize: 14,
  },
  registerLinkBold: {
    color: '#3b5998',
    fontWeight: 'bold',
  },
});