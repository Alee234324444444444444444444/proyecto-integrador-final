const express = require('express');
const { Challenge, Superuser, Reward } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();
const path = require('path');

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

// Obtener todos los desafíos con sus recompensas
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.findAll({
      include: [{
        model: Reward,
        required: false
      }]
    });
    res.json(challenges);
  } catch (error) {
    console.error("Error al obtener desafíos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para añadir desafío con recompensa
router.post('/add', auth, isSuperuser, async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Para debug

    const { title, description, type, due_date, rewardType, rewardName, rewardConfig } = req.body;

    // Validar que los campos requeridos existan
    if (!title || !description || !type) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos",
        required: { title, description, type }
      });
    }

    // Crear el desafío
    const challenge = await Challenge.create({
      title,
      description,
      type,
      due_date,
      superuser_id: req.userId,
    });

    // Si se proporcionó el tipo de recompensa, crear la recompensa
    if (rewardType && rewardName) {
      const reward = await Reward.create({
        name: rewardName,
        type: rewardType,
        image: `/rewards/assets/${rewardType}.png`,
        config: rewardConfig,
        challenge_id: challenge.id
      });

      res.status(201).json({
        challenge,
        reward
      });
    } else {
      res.status(201).json({ challenge });
    }

  } catch (error) {
    console.error("Error al crear desafío:", error);
    res.status(500).json({ 
      message: "Error al crear el desafío",
      error: error.message 
    });
  }
});

// Actualizar un desafío
router.put('/:id', auth, isSuperuser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, due_date } = req.body;

    const challenge = await Challenge.findByPk(id);
    if (!challenge) {
      return res.status(404).json({ message: "Desafío no encontrado" });
    }

    await challenge.update({
      title,
      description,
      type,
      due_date
    });

    res.json(challenge);
  } catch (error) {
    console.error("Error al actualizar desafío:", error);
    res.status(500).json({ message: "Error al actualizar el desafío" });
  }
});

// Eliminar un desafío
router.delete('/:id', auth, isSuperuser, async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await Challenge.findByPk(id);
    
    if (!challenge) {
      return res.status(404).json({ message: "Desafío no encontrado" });
    }

    await challenge.destroy();
    res.json({ message: "Desafío eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar desafío:", error);
    res.status(500).json({ message: "Error al eliminar el desafío" });
  }
});

module.exports = router;