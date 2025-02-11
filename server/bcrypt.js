const bcrypt = require('bcrypt');
const hashedPassword = bcrypt.hashSync('1234', 10);
console.log(hashedPassword);
