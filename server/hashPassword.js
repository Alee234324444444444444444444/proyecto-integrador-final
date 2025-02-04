const bcrypt = require('bcrypt');

async function generarHash() {
  const password = 'hola'; // Cambia esta contraseña por la que deseas cifrar
  const hash = await bcrypt.hash(password, 10);
  console.log('Password Hash:', hash);
}

generarHash();
