// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { email, password });
            alert('Registro realizado com sucesso! Faça o login.');
            navigate('/login');
        } catch (error) {
            alert('Falha no registro. O email pode já estar em uso.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h1>Registrar</h1>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />
                <button type="submit">Registrar</button>
                <Link to="/login">Já tem uma conta? Faça login</Link>
            </form>
        </div>
    );
}

export default Register;