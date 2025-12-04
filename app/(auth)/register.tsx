import { useAuthViewModel } from '@/src/viewmodels/authviewmodel';
import { useRouter } from 'expo-router';
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

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp, isLoading } = useAuthViewModel();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !fullName || !phoneNumber) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const success = await signUp(email, password, fullName, phoneNumber);

        if (success) {
            console.log("Registro completado. Redirigiendo...");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                    
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <Text style={styles.subtitle}>Únete a Huellitas AI</Text>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#3b5998" />
                    ) : (
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>Nombre Completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Juan Pérez"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="words"
                            />

                            <Text style={styles.label}>Número de Celular</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="987654321"
                                placeholderTextColor="#999"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Correo Electrónico</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ejemplo@correo.com"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <Text style={styles.label}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <TouchableOpacity 
                              style={styles.registerButton}
                              onPress={handleRegister}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.registerButtonText}>Registrarse</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                              onPress={() => router.back()} 
                              style={styles.backLink}
                            >
                                <Text style={styles.backText}>
                                  ¿Ya tienes cuenta? <Text style={styles.backTextBold}>Inicia sesión</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: 'center' },
    container: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20, 
      backgroundColor: '#fff' 
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 16,
    },
    title: { 
      fontSize: 28, 
      marginBottom: 8, 
      fontWeight: 'bold', 
      color: '#2c3e50' 
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 20,
      color: '#7f8c8d',
    },
    formContainer: { width: '100%' },
    label: { 
      marginBottom: 6, 
      color: '#555', 
      fontWeight: '600', 
      marginTop: 8,
      fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        borderRadius: 10,
        width: '100%',
        backgroundColor: '#f9f9f9',
        marginBottom: 12,
        fontSize: 16,
    },
    registerButton: {
      backgroundColor: '#FF9500',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    backLink: { 
      marginTop: 20, 
      alignItems: 'center', 
      marginBottom: 20 
    },
    backText: { 
      color: '#555', 
      fontSize: 14 
    },
    backTextBold: {
      color: '#3b5998',
      fontWeight: 'bold',
    },
});