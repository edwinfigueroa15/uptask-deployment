const Usuario = require('../models/Usuario')
const enviarEmail = require('../handler/email')

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {nombrePagina: 'Crear Cuenta en UpTask'})
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes
    res.render('iniciarSesion', {nombrePagina: 'Inicia Sesion en UpTask', error})
}

exports.crearCuenta = async (req, res) => {
    const { email, password } = req.body

    try {
        await Usuario.create({
            email : email,
            password : password
        })

        const confirmUrl = `http://${req.headers.host}/confirmar/${email}`

        const usuario = {
            email
        }

        await enviarEmail.main({
            usuario,
            subject : 'Confirma tu Cuenta',
            confirmUrl,
            archivo : 'confirmarCuenta'
        })

        req.flash('correcto', 'Enviamos un correo confirma tu cuenta')
        res.redirect('/iniciar-sesion')
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', { mensajes : req.flash(), nombrePagina: 'Crear Cuenta en UpTask', email, password })

    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', { nombrePagina : 'Reestablecer tu Contraseña' })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuario.findOne({
        where : {
            email : req.params.correo
        }
    })

    if(!usuario) {
        req.flash('error', 'No valido')
        res.redirect('/iniciar-sesion')
    }

    usuario.activo = 1
    await usuario.save()

    req.flash('correcto', 'Cuenta Activada')
    res.redirect('/iniciar-sesion')
}