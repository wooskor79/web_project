import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { login, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // 앱이 이미 로그인된 상태면 리다이렉트
        if (isAuthenticated) {
            navigate('/admin');
            return;
        }

        // 셋업이 필요한지 확인
        const checkStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/api/setup/status`);
                const data = await res.json();
                if (!data.isSetup) {
                    navigate('/setup');
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setError('서버 연결 오류');
                setLoading(false);
            }
        };
        checkStatus();
    }, [isAuthenticated, navigate, API_URL]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success && data.token) {
                login(data.token);
                navigate('/admin');
            } else {
                setError(data.error || '접근이 거부되었습니다.');
            }
        } catch (err) {
            setError('로그인 처리 중 오류 발생');
        }
    };

    if (loading) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--primary-bg)', color: 'var(--text-color)' }}>
            <form onSubmit={handleLogin} className="glass-panel" style={{ width: '400px', padding: '32px', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>Admin Login</h2>

                {error && <div style={{ background: 'rgba(255, 50, 50, 0.2)', border: '1px solid red', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>아이디</label>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    required
                />

                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>비밀번호</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    required
                />

                <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'white', color: 'black', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer' }}>
                    로그인
                </button>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <a href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>&larr; 홈으로 돌아가기</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
