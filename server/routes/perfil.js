const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');  // Importa la configuración de la base de datos

// Ruta para obtener el reporte de perfil de usuario
router.get('/', async (req, res) => {
  try {
    // Ejecuta la consulta SQL directamente a la vista 'user_profile'
    const [results, metadata] = await sequelize.query('SELECT * FROM user_profile');

    // Envía los resultados en formato JSON
    res.json(results);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error al obtener el reporte del perfil.' });
  }
});

module.exports = router;
