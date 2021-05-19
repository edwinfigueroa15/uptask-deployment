const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db')
const Proyecto = require('./Proyecto')

const Tarea = db.define('tareas', {
    id : {
        type : DataTypes.INTEGER.UNSIGNED,
        primaryKey : true,
        autoIncrement : true
    },
    tarea : {
        type: DataTypes.STRING,
    },
    estado: {
        type: DataTypes.INTEGER(1),
    }
});

Tarea.belongsTo(Proyecto)

module.exports = Tarea