const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {

  
  try {
    const [results] = await sequelize.query(
      'SELECT * FROM user_profile WHERE user_id = :userId',);

    if (!results || results.length === 0) {
      console.log('No se encontraron resultados para el userId:', req.userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error al obtener el reporte del perfil.' });
  }
});

module.exports = router;
