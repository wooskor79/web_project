import React from 'react';
import * as Feather from 'react-feather';

export interface CTAContent {
    title: string;
    buttonText: string;
    buttonLink?: string;
    customBgColor?: string;
    customTextColor?: string;
}

const CTABlock: React.FC<{ content: CTAContent, isEditMode?: boolean }> = ({ content }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '32px',
            background: content.customBgColor || 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.0))',
            color: content.customTextColor || undefined,
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '16px',
            textAlign: 'center'
        }}>
            <h3 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 24px 0' }}>
                {content.title || '지금 바로 시작해보세요!'}
            </h3>
            <button style={{
                padding: '12px 32px',
                backgroundColor: 'var(--text-color)',
                color: 'var(--primary-bg)',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                transition: 'transform 0.2s ease'
            }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {content.buttonText || 'Click Here'} <Feather.ArrowRight size={18} />
            </button>
        </div>
    );
};

export default CTABlock;
