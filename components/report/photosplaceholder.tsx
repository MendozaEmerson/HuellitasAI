import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Colores base (Ajustar a tu tema si es necesario)
const COLORS = {
    primary: '#3b5998',
    secondary: '#ff8c00',
    card: '#fff',
    text: '#333',
    placeholder: '#999',
    border: '#ddd',
};

interface PhotosPlaceholderProps {
    imageUri: string | null;
    onUploadPress: () => void;
}

export default function PhotosPlaceholder({ imageUri, onUploadPress }: PhotosPlaceholderProps) {
    return (
        <View style={photosStyles.container}>
            <View style={photosStyles.placeholderBox}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={photosStyles.imagePreview} />
                ) : (
                    <View style={photosStyles.uploadContent}>
                        <AntDesign name="camera" size={40} color={COLORS.secondary} />
                        <Text style={photosStyles.title}>Add Photos</Text>
                        <Text style={photosStyles.subtitle}>Upload clear photos of the pet</Text>
                    </View>
                )}

                {/* Botón de Carga / Reemplazo */}
                <TouchableOpacity
                    style={photosStyles.uploadButton}
                    onPress={onUploadPress}
                >
                    <Text style={photosStyles.uploadText}>
                        {imageUri ? 'Change Photo' : 'Upload'}
                    </Text>
                </TouchableOpacity>

                {imageUri && (
                    <TouchableOpacity onPress={onUploadPress} style={photosStyles.replaceButton}>
                        <Text style={photosStyles.replaceText}>Tap to replace</Text>
                    </TouchableOpacity>
                )}

            </View>
        </View>
    );
}

const photosStyles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: COLORS.card,
        borderRadius: 15,
        marginHorizontal: 15,
        marginTop: 20,
        marginBottom: 20,
        borderColor: COLORS.border,
        borderWidth: 1,
    },
    placeholderBox: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        borderRadius: 10,
        minHeight: 150,
    },
    uploadContent: {
        alignItems: 'center',
        padding: 20,
    },
    imagePreview: {
        width: '100%',
        height: 250,
        borderRadius: 8,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 5,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.placeholder,
        marginBottom: 15,
    },
    uploadButton: {
        backgroundColor: '#ffc107',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 50,
        marginTop: 10,
        shadowColor: '#ffc107',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    uploadText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
    replaceButton: {
        marginTop: 5,
    },
    replaceText: {
        fontSize: 12,
        color: COLORS.primary,
        textDecorationLine: 'underline',
    }
});
