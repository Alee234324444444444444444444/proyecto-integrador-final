const bcrypt = require('bcrypt');
const hashedPassword = bcrypt.hashSync('123456', 10);
console.log(hashedPassword);
