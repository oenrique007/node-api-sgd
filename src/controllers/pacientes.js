//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment');
var pacientes = require('../models/modelogenerico');
var pathDef = "/api/pacientes";
var NombreTabla = "Pacientes";

//exportar modulo
module.exports = [
    {
        method: 'POST',
        path: `${pathDef}/todos`,
        description: 'Consultar todos los pacientes',
        handler: function (req, res) {
            try {

                let body = req.body;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100
                };

                pacientes.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/filtros`,
        description: 'Consultar los pacientes por filtros',
        handler: function (req, res) {
            try {

                let body = req.body;
                // let Nombres = req.body.Nombres;
                // let Identificacion = req.body.Identificacion;
                let Filtro = req.body.Filtro;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100,
                    "FilterExpression": "contains(#DYNOBASE_Nombres, :Nombres) OR contains(#DYNOBASE_Identificacion, :Identificacion)",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Nombres": "Nombres",
                        "#DYNOBASE_Identificacion": "Identificacion"
                    },
                    "ExpressionAttributeValues": {
                        ":Nombres": Filtro,
                        ":Identificacion": Filtro
                    }
                };

                pacientes.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/identificacion`,
        description: 'Consultar los pacientes por filtros',
        handler: function (req, res) {
            try {
                let body = req.body;
                let Identificacion = req.body.Codigo;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100,
                    "FilterExpression": "#DYNOBASE_Identificacion = :Identificacion",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Identificacion": "Identificacion"
                    },
                    "ExpressionAttributeValues": {
                        ":Identificacion": Identificacion
                    }
                };

                pacientes.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar un paciente',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'IdERP': { S: `${body.IdERP}` },
                        'Identificacion': { S: `${body.Identificacion}` },
                        'Tipo': { S: `${body.Tipo}` },
                        'Nombres': { S: `${body.Nombres}` },
                        'Sexo': { S: `${body.Sexo}` },
                        'FechaNac': { S: `${body.FechaNac}` },
                        'Direccion': { S: `${body.Direccion}` },
                        'Telefonos': { S: `${body.Telefonos}` },
                        'Email': { S: `${body.Email}` },
                        'Nivel': { S: `${body.Nivel}` },
                        'FechaCreacion': { S: `${getFechaHora}` }
                    }
                };
                pacientes.postInsertarDatos(parametros, function (error, data) {
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