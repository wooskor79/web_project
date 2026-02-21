import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BlogHome from './pages/BlogHome';
import AdminBoard from './pages/AdminBoard';
import Setup from './pages/Setup';
import Login from './pages/Login';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { theme, fetchTheme } = useThemeStore();

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const PRESET_COLORS: Record<string, { bg: string, surface: string, text: string }> = {
    'Midnight Blue': { bg: '#0f172a', surface: 'rgba(30, 41, 59, 0.4)', text: '#f8fafc' },
    'Aurora Green': { bg: '#064e3b', surface: 'rgba(6, 95, 70, 0.4)', text: '#ecfdf5' },
    'Sunset Orange': { bg: '#7c2d12', surface: 'rgba(154, 52, 18, 0.4)', text: '#fff7ed' },
    'Monochrome Glass': { bg: '#18181b', surface: 'rgba(39, 39, 42, 0.5)', text: '#fafafa' }
  };

  useEffect(() => {
    // 전역 테마 상태를 DOM style 객체로 직접 주입하여 CSS 스코프 문제를 원천 차단
    if (theme.theme_type === 'preset' && PRESET_COLORS[theme.preset_name]) {
      const colors = PRESET_COLORS[theme.preset_name];
      document.documentElement.style.setProperty('--primary-bg', colors.bg);
      document.documentElement.style.setProperty('--surface-color', colors.surface);
      document.documentElement.style.setProperty('--text-color', colors.text);
      document.body.style.setProperty('--primary-bg', colors.bg);
      document.body.style.setProperty('--surface-color', colors.surface);
      document.body.style.setProperty('--text-color', colors.text);
    } else {
      if (theme.custom_primary_bg) {
        document.documentElement.style.setProperty('--primary-bg', theme.custom_primary_bg);
        document.body.style.setProperty('--primary-bg', theme.custom_primary_bg);
      }
      if (theme.custom_surface_color) {
        document.documentElement.style.setProperty('--surface-color', theme.custom_surface_color);
        document.body.style.setProperty('--surface-color', theme.custom_surface_color);
      }
      if (theme.custom_text_color) {
        document.documentElement.style.setProperty('--text-color', theme.custom_text_color);
        document.body.style.setProperty('--text-color', theme.custom_text_color);
      }
    }
  }, [theme]);

  return (
    <Router>
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--primary-bg)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.5, zIndex: -1 }}></div>
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50%', height: '50%', background: 'var(--surface-color)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.8, zIndex: -1 }}></div>

      <Routes>
        <Route path="/" element={<BlogHome />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/setup.php" element={<Navigate to="/setup" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminBoard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
