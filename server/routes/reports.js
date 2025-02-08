const express = require('express');
const router = express.Router();
const sequelize = require('../config/database'); 

router.get('/', async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query('SELECT * FROM user_comments_summary');

    res.json(results);
  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    res.status(500).json({ error: 'Error al obtener el reporte de comentarios.' });
  }
});

module.exports = router;