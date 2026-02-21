import React, { useEffect } from 'react';
import { usePageBlockStore } from '../store/usePageBlockStore';
import BlockRenderer from '../components/blocks/BlockRenderer';
import ReactGridLayout from 'react-grid-layout';
import { WidthProvider } from '../utils/WidthProvider';
const ResponsiveGridLayout = WidthProvider(ReactGridLayout);
import 'react-grid-layout/css/styles.css';
import { Link } from 'react-router-dom';
import * as Feather from 'react-feather';

const BlogHome: React.FC = () => {
    const { blocks, fetchBlocks } = usePageBlockStore();

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    // 그리드 레이아웃의 y값 우선, 같으면 x값 우선으로 정렬하여 위에서 아래로 렌더링합니다
    const sortedBlocks = [...blocks].sort((a, b) => {
        if (a.layout_y === b.layout_y) {
            return (a.layout_x || 0) - (b.layout_x || 0);
        }
        return (a.layout_y || 0) - (b.layout_y || 0);
    });

    return (
        <div style={{ maxWidth: '100%', width: '100%', margin: '0 auto', padding: '0 24px 80px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>My Personal Blog</h1>
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', cursor: 'pointer'
                    }}>
                        <Feather.Settings size={16} /> Admin Mode
                    </button>
                </Link>
            </header>

            <div style={{ background: 'rgba(0,0,0,0.1)', borderRadius: '16px', padding: '16px', minHeight: '600px', width: '100%', minWidth: 0 }}>
                {blocks.length > 0 ? (
                    <ResponsiveGridLayout
                        className="layout"
                        layout={blocks.map((b: any) => ({ i: b.id, x: b.layout_x || 0, y: b.layout_y || 0, w: b.layout_w || 12, h: b.layout_h || 4, static: true }))}
                        cols={12}
                        rowHeight={40}
                        isDraggable={false}
                        isResizable={false}
                    >
                        {blocks.map(block => (
                            <div key={block.id} style={{ width: '100%', height: '100%' }}>
                                <BlockRenderer block={block} isEditMode={false} />
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                ) : null}
            </div>

            {sortedBlocks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
                    <p>표시할 블록이 없습니다. Admin에서 페이지를 구성해주세요.</p>
                </div>
            )}
        </div>
    );
};

export default BlogHome;
