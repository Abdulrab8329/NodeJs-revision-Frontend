import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function LoginPage({ onGuest }) {
    const { login, signup } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        try {
            if (isLogin) await login(username, password);
            else await signup(username, password);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f1117', color: '#fff' }}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                style={{ padding: '10px', margin: '8px', borderRadius: '6px', border: '1px solid #334155', background: '#1a1d2e', color: '#fff', width: '260px' }} />

            <div style={{ position: "relative", width: "260px" }}>
                <input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                        padding: "10px",
                        margin: "8px 0",
                        borderRadius: "6px",
                        border: "1px solid #334155",
                        background: "#1a1d2e",
                        color: "#fff",
                        width: "100%",
                        paddingRight: "40px"
                    }}
                />

                <span
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#94a3b8",
                        transition: "0.2s"
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
            {error && <p style={{ color: '#f87171', fontSize: '13px' }}>{error}</p>}

            <button
                onClick={handleSubmit}
                style={{
                    padding: '10px 24px',
                    margin: '8px',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#000',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '280px',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(34,197,94,0.4)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
                {isLogin ? 'Login' : 'Sign Up'}
            </button>

            <button onClick={() => setIsLogin(!isLogin)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>

            <button
                onClick={onGuest}
                style={{
                    background: 'none',
                    border: '1px solid #334155',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    marginTop: '8px',
                    fontSize: '13px',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#22c55e";
                    e.currentTarget.style.color = "#22c55e";
                    e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#334155";
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                Continue as Guest →
            </button>
        </div>
    );
}