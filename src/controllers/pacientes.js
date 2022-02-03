//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');
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
                    "Limit": 1000000
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
                    "Limit": 1000000,
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
                    "Limit": 1000000,
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
                let getFechaHora = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");
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
    {
        method: 'PUT',
        path: `${pathDef}/actualizar`,
        description: 'Actualizar datos de un paciente',
        handler: function (req, res) {
            try {

                let body = req.body;
                //let getFechaHora = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    },
                    UpdateExpression: `SET #Tipo = :Tipo,                                          
                                          #Nombres = :Nombres,
                                          #Sexo = :Sexo,
                                          #FechaNac = :FechaNac,
                                          #Direccion = :Direccion,
                                          #Telefonos = :Telefonos,
                                          #Email = :Email,
                                          #Nivel = :Nivel`,
                    ExpressionAttributeNames: {
                        "#Tipo": "Tipo",
                        "#Nombres": "Nombres",
                        "#Sexo": "Sexo",
                        "#FechaNac": "FechaNac",
                        "#Direccion": "Direccion",
                        "#Telefonos": "Telefonos",
                        "#Email": "Email",
                        "#Nivel": "Nivel"
                    },
                    ExpressionAttributeValues: {
                        ":Tipo": body.Tipo,
                        ":Nombres": body.Nombres,
                        ":Sexo": body.Sexo,
                        ":FechaNac": body.FechaNac,
                        ":Direccion": body.Direccion,
                        ":Telefonos": body.Telefonos,
                        ":Email": body.Email,
                        ":Nivel": body.Nivel
                    },
                    ReturnValues: 'UPDATED_NEW'
                };

                pacientes.postActualizarDatos(parametros, function (error, data) {
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
        description: 'Eliminar registro del paciente',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    }
                };
                pacientes.postEliminarDatos(parametros, function (error, data) {
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