const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/db')
const Proyecto = require('./Proyecto')
const bcrypt = require('bcrypt-nodejs')

const Usuario = db.define('usuarios', {
    id : {
        type : DataTypes.INTEGER.UNSIGNED,
        primaryKey : true,
        autoIncrement : true
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            isEmail : {
                msg : 'Agrega un e-mail valido'
            },
            notEmpty : {
                msg : 'El e-mail no puede esta vacio'
            }
        },
        unique : {
            args : true,
            msg : 'Usuario ya registrado'
        }
    },
    password: {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty : {
                msg : 'El password no puede esta vacio'
            }
        },
    },
    activo : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    },
    token : {
        type : DataTypes.STRING,
    },
    expiracion : {
        type : DataTypes.DATE,
    }
}, {
    hooks : {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
});

// METODOS PERSONALIZADOS
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

Usuario.hasMany(Proyecto)

module.exports = Usuario