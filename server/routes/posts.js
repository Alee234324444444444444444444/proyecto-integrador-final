const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Post, Superuser } = require('../models');
const auth = require('../middleware/auth');

// Configurar multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts/') // Asegúrate de crear este directorio
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limitar a 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('No es un archivo de imagen válido'));
    }
  }
});

// Crear un nuevo post
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { description, challenge_id } = req.body;
    const user_id = req.userId; // Viene del middleware de autenticación

    if (!req.file) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    const post = await Post.create({
      photo: `/uploads/posts/${req.file.filename}`,
      description,
      user_id,
      challenge_id
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  }
});

// Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: ['User', 'Challenge'],
      order: [['created_at', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ message: 'Error al obtener las publicaciones' });
  }
});

// Actualizar el estado de una publicación
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approved_by } = req.body;

    // Verificar si el usuario es superuser
    const superuser = await Superuser.findByPk(req.userId);
    if (!superuser) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await post.update({ 
      status,
      approved_by: approved_by
    });

    res.json(post);
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
});
  

module.exports = router;