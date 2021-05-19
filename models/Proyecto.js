const { Sequelize, DataTypes } = require('sequelize');
const slug = require('slug')
const shortid = require('shortid')
const db = require('../config/db')

const Proyecto = db.define('proyectos', {
    id : {
        type : DataTypes.INTEGER.UNSIGNED,
        primaryKey : true,
        autoIncrement : true
    },
    nombre : {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING
    }
}, {
    hooks : {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre)
            proyecto.url = `${url}-${shortid.generate()}`
        },
    }
});

module.exports = Proyecto