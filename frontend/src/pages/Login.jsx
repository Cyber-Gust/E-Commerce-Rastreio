// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            alert('Falha no login. Verifique seu email e senha.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1>Login</h1>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Entrar</button>
                <Link to="/register">Não tem uma conta? Registre-se</Link>
            </form>
        </div>
    );
}

export default Login;