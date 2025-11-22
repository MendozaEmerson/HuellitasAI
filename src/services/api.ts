import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Tu backend local
  : 'https://tu-api.run.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token inválido o expirado');
      // Opcional: podrían forzar logout aquí
    }
    return Promise.reject(error);
  }
);

export default api;
