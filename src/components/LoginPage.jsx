import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";

export default function LoginPage({ onGuest }) {
    const { login, signup } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            if (isLogin) await login(username, password);
            else await signup(username, password);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="login-subtitle">{isLogin ? 'Continue to Node Revision Course' : 'Start your Node js revision journey'}</p>

                <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            placeholder="Enter your username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="login-input"
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="login-input"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                            />
                            <span
                                onClick={() => setShowPassword(prev => !prev)}
                                className="password-toggle"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    {error && <div className="login-error-message">{error}</div>}

                   <button
    type="submit"
    className="login-primary-btn"
    disabled={loading}
>
    {loading ? (
        <div className="btn-spinner"></div>
    ) : (
        isLogin ? 'Login' : 'Sign Up'
    )}
</button>
                </form>

                <div className="login-divider">
                    <span>OR</span>
                </div>

                <button
                    onClick={onGuest}
                    className="login-guest-btn"
                >
                    Continue as Guest
                </button>

                <div className="login-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="login-link-btn"
                        >
                            {isLogin ? <span className="highlight-signup">Sign Up</span> : <span className="highlight-login">Login</span>}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}