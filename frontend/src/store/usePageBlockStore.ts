import { create } from 'zustand';

export type BlockType = 'hero' | 'text' | 'feature' | 'cardgrid' | 'cta';

export interface PageBlock {
    id: string;
    block_type: BlockType;
    content_data: any; // JSON representation of the block content
    layout_i: string;
    layout_x: number;
    layout_y: number;
    layout_w: number;
    layout_h: number;
}

interface PageBlockState {
    blocks: PageBlock[];
    fetchBlocks: () => Promise<void>;
    addBlock: (block: Omit<PageBlock, 'id' | 'layout_i'>) => Promise<void>;
    updateBlock: (id: string, updates: Partial<PageBlock>) => Promise<void>;
    deleteBlock: (id: string) => Promise<void>;
    updateLayouts: (layouts: any[]) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const usePageBlockStore = create<PageBlockState>((set, get) => ({
    blocks: [],
    fetchBlocks: async () => {
        try {
            const res = await fetch(`${API_URL}/api/blocks`, { cache: 'no-store' });
            if (res.ok) {
                const rawData = await res.json();
                const data = rawData.map((block: any) => {
                    let parsedContent = block.content_data;
                    if (typeof parsedContent === 'string') {
                        try {
                            parsedContent = JSON.parse(parsedContent);
                        } catch (e) {
                            console.error('JSON parse error for block', block.id, e);
                            parsedContent = {};
                        }
                    }
                    return {
                        ...block,
                        content_data: parsedContent || {}
                    };
                });
                set({ blocks: data });
            }
        } catch (error) {
            console.error('Failed to fetch blocks', error);
        }
    },
    addBlock: async (blockParams) => {
        const newId = crypto.randomUUID();
        const newBlock: PageBlock = {
            ...blockParams,
            id: newId,
            layout_i: newId
        };

        // Optimistic update
        set({ blocks: [...get().blocks, newBlock] });

        try {
            await fetch(`${API_URL}/api/blocks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBlock)
            });
        } catch (error) {
            console.error('Failed to add block', error);
        }
    },
    updateBlock: async (id, updates) => {
        set({
            blocks: get().blocks.map((b) => (b.id === id ? { ...b, ...updates } : b))
        });
        try {
            await fetch(`${API_URL}/api/blocks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
        } catch (error) {
            console.error('Failed to update block', error);
        }
    },
    deleteBlock: async (id) => {
        set({
            blocks: get().blocks.filter((b) => b.id !== id)
        });
        try {
            await fetch(`${API_URL}/api/blocks/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Failed to delete block', error);
        }
    },
    updateLayouts: async (layouts) => {
        const newBlocks = get().blocks.map((block) => {
            const layoutMatch = layouts.find((l: any) => l.i === block.id);
            if (layoutMatch) {
                return {
                    ...block,
                    layout_x: layoutMatch.x,
                    layout_y: layoutMatch.y,
                    layout_w: layoutMatch.w,
                    layout_h: layoutMatch.h
                };
            }
            return block;
        });
        set({ blocks: newBlocks });

        try {
            const updates = layouts.map((l: any) => ({
                id: l.i,
                layout_x: l.x,
                layout_y: l.y,
                layout_w: l.w,
                layout_h: l.h
            }));
            await fetch(`${API_URL}/api/blocks-batch`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blocks: updates })
            });
        } catch (error) {
            console.error('Failed to batch update layouts', error);
        }
    }
}));
