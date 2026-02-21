import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Setup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/api/setup/status`);
                const data = await res.json();
                if (data.isSetup) {
                    navigate('/login');
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError('서버에 연결할 수 없습니다. 백엔드 상태를 확인해주세요.');
                setLoading(false);
            }
        };
        checkStatus();
    }, [navigate, API_URL]);

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                alert('관리자 계정이 생성되었습니다. 로그인 페이지로 이동합니다.');
                navigate('/login');
            } else {
                setError(data.error || '계정 생성에 실패했습니다.');
            }
        } catch (err) {
            setError('요청 처리 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>설정 상태 확인 중...</div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--primary-bg)', color: 'var(--text-color)' }}>
            <form onSubmit={handleSetup} className="glass-panel" style={{ width: '400px', padding: '32px', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>관리자 초기 설정</h2>
                <p style={{ fontSize: '14px', marginBottom: '24px', opacity: 0.8, textAlign: 'center' }}>
                    웹사이트의 최고 관리자 계정을 생성합니다.<br />최초 1회만 설정할 수 있습니다.
                </p>

                {error && <div style={{ background: 'rgba(255, 50, 50, 0.2)', border: '1px solid red', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>아이디 (Username)</label>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    required
                />

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>비밀번호 (Password)</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    required
                />

                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'white', color: 'black', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer' }}>
                    관리자 계정 생성
                </button>
            </form>
        </div>
    );
};

export default Setup;
