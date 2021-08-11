//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment');
var documentos = require('../models/modelogenerico');
var pathDef = "/api/documentos";
var NombreTabla = "Documentos";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/todos`,
        description: 'Consultar todos los documentos',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla
                };

                documentos.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/obtener/:Area`,
        description: 'Consultar los documentos asociados a un área',
        handler: function (req, res) {
            try {
                let body = req.body;
                let Area = req.params.Area;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": "DocumentosAreas",
                    "ScanIndexForward": true,
                    "Limit": 100,
                    "FilterExpression": "#DYNOBASE_CodigoArea = :Area",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_CodigoArea": "Area"
                    },
                    "ExpressionAttributeValues": {
                        ":Area": Area
                    }
                };

                documentos.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar un documento',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'Codigo': { S: `${body.Codigo}` },
                        'Nombre': { S: `${body.Nombre}` },
                        //'Obligatorio': { S: `${body.Obligatorio}` },
                        //'CodigoArea': { S: `${body.CodigoArea}` },
                        //'NombreArea': { S: `${body.NombreArea}` },
                        'Archivo': { S: '' },
                        'File': { S: '' },
                        'UsuarioCreacion': { S: `${body.Usuario}` },
                        'UsuarioModificacion': { S: `${body.Usuario}` },
                        'FechaCreacion': { S: `${getFechaHora}` },
                        'FechaModificacion': { S: `${getFechaHora}` },

                    }
                };
                documentos.postInsertarDatos(parametros, function (error, data) {
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
        method: 'PUT',
        path: `${pathDef}/actualizar`,
        description: 'Actualizar un documento',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    },
                    UpdateExpression: `SET #Nombre = :Nombre,                                          
                                          #UsuarioModificacion = :UsuarioModificacion,
                                          #FechaModificacion = :FechaModificacion`,
                    ExpressionAttributeNames: {
                        "#Nombre": "Nombre",
                        "#UsuarioModificacion": "UsuarioModificacion",
                        "#FechaModificacion": "FechaModificacion"
                    },
                    ExpressionAttributeValues: {
                        ":Nombre": body.Nombre,
                        ":UsuarioModificacion": body.Usuario,
                        ":FechaModificacion": getFechaHora
                    },
                    ReturnValues: 'UPDATED_NEW'
                };

                documentos.postActualizarDatos(parametros, function (error, data) {
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
        description: 'Eliminar un documento',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    }
                };

                documentos.postEliminarDatos(parametros, function (error, data) {
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