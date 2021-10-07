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
        method: 'POST',
        path: `${pathDef}/todos`,
        description: 'Consultar todas las facturas',
        handler: function (req, res) {
            try {

                var parametros = {};
                let body = req.body;
                let Referencia = req.body.Referencia;

                if (Referencia != "" && Referencia != undefined && Referencia != null) {
                    parametros = {
                        "TableName": NombreTabla,
                        "ScanIndexForward": true,
                        "Limit": 1000,
                        "FilterExpression": "#DYNOBASE_Identificacion = :Identificacion",
                        "ExpressionAttributeNames": {
                            "#DYNOBASE_Identificacion": "Identificacion"
                        },
                        "ExpressionAttributeValues": {
                            ":Identificacion": Referencia
                        }
                    };
                } else {
                    parametros = {
                        TableName: NombreTabla
                    };
                }

                facturas.postConsultarScanDatos(parametros, function (error, data) {
                    if (error) {
                        res.status(500).jsonp({ mensaje: error });
                    }
                    else {
                        res.status(200).jsonp(data);
                    }
                });

            } catch (error) {
                res.status(500).jsonp({ mensaje: error });
            }
        }
    },
    {
        method: 'POST',
        path: `${pathDef}/filtros`,
        description: 'Consultar las facturas por filtros',
        handler: function (req, res) {
            try {

                var parametros = {};
                let body = req.body;
                let Filtro = req.body.Filtro;
                let Referencia = req.body.Referencia;

                if (Referencia != "" && Referencia != undefined && Referencia != null) {
                    parametros = {
                        "TableName": NombreTabla,
                        "ScanIndexForward": true,
                        "Limit": 360000,
                        "FilterExpression": "contains(#DYNOBASE_Factura, :Factura) AND #DYNOBASE_Identificacion = :Identificacion",
                        "ExpressionAttributeNames": {
                            "#DYNOBASE_Factura": "Factura",
                            "#DYNOBASE_Identificacion": "Identificacion"
                        },
                        "ExpressionAttributeValues": {
                            ":Factura": Filtro,
                            ":Identificacion": Referencia
                        }
                    };
                } else {

                    parametros = {
                        "TableName": NombreTabla,
                        "ScanIndexForward": true,
                        "Limit": 360000,
                        "FilterExpression": "contains(#DYNOBASE_Factura, :Factura) OR contains(#DYNOBASE_Administradora, :Administradora)",
                        "ExpressionAttributeNames": {
                            "#DYNOBASE_Factura": "Factura",
                            "#DYNOBASE_Administradora": "Administradora"
                        },
                        "ExpressionAttributeValues": {
                            ":Factura": Filtro,
                            ":Administradora": Filtro
                        }
                    };
                }

                facturas.postConsultarScanDatos(parametros, function (error, data) {
                    if (error) {
                        res.status(500).jsonp({ mensaje: error });
                    }
                    else {
                        res.status(200).jsonp(data);
                    }
                });

            } catch (error) {
                res.status(500).jsonp({ mensaje: error });
            }
        }
    },
    {
        method: 'POST',
        path: `${pathDef}/factura`,
        description: 'Consultar factura x filtro',
        handler: function (req, res) {
            try {
                var parametros = {};
                let body = req.body;
                let Factura = req.body.Codigo;
                let Referencia = req.body.Referencia;

                if (Referencia != "" && Referencia != undefined && Referencia != null) {
                    parametros = {
                        "TableName": NombreTabla,
                        "ScanIndexForward": true,
                        "Limit": 360000,
                        "FilterExpression": "#DYNOBASE_Factura, :Factura AND #DYNOBASE_Identificacion = :Identificacion",
                        "ExpressionAttributeNames": {
                            "#DYNOBASE_Factura": "Factura",
                            "#DYNOBASE_Identificacion": "Identificacion"
                        },
                        "ExpressionAttributeValues": {
                            ":Factura": Filtro,
                            ":Identificacion": Referencia
                        }
                    };
                } else {
                    parametros = {
                        "TableName": NombreTabla,
                        "ScanIndexForward": true,
                        "Limit": 1000,
                        "FilterExpression": "#DYNOBASE_Factura = :Factura",
                        "ExpressionAttributeNames": {
                            "#DYNOBASE_Factura": "Factura"
                        },
                        "ExpressionAttributeValues": {
                            ":Factura": Factura
                        }
                    };
                }

                facturas.postConsultarScanDatos(parametros, function (error, data) {
                    if (error) {
                        res.status(500).jsonp({ mensaje: error });
                    }
                    else {
                        res.status(200).jsonp(data);
                    }
                });

            } catch (error) {
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
                res.status(500).jsonp({ mensaje: error });
            }
        }
    }
];