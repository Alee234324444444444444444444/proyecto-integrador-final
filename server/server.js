const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();
const cors = require('cors');
const challengeRoutes = require('./routes/challenges');
const app = express();

sequelize.sync({ alter: true })  // Modifica la base de datos para que coincida con los modelos
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos:', error);
  });

// Configuración de CORS - Añadir esto antes de los otros middlewares
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/challenges', challengeRoutes);

// Aquí otras rutas que requieran autenticación
// app.use('/api/challenges', require('./routes/challenges'));
// app.use('/api/rewards', require('./routes/rewards'));

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