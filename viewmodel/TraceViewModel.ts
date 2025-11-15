import { useState } from "react";
import { TracePoint } from "../model/TraceModel";

export const useTraceViewModel = () => {
    const [points, setPoints] = useState<TracePoint[]>([]);

    const handleTouchStart = (x: number, y: number) => {
        setPoints([{ x, y }]);
    };

    const handleTouchMove = (x: number, y: number) => {
        setPoints((prev) => [...prev, { x, y }]);
    };

    const clearTrace = () => setPoints([]);

    return { points, handleTouchStart, handleTouchMove, clearTrace };
};
