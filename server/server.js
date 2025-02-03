const express = require('express');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/auth'));

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