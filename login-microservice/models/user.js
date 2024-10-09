const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Importa la instancia de Sequelize

const User = sequelize.define('User', {
  google_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING
  },
  authorized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;