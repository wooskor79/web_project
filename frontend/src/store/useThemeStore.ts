import { create } from 'zustand';

export interface GlobalTheme {
    theme_type: 'preset' | 'custom';
    preset_name: string;
    custom_primary_bg: string | null;
    custom_surface_color: string | null;
    custom_text_color: string | null;
}

interface ThemeState {
    theme: GlobalTheme;
    fetchTheme: () => Promise<void>;
    updateTheme: (newTheme: Partial<GlobalTheme>) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: {
        theme_type: 'preset',
        preset_name: 'Midnight Blue',
        custom_primary_bg: null,
        custom_surface_color: null,
        custom_text_color: null
    },
    fetchTheme: async () => {
        try {
            const res = await fetch(`${API_URL}/api/theme`);
            if (res.ok) {
                const data = await res.json();
                set({ theme: { ...get().theme, ...data } });
            }
        } catch (error) {
            console.error('Failed to fetch theme', error);
        }
    },
    updateTheme: async (newThemeData) => {
        const updatedTheme = { ...get().theme, ...newThemeData };
        set({ theme: updatedTheme });
        try {
            await fetch(`${API_URL}/api/theme`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTheme)
            });
        } catch (error) {
            console.error('Failed to update theme', error);
        }
    }
}));
