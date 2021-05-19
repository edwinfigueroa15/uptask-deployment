const Proyecto = require('../models/Proyecto')
const Tarea = require('../models/Tarea')


exports.store = async (req, res, next) => { 
    const proyecto = await Proyecto.findOne({ where : { url : req.params.url } })

    const { tarea } = req.body
    const estado = 0
    const proyectoId = proyecto.id

    const response = await Tarea.create({ tarea, estado, proyectoId })
    if(!response) {return next()}
    res.redirect(`/proyectos/${req.params.url}`)
}

exports.cambiarEstado = async (req, res, next) => { 
    const { id } = req.params
    const tarea = await Tarea.findOne({
        where : {
            id : id
        }
    })

    let estado = 0
    if (tarea.estado === estado) {
        estado = 1
    }

    tarea.estado = estado
    const response = await tarea.save()
    if(!response) return next()

    res.status(200).send('Actualizado')
}

exports.delete = async (req, res, next) => {
    const { idTarea } = req.query
    const response = await Tarea.destroy({
        where : {
            id : idTarea
        }
    })

    if(!response) return next()
    res.status(200).send('Tarea Eliminada Correctamente')
}