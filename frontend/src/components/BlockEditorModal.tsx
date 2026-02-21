import React, { useState, useEffect } from 'react';
import type { PageBlock } from '../store/usePageBlockStore';

interface BlockEditorModalProps {
    block: PageBlock;
    onSave: (id: string, newContent: any) => void;
    onClose: () => void;
}

const BlockEditorModal: React.FC<BlockEditorModalProps> = ({ block, onSave, onClose }) => {
    const [formData, setFormData] = useState<any>(block.content_data || {});

    // Initialize formatting based on type just in case
    useEffect(() => {
        setFormData(block.content_data || {});
    }, [block]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(block.id, formData);
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.2)', outline: 'none',
        background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '14px', marginBottom: '16px'
    };

    const labelStyle = { display: 'block', fontSize: '13px', marginBottom: '6px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 };

    const renderFormFields = () => {
        switch (block.block_type) {
            case 'hero':
                return (
                    <>
                        <label style={labelStyle}>메인 타이틀 (Title)</label>
                        <input name="title" value={formData.title || ''} onChange={handleChange} style={inputStyle} placeholder="메인 제목을 입력하세요" />

                        <label style={labelStyle}>서브 타이틀 (Subtitle)</label>
                        <textarea name="subtitle" value={formData.subtitle || ''} onChange={handleChange} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="설명이나 부제목을 입력하세요" />

                        <label style={labelStyle}>정렬 방식 (Align)</label>
                        <select name="align" value={formData.align || 'center'} onChange={handleChange} style={inputStyle}>
                            <option value="left" style={{ color: 'black' }}>왼쪽 (Left)</option>
                            <option value="center" style={{ color: 'black' }}>중앙 (Center)</option>
                            <option value="right" style={{ color: 'black' }}>오른쪽 (Right)</option>
                        </select>
                    </>
                );
            case 'text':
                return (
                    <>
                        <label style={labelStyle}>본문 텍스트 (Text)</label>
                        <textarea name="text" value={formData.text || ''} onChange={handleChange} style={{ ...inputStyle, height: '200px', resize: 'vertical' }} placeholder="본문 내용을 자유롭게 작성하세요." />
                    </>
                );
            case 'feature':
                return (
                    <>
                        <label style={labelStyle}>기능 이름/제목 (Title)</label>
                        <input name="title" value={formData.title || ''} onChange={handleChange} style={inputStyle} />

                        <label style={labelStyle}>기능 설명 (Description)</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />

                        <label style={labelStyle}>아이콘 이름 (Feather Core Icon, English)</label>
                        <input name="iconName" value={formData.iconName || 'Star'} onChange={handleChange} style={inputStyle} placeholder="Star, Heart, Layout..." />

                        <label style={labelStyle}>이미지/아이콘 위치</label>
                        <select name="imageAlign" value={formData.imageAlign || 'left'} onChange={handleChange} style={inputStyle}>
                            <option value="left" style={{ color: 'black' }}>왼쪽 (Left)</option>
                            <option value="right" style={{ color: 'black' }}>오른쪽 (Right)</option>
                        </select>
                    </>
                );
            case 'cardgrid':
                return (
                    <>
                        <label style={labelStyle}>단열 그리드 컬럼 수</label>
                        <select name="columns" value={formData.columns || 3} onChange={handleChange} style={inputStyle}>
                            <option value={2} style={{ color: 'black' }}>2개씩 보기</option>
                            <option value={3} style={{ color: 'black' }}>3개씩 보기</option>
                            <option value={4} style={{ color: 'black' }}>4개씩 보기</option>
                        </select>
                        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '13px', color: '#ccc' }}>
                            * 현재 데모 버전에서는 배열 편집(항목 추가/삭제)은 간소화되어 임시 데이터만 랜더링됩니다. 상세 에디터는 추후 업데이트됩니다. (현재 저장 시 기본값 유지)
                        </div>
                    </>
                );
            case 'cta':
                return (
                    <>
                        <label style={labelStyle}>유도 문구 (Title)</label>
                        <input name="title" value={formData.title || ''} onChange={handleChange} style={inputStyle} />

                        <label style={labelStyle}>버튼 텍스트 (Button Text)</label>
                        <input name="buttonText" value={formData.buttonText || ''} onChange={handleChange} style={inputStyle} />

                        <label style={labelStyle}>연결 링크 (Link URL)</label>
                        <input name="linkUrl" value={formData.linkUrl || '#'} onChange={handleChange} style={inputStyle} placeholder="https://..." />
                    </>
                );
            default:
                return <p>지원되지 않는 블록 타입입니다.</p>;
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div className="glass-panel" style={{ width: '500px', maxWidth: '90%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                    블록 내용 수정 ({block.block_type})
                </h2>

                <div style={{ marginBottom: '24px' }}>
                    {renderFormFields()}
                </div>

                <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '16px', color: 'rgba(255,255,255,0.9)' }}>개별 카드 디자인 오버라이드 (선택)</h3>

                    <label style={labelStyle}>배경 색상 (Background Color)</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
                        <input type="color" name="customBgColor" value={formData.customBgColor || '#1e293b'} onChange={(e) => setFormData((prev: any) => ({ ...prev, customBgColor: e.target.value }))} style={{ width: '36px', height: '36px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }} />
                        <input type="text" name="customBgColor" value={formData.customBgColor || ''} onChange={handleChange} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="#1e293b, rgba(...) 등 (입력 시 해당 카드만 변경)" />
                    </div>

                    <label style={labelStyle}>글자 색상 (Text Color)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="color" name="customTextColor" value={formData.customTextColor || '#ffffff'} onChange={(e) => setFormData((prev: any) => ({ ...prev, customTextColor: e.target.value }))} style={{ width: '36px', height: '36px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px' }} />
                        <input type="text" name="customTextColor" value={formData.customTextColor || ''} onChange={handleChange} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="#ffffff 등" />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        style={{ padding: '10px 24px', borderRadius: '8px', background: 'white', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                    >
                        적용하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockEditorModal;
