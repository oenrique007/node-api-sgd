//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment');
var administradoras = require('../models/modelogenerico');
var pathDef = "/api/administradoras";
var NombreTabla = "Administradoras";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/todos`,
        description: 'Consultar todas las administradoras',
        handler: function (req, res) {
            try {

                let body = req.body;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100
                };

                administradoras.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Consultar las administradoras por filtros',
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
                    "FilterExpression": "contains(#DYNOBASE_Descripcion, :Descripcion) OR contains(#DYNOBASE_Codigo, :Codigo)",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Descripcion": "Descripcion",
                        "#DYNOBASE_Codigo": "Codigo"
                    },
                    "ExpressionAttributeValues": {
                        ":Descripcion": Filtro,
                        ":Codigo": Filtro
                    }
                };

                administradoras.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/codigo`,
        description: 'Consultar las administradoras por código',
        handler: function (req, res) {
            try {
                let body = req.body;
                let Codigo = req.body.Codigo;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
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

                administradoras.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar administradoras',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'Codigo': { S: `${body.Codigo}` },
                        'Descripcion': { S: `${body.Descripcion}` },
                        'FechaCreacion': { S: `${getFechaHora}` }
                    }
                };
                administradoras.postInsertarDatos(parametros, function (error, data) {
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
        description: 'Actualizar una administradora',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    },
                    UpdateExpression: `SET #Descripcion = :Descripcion`,

                    ExpressionAttributeNames: {
                        "#Descripcion": "Descripcion"
                    },
                    ExpressionAttributeValues: {
                        ":Descripcion": body.Descripcion
                    },
                    ReturnValues: 'UPDATED_NEW'
                };

                administradoras.postActualizarDatos(parametros, function (error, data) {
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
        description: 'Eliminar una administradora',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    }
                };

                administradoras.postEliminarDatos(parametros, function (error, data) {
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