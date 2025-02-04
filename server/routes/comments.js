const express = require('express');
const { Comment, User } = require('../models');
const router = express.Router();

// Ruta para obtener los comentarios
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [{ model: User, attributes: ['username'] }]  // Incluir el nombre de usuario en la respuesta
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener los comentarios.' });
  }
});

// Ruta para agregar un comentario
router.post('/comments', async (req, res) => {
  const { username, content } = req.body;

  try {
    // Buscar al usuario por nombre de usuario
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear el comentario asociado al usuario encontrado
    const newComment = await Comment.create({
      user_id: user.id,  // Asociar el comentario con el usuario
      content: content,
    });

    res.status(201).json(newComment);  // Devolver el comentario creado
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al agregar el comentario.' });
  }
});

module.exports = router;
