const express = require('express');
const router = express.Router();
const { User, Superuser } = require('../models'); // Importa Superuser
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

// Registro de usuario normal
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Verificar si el usuario ya existe en la tabla de usuarios
    const userExists = await User.findOne({ where: { username } });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashear el password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword
    });

    // Generar token
    const token = jwt.sign(
      { userId: user.id, isSuperuser: false }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isSuperuser: false
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login que maneja tanto User como Superuser
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ where: { username } });
    let isSuperuser = false;

    // Si no encuentra en User, busca en Superuser
    if (!user) {
      user = await Superuser.findOne({ where: { username } });
      isSuperuser = !!user; // Si es superuser, isSuperuser será true
    }

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user.id, isSuperuser }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isSuperuser
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
