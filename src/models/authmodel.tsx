// --- Definición del Modelo/Contrato (M) ---
// (Define la "forma" del ViewModel que la Vista espera)

export interface AuthViewModel {
    isAuthenticated: boolean;
    isLoading: boolean;
    signUp: (email: string, pass: string) => Promise<boolean>;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => Promise<void>;
}
