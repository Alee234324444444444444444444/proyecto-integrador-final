const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();
const cors = require('cors');
const commentsRoutes = require('./routes/comments');
const challengeRoutes = require('./routes/challengeRoutes');
const reportsRoutes = require('./routes/reports'); 
const postsRouter = require('./routes/posts');
const rewardsRouter = require('./routes/rewards');
const path = require('path');

const app = express();

// 1. Middlewares básicos
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    params: req.params
  });
  next();
});

// 3. Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rewards', rewardsRouter);
app.use('/comments', commentsRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/posts', postsRouter);
app.use('/reports', reportsRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/rewards', express.static(path.join(__dirname, '../client/src/rewards')));

// 4. Manejo de errores 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// 5. Middleware para rutas no encontradas (solo uno, al final)
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