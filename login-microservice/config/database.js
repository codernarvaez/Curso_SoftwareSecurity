const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydb', 'myuser', 'mypassword', {
    host: 'localhost',
    dialect: 'postgres'
  });
  
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;