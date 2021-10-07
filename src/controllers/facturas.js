//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');
var facturas = require('../models/modelogenerico');
var pathDef = "/api/facturas";
var NombreTabla = "Facturas";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/todos`,
        description: 'Consultar todas las facturas',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla
                };

                facturas.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/obtener/:Identificacion`,
        description: 'Consultar las facturas por identificación',
        handler: function (req, res) {
            try {
                let body = req.body;
                let Area = req.params.Identificacion;
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 10000,
                    "FilterExpression": "#DYNOBASE_Identificacion = :Identificacion",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Identificacion": "Identificacion"
                    },
                    "ExpressionAttributeValues": {
                        ":Identificacion": Identificacion
                    }
                };
                facturas.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar una factura',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'Factura': { S: `${body.Factura}` },
                        'Fecha': { S: `${body.Fecha}` },
                        'Valor': { S: `${body.Valor}` },
                        'CodAdm': { S: `${body.CodAdm}` },
                        'Administradora': { S: `${body.Administradora}` },
                        'CodUnidad': { S: `${body.CodUnidad}` },
                        'UnidadFuncional': { S: `${body.UnidadFuncional}` },
                        'Usuario': { S: `${body.Usuario}` },
                        'Identificacion': { S: `${body.Identificacion}` },
                        'Tipo': { S: `${body.Tipo}` },
                        'FechaCreacion': { S: `${getFechaHora}` },
                        'FechaModificacion': { S: `${getFechaHora}` },
                    }
                };
                facturas.postInsertarDatos(parametros, function (error, data) {
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