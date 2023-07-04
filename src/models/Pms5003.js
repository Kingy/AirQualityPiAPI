const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database/');

const Pms5003 = db.define('Pms5003', {
  PM1_0: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  PM2_5: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  PM10: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Pms5003;

