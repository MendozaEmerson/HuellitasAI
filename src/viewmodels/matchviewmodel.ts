import { MatchResult } from '@/src/models/matchmodel';
import { matchService } from '@/src/services/matchservice';
import { useCallback, useEffect, useState } from 'react';

export const useMatchViewModel = () => {
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMatches = useCallback(async () => {
        try {
            setError(null);
            const data = await matchService.getMyMatches();
            setMatches(data);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Error al cargar coincidencias';
            setError(msg);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Cargar al montar
    useEffect(() => {
        loadMatches();
    }, [loadMatches]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadMatches();
    }, [loadMatches]);

    return {
        matches,
        isLoading,
        refreshing,
        error,
        onRefresh
    };
};
