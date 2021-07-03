//dependencias
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment');
var usuarios = require('../models/modelogenerico');
var pathDef = "/api/usuarios";
var NombreTabla = "Usuarios";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/todos`,
        description: 'Consultar todos los usuarios',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla
                };

                usuarios.postConsultarScanDatos(parametros, function (error, data) {
                    if (error) {
                        res.status(500).jsonp({ mensaje: error });
                    }
                    else {
                        res.status(200).jsonp(data);
                    }
                });

            } catch (error) {
                console.log(error);
                res.status(500).jsonp({ mensaje: error });
            }
        }
    },
    {
        method: 'POST',
        path: `${pathDef}/insertar`,
        description: 'Insertar un usuario',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'Usuario': { S: `${body.Usuario}` },
                        'Nombres': { S: `${body.Nombres}` },
                        'Correo': { S: `${body.Correo}` },
                        'Rol': { S: `${body.Rol}` },
                        'FechaCreacion': { S: `${getFechaHora}` }
                    }
                };
                usuarios.postInsertarDatos(parametros, function (error, data) {
                    if (error) {
                        res.status(500).jsonp({ mensaje: error });
                    }
                    else {
                        res.status(200).jsonp(data);
                    }
                });

            } catch (error) {
                console.log(error);
                res.status(500).jsonp({ mensaje: error });
            }
        }
    },
    {
        method: 'GET',
        path: `${pathDef}/rol/:Usuario`,
        description: 'Consultar el rol del usuario',
        handler: function (req, res) {
            try {
                let body = req.body;
                let Usuario = req.params.Usuario;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100,
                    "FilterExpression": "#DYNOBASE_Usuario = :Usuario",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Usuario": "Usuario"
                    },
                    "ExpressionAttributeValues": {
                        ":Usuario": Usuario
                    }
                };

                usuarios.postConsultarScanDatos(parametros, function (error, data) {
                    if (error) {
                        res.status(500).jsonp({ mensaje: error });
                    }
                    else {
                        res.status(200).jsonp(data);
                    }
                });

            } catch (error) {
                console.log(error);
                res.status(500).jsonp({ mensaje: error });
            }
        }
    }
];