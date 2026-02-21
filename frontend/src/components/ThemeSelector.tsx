import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { isValidHexColor } from '../utils/themeUtils';
import * as Feather from 'react-feather';

const PRESETS = ['Midnight Blue', 'Aurora Green', 'Sunset Orange', 'Monochrome Glass'];

const ThemeSelector: React.FC = () => {
    const { theme, updateTheme } = useThemeStore();

    const handlePresetSelect = (preset: string) => {
        updateTheme({ theme_type: 'preset', preset_name: preset });
        document.documentElement.setAttribute('data-theme', preset);
        // remove custom overrides
        document.documentElement.style.removeProperty('--primary-bg');
        document.documentElement.style.removeProperty('--surface-color');
        document.documentElement.style.removeProperty('--text-color');
    };

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'custom_primary_bg' | 'custom_surface_color' | 'custom_text_color') => {
        const val = e.target.value;
        if (isValidHexColor(val)) {
            updateTheme({ theme_type: 'custom', [key]: val });
            const cssVar = key === 'custom_primary_bg' ? '--primary-bg'
                : key === 'custom_surface_color' ? '--surface-color'
                    : '--text-color';
            document.documentElement.style.setProperty(cssVar, val);
            document.documentElement.removeAttribute('data-theme');
        }
    };

    return (
        <div style={{ padding: '16px', color: 'white' }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
                <Feather.Sliders size={16} /> 테마 프리셋
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                {PRESETS.map(preset => (
                    <button
                        key={preset}
                        onClick={() => handlePresetSelect(preset)}
                        style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            border: `1px solid ${theme.preset_name === preset && theme.theme_type === 'preset' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}`,
                            background: theme.preset_name === preset && theme.theme_type === 'preset' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
                            color: 'white',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                    >
                        {preset}
                    </button>
                ))}
            </div>

            <h3 style={{ marginTop: 0, fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>커스텀 컬러 (Hex)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Primary BG</label>
                    <input
                        type="text"
                        placeholder="#000000"
                        defaultValue={theme.custom_primary_bg || ''}
                        onChange={(e) => handleCustomColorChange(e, 'custom_primary_bg')}
                        style={{ width: '100px', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', background: 'rgba(0,0,0,0.3)', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Surface</label>
                    <input
                        type="text"
                        placeholder="rgba() or #HEX"
                        defaultValue={theme.custom_surface_color || ''}
                        onChange={(e) => handleCustomColorChange(e, 'custom_surface_color')}
                        style={{ width: '100px', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', background: 'rgba(0,0,0,0.3)', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Text</label>
                    <input
                        type="text"
                        placeholder="#ffffff"
                        defaultValue={theme.custom_text_color || ''}
                        onChange={(e) => handleCustomColorChange(e, 'custom_text_color')}
                        style={{ width: '100px', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', background: 'rgba(0,0,0,0.3)', color: 'white', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;
