import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useTraceViewModel } from "../../viewmodel/TraceViewModel";

const { width, height } = Dimensions.get("window");

export const MotricidadFinaScreen = () => {
    // 🔹 Lógica separada en el ViewModel (maneja puntos y eventos táctiles)
    const { points, handleTouchStart, handleTouchMove, clearTrace } =
        useTraceViewModel();

    // 🔹 Configuración de gestos táctiles
    const gesture = Gesture.Pan()
        .onStart((g) => handleTouchStart(g.x, g.y))
        .onUpdate((g) => handleTouchMove(g.x, g.y));

    // 🔹 Creación del Path (trazo)
    const path = Skia.Path.Make();
    if (points.length > 0) {
        path.moveTo(points[0].x, points[0].y);
        points.forEach((p) => path.lineTo(p.x, p.y));
    }

    return (
        <View style={styles.container}>
            {/* Imagen de fondo opcional: puede ser una ruta o figura a seguir */}
            <Image
                source={require("../../assets/trace_guides/trazado.jpg")}
                style={styles.backgroundImage}
                resizeMode="contain"
            />

            {/* Zona de dibujo táctil */}
            <GestureDetector gesture={gesture}>
                <Canvas style={styles.canvas}>
                    <Path
                        path={path}
                        color="#4285F4"
                        style="stroke"
                        strokeWidth={6}
                        strokeCap="round"
                        strokeJoin="round"
                    />
                </Canvas>
            </GestureDetector>
        </View>
    );
};

// 🎨 Estilos visuales de la vista
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
    },
    backgroundImage: {
        position: "absolute",
        width: width * 0.9,
        height: height * 0.6,
        opacity: 0.25,
    },
    canvas: {
        width: width * 0.9,
        height: height * 0.6,
        backgroundColor: "transparent",
    },
});
