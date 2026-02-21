import React from 'react';

export interface HeroContent {
    title: string;
    subtitle: string;
    backgroundImageUrl?: string;
    align?: 'left' | 'center' | 'right';
    customBgColor?: string;
    customTextColor?: string;
}

const HeroBlock: React.FC<{ content: HeroContent, isEditMode?: boolean }> = ({ content }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: content.align === 'center' ? 'center' : content.align === 'right' ? 'flex-end' : 'flex-start',
            padding: '40px',
            background: content.backgroundImageUrl ? `url(${content.backgroundImageUrl}) center/cover no-repeat` : content.customBgColor || 'var(--surface-color)',
            borderRadius: '16px',
            color: content.customTextColor || 'var(--text-color)',
            textAlign: content.align || 'left',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {content.backgroundImageUrl && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}></div>}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                    {content.title || '새로운 히어로 섹션'}
                </h2>
                <p style={{ fontSize: '1.2rem', margin: 0, opacity: 0.8, maxWidth: '600px' }}>
                    {content.subtitle || '히어로 섹션의 서브 타이틀을 입력하세요.'}
                </p>
            </div>
        </div>
    );
};

export default HeroBlock;
