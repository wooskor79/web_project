
import React, { useEffect } from 'react';
import { Responsive } from 'react-grid-layout';
const ResponsiveGridLayout = Responsive;
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { usePageBlockStore } from '../store/usePageBlockStore';
import type { BlockType, PageBlock } from '../store/usePageBlockStore';
import BlockRenderer from '../components/blocks/BlockRenderer';
import ThemeSelector from '../components/ThemeSelector';
import BlockEditorModal from '../components/BlockEditorModal';
import { Link } from 'react-router-dom';
import * as Feather from 'react-feather';

const AdminBoard: React.FC = () => {
    const { blocks, fetchBlocks, updateLayouts, deleteBlock, addBlock, updateBlock } = usePageBlockStore();

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    const handleLayoutChange = (layout: any) => {
        updateLayouts(layout);
    };

    const handleAddBlock = (type: BlockType, label: string) => {
        // 디폴트 컨텐츠 세팅
        let defaultContent = {};
        if (type === 'hero') defaultContent = { title: `새로운 ${label} `, subtitle: '서브 타이틀입니다.', align: 'center' };
        if (type === 'text') defaultContent = { text: '글을 입력하세요...' };
        if (type === 'feature') defaultContent = { title: label, description: '기능을 설명합니다.', iconName: 'Star', imageAlign: 'left' };
        if (type === 'cardgrid') defaultContent = { columns: 3, items: [{ id: '1', title: '항목1', summary: '요약1' }, { id: '2', title: '항목2', summary: '요약2' }] };
        if (type === 'cta') defaultContent = { title: '행동을 유도해보세요.', buttonText: '버튼' };

        addBlock({
            block_type: type,
            content_data: defaultContent,
            layout_x: 0,
            layout_y: Infinity,
            layout_w: 12, // 전체 너비 기본값
            layout_h: type === 'hero' ? 6 : type === 'text' ? 4 : type === 'feature' ? 5 : type === 'cardgrid' ? 6 : 4
        });
    }

    const BLOCK_TYPES: { type: BlockType, label: string, icon: any }[] = [
        { type: 'hero', label: 'Hero Section', icon: Feather.Image },
        { type: 'text', label: 'Text Block', icon: Feather.FileText },
        { type: 'feature', label: 'Feature Box', icon: Feather.Layout },
        { type: 'cardgrid', label: 'Card Grid', icon: Feather.Grid },
        { type: 'cta', label: 'CTA Button', icon: Feather.MousePointer },
    ];

    const [editingBlock, setEditingBlock] = React.useState<PageBlock | null>(null);
    const [isThemeModalOpen, setIsThemeModalOpen] = React.useState(false);

    const handleEditClick = (block: PageBlock) => {
        setEditingBlock(block);
    };

    const handleSaveEdit = (id: string, newContent: any) => {
        updateBlock(id, { content_data: newContent });
        setEditingBlock(null);
    };

    return (
        <div style={{ maxWidth: '100%', width: '100%', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0' }}>Admin Dashboard</h1>
                    <p style={{ margin: 0, opacity: 0.8 }}>블로그 페이지 빌더 - 블록을 추가하고 레이아웃을 구성하세요.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setIsThemeModalOpen(true)} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <Feather.Sliders size={18} /> 디자인/테마
                    </button>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', borderRadius: '8px', background: 'var(--text-color)', color: 'var(--primary-bg)',
                            fontSize: '15px', fontWeight: 'bold', cursor: 'pointer'
                        }}>
                            <Feather.Eye size={18} /> View Home
                        </button>
                    </Link>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                {/* Sidebar Toolbar */}
                <div className="glass-panel" style={{ width: '260px', padding: '20px', flexShrink: 0 }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Feather.PlusCircle size={18} /> 블록 추가
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {BLOCK_TYPES.map(bt => (
                            <button key={bt.type} onClick={() => handleAddBlock(bt.type, bt.label)} style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                                background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer', transition: 'background 0.2s', textAlign: 'left', color: 'var(--text-color)'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            >
                                <bt.icon size={18} opacity={0.8} />
                                <span style={{ fontWeight: 500 }}>{bt.label}</span>
                            </button>
                        ))}
                    </div>
                    <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '24px', lineHeight: 1.5 }}>
                        원하는 블록을 클릭하여 우측 에디터 보드 맨 아래에 추가하세요. 블록을 자유롭게 드래그하여 배치할 수 있습니다.
                    </p>
                </div>

                {/* Editor Board Area */}
                <div style={{ flex: 1, minWidth: 0, width: '100%', minHeight: '600px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '16px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                    <ResponsiveGridLayout
                        {...({
                            className: "layout",
                            layout: blocks.map((b: any) => ({ i: b.id, x: b.layout_x || 0, y: b.layout_y || 0, w: b.layout_w || 12, h: b.layout_h || 4 })),
                            cols: 12,
                            rowHeight: 40,
                            onLayoutChange: handleLayoutChange,
                            draggableCancel: ".nodrag"
                        } as any)}
                    >
                        {blocks.map(block => (
                            <div key={block.id} style={{ position: 'relative' }}>
                                {/* Action Buttons */}
                                <div className="glass-panel" style={{ height: '100%', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
                                        <button
                                            className="nodrag"
                                            onClick={() => handleEditClick(block)}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
                                                padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}
                                        >
                                            <Feather.Edit2 size={14} color="white" />
                                        </button>
                                        <button
                                            className="nodrag"
                                            onClick={() => deleteBlock(block.id)}
                                            style={{
                                                background: 'rgba(255,50,50,0.6)', borderRadius: '50%',
                                                padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}
                                        >
                                            <Feather.Trash2 size={14} color="white" />
                                        </button>
                                    </div>
                                    <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                                        <BlockRenderer block={block} isEditMode={true} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                </div>
            </div>

            {editingBlock && (
                <BlockEditorModal
                    block={editingBlock}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingBlock(null)}
                />
            )}

            {isThemeModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, backdropFilter: 'blur(2px)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '24px'
                }}>
                    <div className="glass-panel" style={{ width: '320px', position: 'relative', marginTop: '60px' }}>
                        <button onClick={() => setIsThemeModalOpen(false)} style={{
                            position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                        >
                            <Feather.X size={20} />
                        </button>
                        <ThemeSelector />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBoard;
