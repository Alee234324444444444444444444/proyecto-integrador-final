const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();
const cors = require('cors');
const commentsRoutes = require('./routes/comments');
const challengeRoutes = require('./routes/challengeRoutes');
const modal = require('./routes/modal');
const path = require('path'); // Necesario para servir archivos estáticos

const app = express();

// 1. Middlewares básicos
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Servir archivos estáticos (como imágenes) desde la carpeta 'uploads'
app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    params: req.params
  });
  next();
});

// 4. Rutas
app.use('/comments', commentsRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/challenges', challengeRoutes);
app.use('/modaldate', modal);

// 5. Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// 6. Middleware para rutas no encontradas (solo uno, al final)
app.use((req, res) => {
  console.log('Ruta no encontrada:', req.method, req.path);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const port = process.env.PORT || 3000;

// Sincronizar base de datos
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('✅ Modelos sincronizados con la base de datos');
    app.listen(port, () => {
      console.log(`✅ Servidor corriendo en el puerto ${port}`);
    });
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
