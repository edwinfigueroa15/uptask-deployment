const passport = require('passport')
const Usuario = require('../models/Usuario')
const crypto = require('crypto')
const enviarEmail = require('../handler/email')
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op
const bcrypt = require('bcrypt-nodejs')


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
})

exports.usuarioAutenticado = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }

    return res.redirect('/iniciar-sesion')
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion')
    })
}

exports.enviarToken = async (req, res) => {
    const usuario = await Usuario.findOne({ where : { email : req.body.email }})

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.render('reestablecer', { nombrePagina : 'Reestablecer tu Contraseña', mensajes : req.flash() })
    }

    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000

    await usuario.save()

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`
    await enviarEmail.main({
        usuario,
        subject : 'Password reset',
        resetUrl,
        archivo : 'reestablecerPassword'
    })

    req.flash('correcto', 'Se envió un mensaje a tu correo')
    res.redirect('/iniciar-sesion')
    
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuario.findOne({
        where : {
            token : req.params.token
        }
    })

    if (!usuario) {
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    }

    res.render('resetPassword', { nombrePagina : 'Reestablecer Contraseña' })
}

exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuario.findOne({
        where : {
            token : req.params.token,
            expiracion : {
                [Op.gte] : Date.now()
            }
        }
    })

    if (!usuario) {
        req.flash('error', 'No valido')
        res.redirect('/reestablecer')
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null
    await usuario.save()

    req.flash('correcto', 'Tu password se ha modificado correctamente')
    res.redirect('/iniciar-sesion')
}