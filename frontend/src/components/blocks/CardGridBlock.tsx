import React from 'react';

export interface CardGridItem {
    id: string;
    title: string;
    summary: string;
}

export interface CardGridContent {
    items: CardGridItem[];
    columns?: number;
    customBgColor?: string;
    customTextColor?: string;
}

const CardGridBlock: React.FC<{ content: CardGridContent, isEditMode?: boolean }> = ({ content }) => {
    const items = content.items && content.items.length > 0
        ? content.items
        : [
            { id: '1', title: '항목 1', summary: '첫 번째 항목 요약' },
            { id: '2', title: '항목 2', summary: '두 번째 항목 요약' },
            { id: '3', title: '항목 3', summary: '세 번째 항목 요약' }
        ];

    const cols = content.columns || 3;

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '16px',
            overflowY: 'auto',
            padding: '4px'
        }}>
            {items.map(item => (
                <div key={item.id} className="glass-panel" style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: content.customBgColor || 'rgba(255,255,255,0.03)',
                    color: content.customTextColor || undefined
                }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>{item.summary}</p>
                </div>
            ))}
        </div>
    );
};

export default CardGridBlock;
