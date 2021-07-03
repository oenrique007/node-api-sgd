//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment');
var usuarioAreas = require('../models/modelogenerico');
var pathDef = "/api/usuariosareas";
var NombreTabla = "UsuariosAreas";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/todos`,
        description: 'Consultar Todas los usuarios y areas configurados',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla
                };

                usuarioAreas.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/obtener/:Usuario`,
        description: 'Consultar las áreas asociadas a un usuario en especifico',
        handler: function (req, res) {
            try {
                let body = req.body;
                let Usuario = req.params.Usuario;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100,
                    "FilterExpression": "#DYNOBASE_UsuarioCognito = :UsuarioCognito",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_UsuarioCognito": "UsuarioCognito"
                    },
                    "ExpressionAttributeValues": {
                        ":UsuarioCognito": Usuario
                    }
                };

                usuarioAreas.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar un usuario a un área',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'UsuarioCognito': { S: `${body.UsuarioCognito}` },
                        'Nombres': { S: `${body.Nombres}` },
                        'Area': { S: `${body.CodigoArea}` },
                        'NombreArea': { S: `${body.NombreArea}` },
                        'UsuarioCreacion': { S: `${body.UsuarioCreacion}` },
                        'FechaCreacion': { S: `${getFechaHora}` }
                    }
                };

                usuarioAreas.postInsertarDatos(parametros, function (error, data) {
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
        method: 'DELETE',
        path: `${pathDef}/eliminar`,
        description: 'Eliminar una relación usuario y área',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    }
                };
                usuarioAreas.postEliminarDatos(parametros, function (error, data) {
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