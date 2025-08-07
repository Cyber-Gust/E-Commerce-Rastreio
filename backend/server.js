// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const authRoutes = require('./routes/auth');
const trackingRoutes = require('./routes/tracking');
const User = require('./models/User');
const Tracking = require('./models/Tracking');

const app = express();

// --- CORREÇÃO DEFINITIVA DE CORS ---
// Configuração única e robusta para aceitar requisições do seu frontend.
// Esta configuração deve vir ANTES de qualquer outra rota.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://e-commerce-rastreio.vercel.app'
}));

// Middlewares para processar o corpo das requisições
app.use(express.json());

// Banco de Dados
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

User.init(sequelize);
Tracking.init(sequelize);
User.associate(sequelize.models);
Tracking.associate(sequelize.models);

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);

const PORT = process.env.PORT || 3001;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend rodando na porta ${PORT}`);
  });
}).catch(err => console.error('❌ Erro ao sincronizar com o banco de dados:', err));