export interface TracePoint {
    x: number;
    y: number;
}

export interface TracePath {
    id: string;
    points: TracePoint[];
    imageBackground?: string; // opcional, una imagen de fondo con la ruta a seguir
}
