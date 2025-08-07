// backend/routes/tracking.js
const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middlewares/auth');
const Tracking = require('../models/Tracking');
const User = require('../models/User');

const router = express.Router();

const melhorRastreioAPI = axios.create({
    baseURL: 'https://app.melhorrastreio.com.br/api/v1',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': process.env.MELHOR_RASTREIO_TOKEN,
        'User-Agent': process.env.ME_USER_AGENT
    }
});

// ROTA 1: Listar todos os rastreios (protegida)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const trackings = await Tracking.findAll({ where: { userId: req.userId }});
        res.json(trackings);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar rastreios.' });
    }
});

// ROTA 2: Adicionar um novo rastreio (protegida)
router.post('/', authMiddleware, async (req, res) => {
    const { code, title } = req.body;
    if (!code || !title) return res.status(400).json({ error: 'Código e Título são obrigatórios.' });
    try {
        await melhorRastreioAPI.get(`/trackings/${code}`);
        await melhorRastreioAPI.post('/trackings', { trackings: [{ tracking_code: code }] });
        const newTracking = await Tracking.create({ code, title, userId: req.userId });
        res.status(201).json(newTracking);
    } catch (err) {
        const errorMsg = err.response?.data?.message || 'Erro ao adicionar o código. Verifique se ele é válido.';
        res.status(500).json({ error: errorMsg });
    }
});

// ROTA 3: Buscar o status de um código específico (protegida)
router.get('/:code', authMiddleware, async (req, res) => {
    try {
        const response = await melhorRastreioAPI.get(`/trackings/${req.params.code}`);
        const trackingDataArray = response.data.data;
        if (!trackingDataArray || trackingDataArray.length === 0) {
             return res.status(404).json({ error: 'Status não encontrado na API do Melhor Rastreio.' });
        }
        const trackingData = trackingDataArray[0];
        await Tracking.update(
            { carrier: trackingData.service.company.name },
            { where: { code: req.params.code, userId: req.userId } }
        );
        res.json(trackingData);
    } catch(err) {
        res.status(err.response?.status || 500).json({ error: 'Erro ao buscar status do rastreio.' });
    }
});

// ROTA 4: Webhook (pública)
router.post('/webhook', async (req, res) => {
    console.log('--- WEBHOOK RECEBIDO ---', req.body);
    res.status(200).send({ message: 'Webhook recebido com sucesso!' });
});

module.exports = router;
