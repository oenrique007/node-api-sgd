//dependencias
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');
var DocumentosAreas = require('../models/modelogenerico');
var pathDef = "/api/documentosareas";
var NombreTabla = "DocumentosAreas";

//exportar modulo
module.exports = [
    {
        method: 'GET',
        path: `${pathDef}/todos`,
        description: 'Consultar Todas los documentos y areas configurados',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla
                };

                DocumentosAreas.postConsultarScanDatos(parametros, function (error, data) {
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
        description: 'Insertar un documento a un área',
        handler: function (req, res) {
            try {

                let body = req.body;
                let getFechaHora = moment().tz("America/Bogota").format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    TableName: NombreTabla,
                    Item: {
                        'Id': { S: `${uuid()}` },
                        'Documento': { S: `${body.CodigoDocumento}` },
                        'NombreDocumento': { S: `${body.NombreDocumento}` },
                        'Area': { S: `${body.CodigoArea}` },
                        'NombreArea': { S: `${body.NombreArea}` },
                        'Archivo': { S: '' },
                        'File': { S: '' },
                        'UsuarioCreacion': { S: `${body.UsuarioCreacion}` },
                        'FechaCreacion': { S: `${getFechaHora}` }
                    }
                };
                DocumentosAreas.postInsertarDatos(parametros, function (error, data) {
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
        description: 'Eliminar una relación documento y área',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: NombreTabla,
                    Key: {
                        Id: body.Id
                    }
                };
                DocumentosAreas.postEliminarDatos(parametros, function (error, data) {
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