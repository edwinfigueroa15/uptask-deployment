const Proyecto = require('../models/Proyecto')
const Tarea = require('../models/Tarea')

exports.index = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyecto.findAll({where : { usuarioId }})
    res.render('index', { title : 'Proyectos', proyectos })
}

exports.show = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyecto.findAll({where : { usuarioId }})
    res.render('nuevoFormulario', { title : 'Nuevo Proyecto', proyectos })
}

exports.store = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyecto.findAll({where : { usuarioId }})
    const { nombre } = req.body
    let errores = []
    if(!nombre) {
        errores.push({'msg' : 'Agrega un nombre al proyecto'})
    }

    if(errores.length > 0) {
        res.render('nuevoFormulario', {title : 'Nuevo Proyecto', errores, proyectos})

    } else {
        const usuarioId = res.locals.usuario.id
        await Proyecto.create({ nombre, usuarioId })
        res.redirect('/')
    }
}

exports.proyectoPorUrl = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyecto.findAll({where : { usuarioId }})
    const proyectoPromise = Proyecto.findOne({
        where : {
            url : req.params.url
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])
    const tareas = await Tarea.findAll({
        where : {
            proyectoId : proyecto.id
        },
        // include : [
        //     { model : Proyecto }
        // ]
    })

    if(!proyecto) return next()

    res.render('tareas', { title : 'Tareas del Proyecto', proyecto, proyectos, tareas })
}

exports.edit = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyecto.findAll({where : { usuarioId }})
    const proyectoPromise = Proyecto.findOne({
        where : {
            id : req.params.id
        }
    })

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    res.render('nuevoFormulario', { title : 'Editar Proyecto', proyectos, proyecto })
}

exports.update = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyecto.findAll({where : { usuarioId }})
    const { nombre } = req.body
    let errores = []
    if(!nombre) {
        errores.push({'msg' : 'Agrega un nombre al proyecto'})
    }

    if(errores.length > 0) {
        res.render('nuevoFormulario', {title : 'Nuevo Proyecto', errores, proyectos})

    } else {
        await Proyecto.update(
            { nombre: nombre },
            { where : {
                id : req.params.id
            }}
        )
        res.redirect('/')
    }
}

exports.delete = async (req, res, next) => {
    const { urlProyecto } = req.query
    const response = await Proyecto.destroy({
        where : {
            url : urlProyecto
        }
    })

    if(!response) return next()
    res.status(200).send('Proyecto Eliminado Correctamente')
}