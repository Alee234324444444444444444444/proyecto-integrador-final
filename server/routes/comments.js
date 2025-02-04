const express = require('express');
const { Comment, User } = require('../models');
const router = express.Router();

// Obtener comentarios con respuestas
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { parent_id: null }, // Solo comentarios principales
      include: [
        { model: User, attributes: ['username'] },
        {
          model: Comment,
          as: 'replies',
          include: [{ model: User, attributes: ['username'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(comments);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ error: 'Hubo un problema al obtener los comentarios.' });
  }
});

// Agregar un comentario o respuesta
router.post('/', async (req, res) => {
  const { username, content, parent_id } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const newComment = await Comment.create({
      content,
      user_id: user.id,
      parent_id: parent_id || null, // Si es una respuesta, tendrá un parent_id
      created_at: new Date()
    });

    const commentWithUser = await Comment.findOne({
      where: { id: newComment.id },
      include: [{ model: User, attributes: ['username'] }]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ error: 'Hubo un problema al agregar el comentario.' });
  }
});


const { Comment, User } = require('../models');

// Log para verificar que la ruta está registrada
console.log('Registrando ruta DELETE /comments/:id');

router.delete('/:id', async (req, res) => {
  const commentId = req.params.id;
  const userId = req.body.user_id;

  console.log('Petición DELETE recibida:', {
    commentId,
    userId,
    body: req.body
  });

  try {
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      console.log('Comentario no encontrado:', commentId);
      return res.status(404).json({ 
        error: 'Comentario no encontrado',
        commentId
      });
    }

    if (comment.user_id !== userId) {
      console.log('Usuario no autorizado:', {
        commentUserId: comment.user_id,
        requestUserId: userId
      });
      return res.status(403).json({ error: 'No autorizado' });
    }

    await comment.destroy();
    console.log('Comentario eliminado:', commentId);
    res.json({ message: 'Comentario eliminado con éxito' });

  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ 
      error: 'Error al eliminar comentario',
      details: error.message
    });
  }
});



// Modificar comentario
router.put('/:id', async (req, res) => { 
  const { id } = req.params;
  const { user_id, content } = req.body;

  try {
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    if (comment.user_id !== user_id) {
      return res.status(403).json({ error: 'No puedes modificar este comentario' });
    }

    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error('Error al modificar comentario:', error);
    res.status(500).json({ error: 'Hubo un problema al modificar el comentario.' });
  }
});


module.exports = router;
