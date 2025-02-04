const jwt = require('jsonwebtoken');
const { Superuser } = require('../models');

const authSuperuser = async (req, res, next) => {
  try {
    const superuser = await Superuser.findByPk(req.userId);
    if (!superuser) {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere permiso de administrador.' });
    }
    next();
  } catch (error) {
    console.error('Error en la verificación de superusuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = authSuperuser;
