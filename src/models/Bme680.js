const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database/');

const Bme680 = db.define('Bme680', {
  Temperature: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  Pressure: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  Humidity: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  Altitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Bme680;

