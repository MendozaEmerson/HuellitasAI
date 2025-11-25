import { ReportType } from '@/src/models/reportmodel'; // Tipado
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Colores base (Ajustar a tu tema si es necesario)
const COLORS = {
    primary: '#3b5998',
    card: '#fff',
};

interface ReportTypeSelectorProps {
    reportType: ReportType;
    setReportType: (type: ReportType) => void;
}

export default function ReportTypeSelector({ reportType, setReportType }: ReportTypeSelectorProps) {
    return (
        <View style={typeSelectorStyles.container}>
            <TouchableOpacity
                style={[
                    typeSelectorStyles.button,
                    reportType === 'lost' && typeSelectorStyles.buttonActive
                ]}
                onPress={() => setReportType('lost')}
            >
                <Text style={[typeSelectorStyles.text, reportType === 'lost' && typeSelectorStyles.textActive]}>
                    I Lost a Pet
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    typeSelectorStyles.button,
                    reportType === 'found' && typeSelectorStyles.buttonActive
                ]}
                onPress={() => setReportType('found')}
            >
                <Text style={[typeSelectorStyles.text, reportType === 'found' && typeSelectorStyles.textActive]}>
                    I Found a Pet
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const typeSelectorStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 50,
        padding: 3,
        marginTop: 10,
        marginHorizontal: 15,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonActive: {
        backgroundColor: COLORS.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    textActive: {
        color: COLORS.primary,
    },
});
