// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
    const [trackings, setTrackings] = useState([]);
    const [newCode, setNewCode] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [modalStatus, setModalStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // Estado para mensagens de erro
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/tracking').then(response => {
            setTrackings(response.data);
        }).catch(err => {
            if (err.response?.status === 401) handleLogout();
            else setError('Falha ao carregar seus rastreios.');
        });
    }, []);

    const handleAddTracking = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/tracking', { code: newCode, title: newTitle });
            setTrackings([...trackings, response.data]);
            setNewCode('');
            setNewTitle('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao adicionar rastreio.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowStatus = async (code) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get(`/tracking/${code}`);
            setModalStatus(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Não foi possível buscar o status agora.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const StatusModal = ({ status, onClose }) => (
        <div className="status-modal" onClick={onClose}>
            <div className="status-modal-content" onClick={e => e.stopPropagation()}>
                <h4>Histórico de Rastreio</h4>
                {status.tracking.map((event, index) => (
                    <div key={index} className="status-event">
                        <p><strong>Status:</strong> {event.status}</p>
                        <p><strong>Local:</strong> {event.location}</p>
                        <p><strong>Data:</strong> {new Date(event.date).toLocaleString('pt-BR')}</p>
                    </div>
                ))}
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );

    return (
        <div className="container">
            {isLoading && <div className="loading-overlay">Carregando...</div>}
            {modalStatus && <StatusModal status={modalStatus} onClose={() => setModalStatus(null)} />}
            
            <div className="dashboard-header">
                <h2>Meus Rastreios</h2>
                <button onClick={handleLogout} className="btn-logout">Sair</button>
            </div>

            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleAddTracking} className="add-tracking-form">
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ex: Pedido da Loja X" required />
                <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Código de Rastreio" required />
                <button type="submit" disabled={isLoading}>Adicionar</button>
            </form>

            <ul className="tracking-list">
                {trackings.length > 0 ? trackings.map(t => (
                    <li key={t.id} className="tracking-item">
                        <h3>{t.title}</h3>
                        <p>Código: {t.code} | Transportadora: {t.carrier || 'Aguardando status...'}</p>
                        <button onClick={() => handleShowStatus(t.code)} className="btn-status" disabled={isLoading}>
                            Ver Status Atual
                        </button>
                    </li>
                )) : <p>Você ainda não adicionou nenhum código para rastrear.</p>}
            </ul>
        </div>
    );
}

export default Dashboard;
