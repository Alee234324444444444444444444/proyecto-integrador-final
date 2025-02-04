const express = require('express');
const { Comment, User } = require('../models');
const router = express.Router();

// Obtener comentarios (GET /comments)
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [{ 
        model: User,
        attributes: ['username'] 
      }],
      order: [['created_at', 'DESC']] // Ordenar por fecha de creación
    });
    res.json(comments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener los comentarios.' });
  }
});

// Agregar comentario (POST /comments)
router.post('/', async (req, res) => {
  const { username, content } = req.body;

  try {
    // Buscar al usuario
    const user = await User.findOne({ 
      where: { username: username } 
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Crear comentario
    const newComment = await Comment.create({
      content: content,
      user_id: user.id,
      created_at: new Date()
    });

    // Obtener el comentario con la información del usuario
    const commentWithUser = await Comment.findOne({
      where: { id: newComment.id },
      include: [{ 
        model: User,
        attributes: ['username'] 
      }]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ error: 'Hubo un problema al agregar el comentario.' });
  }
});

module.exports = router;