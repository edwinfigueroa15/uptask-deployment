const express = require('express')
const router = express.Router()
const { body } = require('express-validator/check')

const ProyectoController = require('../controllers/ProyectoController')
const TareaController = require('../controllers/TareaController')
const UsuarioController = require('../controllers/UsuarioController')
const AuthController = require('../controllers/AuthController')

module.exports = function() {
    router.get('/',
        AuthController.usuarioAutenticado,
        ProyectoController.index
    )
    router.get('/proyectos/show',
        AuthController.usuarioAutenticado,    
        ProyectoController.show
    )
    router.post('/proyectos/store', 
        AuthController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        ProyectoController.store
    )
    router.get('/proyectos/:url',
        AuthController.usuarioAutenticado,
        ProyectoController.proyectoPorUrl
    )
    router.get('/proyectos/edit/:id',
        AuthController.usuarioAutenticado,
        ProyectoController.edit
    )
    router.post('/proyectos/update/:id',
        AuthController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), 
        ProyectoController.update
    )
    router.delete('/proyectos/:url',
        AuthController.usuarioAutenticado,
        ProyectoController.delete
    )

    router.post('/tareas/:url',
        AuthController.usuarioAutenticado,
        TareaController.store
    )
    router.patch('/tareas/:id',
        AuthController.usuarioAutenticado,
        TareaController.cambiarEstado
    )
    router.delete('/tareas/:id',
        AuthController.usuarioAutenticado,
        TareaController.delete
    )

    router.get('/crear-cuenta', UsuarioController.formCrearCuenta)
    router.post('/crear-cuenta', UsuarioController.crearCuenta)
    router.get('/iniciar-sesion', UsuarioController.formIniciarSesion)
    router.post('/iniciar-sesion', AuthController.autenticarUsuario)
    router.get('/cerrar-sesion', AuthController.cerrarSesion)

    router.get('/reestablecer', UsuarioController.formRestablecerPassword)
    router.post('/reestablecer', AuthController.enviarToken)
    router.get('/reestablecer/:token', AuthController.validarToken)
    router.post('/reestablecer/:token', AuthController.actualizarPassword)

    router.get('/confirmar/:correo', UsuarioController.confirmarCuenta)
    
    return router
}