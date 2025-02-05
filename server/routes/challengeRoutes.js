const express = require('express');
const { Challenge, Superuser } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware para verificar si el usuario es Superuser
const isSuperuser = async (req, res, next) => {
  try {
    const superuser = await Superuser.findByPk(req.userId);
    if (!superuser) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener todos los desafíos
router.get('/', async (req, res) => {
    try {
      const challenges = await Challenge.findAll();
      res.json(challenges);
    } catch (error) {
      console.error("Error al obtener desafíos:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  });
  
// Ruta para añadir desafío
router.post('/add', auth, isSuperuser, async (req, res) => {
  try {
    const { title, description, type, due_date } = req.body;
    const challenge = await Challenge.create({
      title,
      description,
      type,
      due_date,
      superuser_id: req.userId,
    });
    res.status(201).json(challenge);
  } catch (error) {
    console.error("Error al crear desafío:", error);
    res.status(500).json({ message: "Error al crear el desafío" });
  }
});

module.exports = router;
