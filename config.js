const Sequelize = require('sequelize');
const sequelize = new Sequelize('student-api', 'root', 'password', {dialect: 'mariadb', port: 3307});


module.exports = sequelize;