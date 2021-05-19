const { Sequelize } = require('sequelize');
require('dotenv').config({ path : 'variables.env' })

const sequelize = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BP_PASS, {
  host: process.env.BD_HOST,
  dialect: 'mysql',
  port : process.env.BD_PORT,
  define  : {
      timestamps : false
  }
});

module.exports = sequelize