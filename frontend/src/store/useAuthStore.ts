import { create } from 'zustand';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    const token = localStorage.getItem('adminToken');
    return {
        token,
        isAuthenticated: !!token,
        login: (newToken: string) => {
            localStorage.setItem('adminToken', newToken);
            set({ token: newToken, isAuthenticated: true });
        },
        logout: () => {
            localStorage.removeItem('adminToken');
            set({ token: null, isAuthenticated: false });
        }
    };
});
