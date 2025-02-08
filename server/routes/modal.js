const express = require('express');
const multer = require('multer');
const path = require('path');
const { Post } = require('../models'); // Importar el modelo de Post
const fs = require('fs');
const router = express.Router();

// Verifica si la carpeta 'uploads' existe, si no la crea
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegúrate de que la ruta sea correcta
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    // Renombra el archivo con la fecha actual (timestamp) y su extensión
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta para manejar el POST de la imagen y los datos
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { description, user_id, challenge_id, created_at } = req.body;
    const photo = req.file; // Archivo subido

    // Verifica que todos los campos necesarios estén presentes
    if (!photo) {
      return res.status(400).json({ error: 'La foto es obligatoria.' });
    }

    if (!description || !user_id || !challenge_id) {
      return res.status(400).json({ error: 'Debes completar todos los campos.' });
    }

    // Guarda el nuevo post en la base de datos
    const newPost = await Post.create({
      description,
      user_id,
      challenge_id,
      photo_url: `/uploads/${photo.filename}`, // Ruta de la imagen guardada
      created_at,
    });

    res.status(200).json({
      message: 'Desafío completado enviado exitosamente',
      data: newPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar el desafío. Por favor intenta de nuevo.' });
  }
});

module.exports = router;  
