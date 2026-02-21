import React from 'react';
import * as Feather from 'react-feather';

export interface FeatureContent {
    title: string;
    description: string;
    iconName?: string; // e.g., 'Cpu', 'Database', 'Layout'
    imageAlign?: 'left' | 'right';
    customBgColor?: string;
    customTextColor?: string;
}

const FeatureBlock: React.FC<{ content: FeatureContent, isEditMode?: boolean }> = ({ content }) => {
    const Icon = content.iconName && (Feather as any)[content.iconName]
        ? (Feather as any)[content.iconName]
        : Feather.Star;

    const textSection = (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0' }}>{content.title || '새로운 주요 기능'}</h3>
            <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.6 }}>{content.description || '이 기능에 대한 상세한 설명을 적어보세요.'}</p>
        </div>
    );

    const visualSection = (
        <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            minHeight: '160px'
        }}>
            <Icon size={64} style={{ opacity: 0.8 }} />
        </div>
    );

    return (
        <div className="glass-panel" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: content.imageAlign === 'right' ? 'row' : 'row-reverse',
            gap: '24px',
            padding: '24px',
            alignItems: 'stretch',
            background: content.customBgColor || undefined,
            color: content.customTextColor || undefined
        }}>
            {visualSection}
            {textSection}
        </div>
    );
};

export default FeatureBlock;
