// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Rota de Registro
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }
    const user = await User.create({ email, password });
    user.password = undefined; // Não retorna a senha
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(400).json({ error: 'Falha no registro.', details: err.message });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    return res.status(400).json({ error: 'Falha na autenticação.' });
  }
});

module.exports = router;
