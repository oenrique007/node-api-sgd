//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');
var areas = require('../models/modelogenerico');
var pathDef = "/api/areas";
var NombreTabla = "Areas";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/todos`,
        description: 'Consultar Todas las Areas',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla
                };

                areas.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/obtener/:Codigo`,
        description: 'Consultar datos de un área en especifico',
        handler: function (req, res) {
            try {
                let Codigo = req.params.Codigo;
                var parametros = {
                    TableName: NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100,
                    "FilterExpression": "#DYNOBASE_Codigo = :Codigo",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Codigo": "Codigo"
                    },
                    "ExpressionAttributeValues": {
                        ":Codigo": Codigo
                    }
                };
                areas.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar un área',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'Codigo': { S: `${body.Codigo}` },
                        'Descripcion': { S: `${body.Descripcion}` },
                        'Estructura': { S: `${body.Estructura}` },
                        'TextoEstructura': { S: `${body.TextoEstructura}` },
                        'BloqueoDescarga': { S: `${body.BloqueoDescarga}` },
                        'Vencimiento': { S: `${body.Vencimiento}` },
                        'ValorVencimiento': { N: `${body.ValorVencimiento}` },
                        'Periodo': { S: `${body.Periodo}` },
                        'TextoPeriodo': { S: `${body.TextoPeriodo}` },
                        'Bucket': { S: `${body.Bucket}` },
                        'UsuarioCreacion': { S: `${body.Usuario}` },
                        'UsuarioModificacion': { S: `${body.Usuario}` },
                        'FechaCreacion': { S: `${getFechaHora}` },
                        'FechaModificacion': { S: `${getFechaHora}` }
                    }
                };

                areas.postInsertarDatos(parametros, function (error, data) {
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
        description: 'Actualizar un área',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    },
                    UpdateExpression: `SET #Descripcion = :Descripcion, 
                                          #Estructura = :Estructura,
                                          #Vencimiento = :Vencimiento,                                           
                                          #ValorVencimiento = :ValorVencimiento,
                                          #Periodo = :Periodo,
                                          #Bucket = :Bucket,
                                          #BloqueoDescarga = :BloqueoDescarga,
                                          #UsuarioModificacion = :UsuarioModificacion,
                                          #FechaModificacion = :FechaModificacion,
                                          #TextoEstructura = :TextoEstructura,
                                          #TextoPeriodo = :TextoPeriodo`,
                    ExpressionAttributeNames: {
                        "#Descripcion": "Descripcion",
                        "#Estructura": "Estructura",
                        "#Vencimiento": "Vencimiento",
                        "#Periodo": "Periodo",
                        "#ValorVencimiento": "ValorVencimiento",
                        "#Bucket": "Bucket",
                        "#BloqueoDescarga": "BloqueoDescarga",
                        "#UsuarioModificacion": "UsuarioModificacion",
                        "#FechaModificacion": "FechaModificacion",
                        "#TextoEstructura": "TextoEstructura",
                        "#TextoPeriodo": "TextoPeriodo"
                    },
                    ExpressionAttributeValues: {
                        ":Descripcion": body.Descripcion,
                        ":Estructura": body.Estructura,
                        ":Vencimiento": body.Vencimiento,
                        ":ValorVencimiento": body.ValorVencimiento,
                        ":Periodo": body.Periodo,
                        ":Bucket": body.Bucket,
                        ":BloqueoDescarga": body.BloqueoDescarga,
                        ":UsuarioModificacion": body.Usuario,
                        ":FechaModificacion": getFechaHora,
                        ":TextoEstructura": body.TextoEstructura,
                        ":TextoPeriodo": body.TextoPeriodo
                    },
                    ReturnValues: 'UPDATED_NEW'
                };

                areas.postActualizarDatos(parametros, function (error, data) {
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
        description: 'Eliminar un área',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    }
                };

                areas.postEliminarDatos(parametros, function (error, data) {
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