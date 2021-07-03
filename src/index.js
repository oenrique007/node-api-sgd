//dependencias
var config = require('../config/config');
var express = require('express');
var bodyParser = require('body-parser');
var requireDir = require('require-dir');
var jwt = require('jsonwebtoken');
const cors = require('cors');
var multer = require('multer');
var app = express();

//middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

app.use(function (req, res, next) {
    //obtener token
    var token = req.headers['x-access-token'];
    if (token) {
        //validar token
        jwt.verify(token, config.token_password, function (error, decoded) {
            if (error) {
                return res.status(500).send({ mensaje: 'error de autenticacion de token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).send({ mensaje: 'no autorizado para realizar esta peticion' });
    }
});

//routers
var router = express.Router();

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
});

const upload = multer({ storage }).single('archivo');

//crear routers
const routes = requireDir('./controllers');
for (const route in routes) {
    for (var index = 0; index < routes[route].length; index++) {
        const api = routes[route][index];
        const method = api.method;
        const path = api.path;
        const handler = api.handler;
        switch (method) {
            case "GET":
                router.get(path, handler);
                break;
            case "POST":
                router.post(path, upload, handler);
                break;
            case "PUT":
                router.put(path, upload, handler);
                break;
            case "DELETE":
                router.delete(path, upload, handler);
                break;
        }
    }
}

app.use(router);
// Crear Server
app.listen(config.api.port, function () {
    console.log("Api Node corriendo http://localhost:" + config.api.port);
});

