const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();
const cors = require('cors');
const commentsRoutes = require('./routes/comments');
const app = express();

// Configuración de CORS - Añadir esto antes de los otros middlewares
app.use(cors({
  origin: 'http://localhost:3001',  // Ajusta este puerto según el front-end
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/comments', commentsRoutes); // Se asegura que las rutas de comentarios estén accesibles bajo '/comments'
app.use('/api/auth', require('./routes/auth'));  // Ruta para autenticación

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
