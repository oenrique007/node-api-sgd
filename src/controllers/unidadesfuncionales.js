//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');
var unidades_funcionales = require('../models/modelogenerico');
var pathDef = "/api/unidades";
var NombreTabla = "UnidadesFuncionales";

//exportar modulo
module.exports = [
    {
        method: 'POST',
        path: `${pathDef}/todos`,
        description: 'Consultar todas las unidades funcionales',
        handler: function (req, res) {
            try {

                let body = req.body;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": NombreTabla,
                    "ScanIndexForward": true,
                    "Limit": 100
                };

                unidades_funcionales.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Consultar las unidades funcionales por filtros',
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

                unidades_funcionales.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Consultar las unidades funcionales por código',
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

                unidades_funcionales.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar unidades funcionales',
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
                        'FechaCreacion': { S: `${getFechaHora}` }
                    }
                };
                unidades_funcionales.postInsertarDatos(parametros, function (error, data) {
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
        description: 'Actualizar una unidad funcional',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");
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

                unidades_funcionales.postActualizarDatos(parametros, function (error, data) {
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
        description: 'Eliminar una unidad funcional',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    }
                };

                unidades_funcionales.postEliminarDatos(parametros, function (error, data) {
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