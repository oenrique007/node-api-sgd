//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');
var admisiones = require('../models/modelogenerico');
var pathDef = "/api/admisiones";
var NombreTabla = "Admisiones";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/obtener/:Identificacion`,
        description: 'Consultar las admisiones de un pacientes por filtros',
        handler: function (req, res) {
            try {
                let Identificacion = req.params.Identificacion;
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 200000,
                    "FilterExpression": "#DYNOBASE_Identificacion = :Identificacion",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Identificacion": "Identificacion"
                    },
                    "ExpressionAttributeValues": {
                        ":Identificacion": Identificacion
                    }
                };
                admisiones.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar admisiones',
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
                        'Identificacion': { S: `${body.Identificacion}` },
                        'FechaCreacion': { S: `${getFechaHora}` }
                    }
                };
                admisiones.postInsertarDatos(parametros, function (error, data) {
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
];