import React from 'react';

export interface TextContent {
    text: string;
    customBgColor?: string;
    customTextColor?: string;
}

const TextBlock: React.FC<{ content: TextContent, isEditMode?: boolean }> = ({ content }) => {
    return (
        <div className="glass-panel" style={{
            width: '100%',
            height: '100%',
            padding: '24px',
            overflowY: 'auto',
            background: content.customBgColor || undefined,
            color: content.customTextColor || undefined
        }}>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '1.1rem' }}>
                {content.text || '여기에 텍스트 본문 내용을 입력하세요.'}
            </div>
        </div>
    );
};

export default TextBlock;
