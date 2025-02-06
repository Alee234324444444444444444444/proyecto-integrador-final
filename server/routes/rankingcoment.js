// routes/reports.js
const express = require('express');
const router = express.Router();
const sequelize = require('../config/database'); 
 // Importa la configuración de la base de datos

// Ruta para obtener el reporte de comentarios por usuario
router.get('/', async (req, res) => {
  try {
    // Ejecuta la consulta SQL directamente a la vista
    const [results, metadata] = await sequelize.query('SELECT * FROM perfil_view');

    // Envía los resultados en formato JSON
    res.json(results);
  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    res.status(500).json({ error: 'Error al obtener el reporte de comentarios.' });
  }
});

module.exports = router;
