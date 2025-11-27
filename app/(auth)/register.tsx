import { useAuthViewModel } from '@/src/viewmodels/authviewmodel';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    // 1. Extraemos la función signUp del ViewModel (ahora acepta más argumentos)
    const { signUp, isLoading } = useAuthViewModel();

    // 2. Estados locales para el formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleRegister = async () => {
        // Validación básica
        if (!email || !password || !fullName || !phoneNumber) {
            alert("Por favor completa todos los campos.");
            return;
        }

        // 3. Llamada al ViewModel con todos los datos
        const success = await signUp(email, password, fullName, phoneNumber);

        if (success) {
            console.log("Registro completado. Redirigiendo...");
            // Dependiendo de tu flujo, el AuthContext podría redirigir automáticamente
            // o puedes hacerlo manualmente aquí si es necesario.
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Crear Cuenta</Text>

                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <View style={styles.formContainer}>

                            {/* Campo: Nombre Completo */}
                            <Text style={styles.label}>Nombre Completo</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Juan Pérez"
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="words"
                            />

                            {/* Campo: Teléfono */}
                            <Text style={styles.label}>Número de Celular</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="987654321"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />

                            {/* Campo: Correo */}
                            <Text style={styles.label}>Correo Electrónico</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            {/* Campo: Contraseña */}
                            <Text style={styles.label}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <View style={styles.buttonContainer}>
                                <Button title="Registrarse" onPress={handleRegister} />
                            </View>

                            <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                                <Text style={styles.backText}>¿Ya tienes cuenta? Volver al Login</Text>
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
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 28, marginBottom: 20, fontWeight: 'bold', color: '#333' },
    formContainer: { width: '100%' },
    label: { marginBottom: 5, color: '#555', fontWeight: '600', marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        backgroundColor: '#f9f9f9'
    },
    buttonContainer: { marginTop: 25 },
    backLink: { marginTop: 20, alignItems: 'center', marginBottom: 20 },
    backText: { color: '#007AFF', fontSize: 16 },
});
