const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId; 

    
    const [results] = await sequelize.query(
      'SELECT * FROM user_profile WHERE user_id = :userId',
      {
        replacements: { userId }, 
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!results) {
      console.log('No se encontraron resultados para el userId:', userId);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Log para debug
    console.log('Perfil encontrado:', results);

    res.json(results);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ 
      message: 'Error al obtener el reporte del perfil.',
      error: error.message 
    });
  }
});

module.exports = router;