const herlpers = require('./helpers')
const express = require('express')
const routers = require('./routers/web')
const path = require('path')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')
require('dotenv').config({ path : '.env' })

// CREAR LA CONEXION A LA BASE DE DATOS **********************************************************************************************
const db = require('./config/db')

//PROBAR SI ESTA CONECTANDO A LA BASE DE DATOS
db.authenticate()
    .then(() => console.log('Conectado al servior'))
    .catch(error => console.log('Hubo un error: '+error))

// MIGRAMOS LOS DATOS DE LOS MODELOS A LA BASE DE DATOS PARA CREAR LAS TABLAS (iMPORTANTE TOCA IMPORTAR LOS MODELOS PRIMERO)
require('./models/Proyecto')
require('./models/Tarea')
require('./models/Usuario')
db.sync()
    .then(() => console.log('Migraciones Completas'))
    .catch(error => console.log('Hubo un error: '+error))

// CREAR UN APP DE EXPRESS **********************************************************************************************************
const app = express()

// DONDE ENCONTRAR LOS ARCHIVOS ESTATICOS (EJEMPLO LOS CSS Y JS)
app.use(express.static('public'))

// HABILITAR PUG (UN TEMPLATE ENGINE)
app.set('view engine', 'pug')

// HABILITAR BODYPARSE PARA LLER LOS DATOS DEL FORMULARIO
app.use(bodyParser.urlencoded({extended: true}))

// AÑADIR LA CARPETA DE LAS VISTAS
app.set('views', path.join(__dirname, './views/'))

// AGREGAR FLASH MENSAJES
app.use(flash())

// COOKIES
app.use(cookieParser())

// SESIONES
app.use(session({
    secret : 'supersecreto',
    resave : false,
    saveUninitialized : false
}))

app.use(passport.initialize())
app.use(passport.session())

// PASAR EL HELPER VAR_DUMP QUE NOSOTROS CREAMOS
app.use((req, res, next) => {
    res.locals.var_dump = herlpers.var_dump
    res.locals.mensajes = req.flash()
    res.locals.usuario = {...req.user} || null
    next()
})

// RUTAS
app.use('/', routers())

// CREAR EL PUERTO PARA EL SERVIDOR
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server: http://localhost:${port}`)
})

require('./handler/email')
