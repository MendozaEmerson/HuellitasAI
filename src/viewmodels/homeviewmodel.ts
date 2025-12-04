import { feedService, LostReport } from '@/src/services/feedservice';
import { useCallback, useEffect, useState } from 'react';
import { useAuthViewModel } from './authviewmodel';

export const useHomeViewModel = () => {
    const [reports, setReports] = useState<LostReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { signOut } = useAuthViewModel();

    const loadReports = async () => {
        // Si estamos refrescando, no mostramos el spinner de carga completa
        if (!refreshing) setIsLoading(true);

        try {
            setError(null);
            const data = await feedService.getLostReports();
            setReports(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error de conexión');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadReports(); // El estado refreshing se maneja dentro de loadReports
    }, []);

    // Filtro local por búsqueda
    const filteredReports = reports.filter(report =>
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.breed.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        reports: filteredReports,
        isLoading,
        refreshing,
        error,
        searchQuery,
        setSearchQuery,
        onRefresh,
        signOut
    };
};
