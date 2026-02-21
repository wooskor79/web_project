import React from 'react';
import type { PageBlock } from '../../store/usePageBlockStore';
import HeroBlock from './HeroBlock';
import TextBlock from './TextBlock';
import FeatureBlock from './FeatureBlock';
import CardGridBlock from './CardGridBlock';
import CTABlock from './CTABlock';

interface BlockRendererProps {
    block: PageBlock;
    isEditMode?: boolean;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, isEditMode = false }) => {
    const content = block.content_data || {};

    switch (block.block_type) {
        case 'hero':
            return <HeroBlock content={content} isEditMode={isEditMode} />;
        case 'text':
            return <TextBlock content={content} isEditMode={isEditMode} />;
        case 'feature':
            return <FeatureBlock content={content} isEditMode={isEditMode} />;
        case 'cardgrid':
            return <CardGridBlock content={content} isEditMode={isEditMode} />;
        case 'cta':
            return <CTABlock content={content} isEditMode={isEditMode} />;
        default:
            return (
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>Unknown Block Type: {block.block_type}</div>
                </div>
            );
    }
};

export default BlockRenderer;
