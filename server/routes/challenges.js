const express = require('express');
const router = express.Router();
const { Challenge } = require('../models');
const auth = require('../middleware/auth');
const authSuperuser = require('../middleware/authSuperuser');

router.post('/', auth, authSuperuser, async (req, res) => {
  try {
    const { title, description, type, due_date } = req.body;

    if (!title || !description || !type || !due_date) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const challenge = await Challenge.create({
      title,
      description,
      type,
      due_date,
    });

    res.status(201).json({ message: 'Desafío creado exitosamente', challenge });
  } catch (error) {
    console.error('Error al crear desafío:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
