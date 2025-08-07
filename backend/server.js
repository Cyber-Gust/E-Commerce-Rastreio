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

// --- CORREÇÃO AQUI ---
// 1. Removida a primeira chamada app.use(cors())
// 2. A configuração de CORS agora está no lugar certo, antes das rotas.

// Configuração de CORS mais específica para produção
const corsOptions = {
  // 3. Corrigido o 'origin' para não incluir o caminho '/login'
  origin: process.env.FRONTEND_URL || 'https://e-commerce-rastreio.vercel.app', 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// O restante dos middlewares
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

User.init(sequelize);
Tracking.init(sequelize);
User.associate(sequelize.models);
Tracking.associate(sequelize.models);

app.use('/api/auth', authRoutes);
app.use('/api/tracking', trackingRoutes);

const PORT = process.env.PORT || 3001;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend rodando na porta ${PORT}`);
  });
}).catch(err => console.error('❌ Erro ao sincronizar com o banco de dados:', err));