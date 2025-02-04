  const express = require('express');
  const { sequelize } = require('./models');
  require('dotenv').config();
  const cors = require('cors');
  const commentsRoutes = require('./routes/comments');
  const app = express();

  app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));

  app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logging middleware para debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    params: req.params
  });
  next();
});

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
  });
  
  // Middleware para rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // Rutas
  app.use('/comments', commentsRoutes); // Se asegura que las rutas de comentarios estén accesibles bajo '/comments'
  app.use('/api/auth', require('./routes/auth'));  // Ruta para autenticación

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
