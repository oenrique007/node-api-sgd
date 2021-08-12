//dependencias
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment');
var archivos = require('../models/modelogenerico');
var pathDef = "/api/archivos";
var NombreTabla = "Archivos";
dotenv.config();

const S3 = new AWS.S3();

module.exports = [
    {
        method: 'POST',
        path: `${pathDef}/obtener/ConsultarArchivos`,
        description: 'Consultar los documentos asociados a un área',
        handler: function (req, res) {
            try {
                let body = req.body;
                let FechaInicial = req.body.FechaInicial;
                let FechaFinal = req.body.FechaFinal;
                let Area = req.body.Area;
                let Documento = req.body.Documento;
                let IdPaciente = req.body.IdPaciente;
                let Admision = req.body.Admision;
                let Administradora = req.body.Administradora;
                let UnidadFuncional = req.body.UnidadFuncional;
                let NombreArchivo = req.body.NombreArchivo;

                var parametros = {
                    TableName: NombreTabla,
                    "ScanIndexForward": true,
                    FilterExpression: "#Fecha BETWEEN :FechaInicial AND :FechaFinal AND #Area = :Area AND #IdentificacionPte = :IdentificacionPte AND contains(#Admision, :Admision) AND contains(#Administradora, :Administradora) AND contains(#Documento, :Documento) AND contains(#UnidadFuncional, :UnidadFuncional) AND contains(#NombreArchivo, :NombreArchivo)",
                    ExpressionAttributeNames: {
                        "#Fecha": "FormatoFecha",
                        "#Area": "CodigoArea",
                        "#Documento": "CodigoDocumento",
                        "#IdentificacionPte": "IdentificacionPte",
                        "#Admision": "Admision",
                        "#Administradora": "CodigoAdministradora",
                        "#UnidadFuncional": "CodigoUF",
                        "#NombreArchivo": "NombreArchivo"
                    },
                    ExpressionAttributeValues: {
                        ":FechaInicial": FechaInicial,
                        ":FechaFinal": FechaFinal,
                        ":Area": Area,
                        ":Documento": Documento,
                        ":IdentificacionPte": IdPaciente,
                        ":Admision": Admision,
                        ":Administradora": Administradora,
                        ":UnidadFuncional": UnidadFuncional,
                        ":NombreArchivo": NombreArchivo,
                    }
                };

                archivos.postConsultarScanDatos(parametros, function (error, data) {
                    if (error) {
                        res.status(500).jsonp({ mensaje: error });
                        console.log(error);
                    }
                    else {
                        res.status(200).jsonp(data);
                        //console.log(data);
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
        path: `${pathDef}/eliminar/EliminarArchivo`,
        description: 'Eliminar un archivo',
        handler: function (req, res) {
            try {

                let body = req.body;
                let BucketComplete = req.body.Bucket;
                let Key = req.body.KeyFile;
                //var s3 = new AWS.S3();
                var params = { Bucket: BucketComplete, Key: Key };

                S3.deleteObject(params, function (err, data) {
                    if (err) {
                        res.status(500).jsonp({ mensaje: err });
                    } else {
                        var parametros = {
                            TableName: NombreTabla,
                            Key: {
                                Id: body.Id
                            }
                        };
                        archivos.postEliminarDatos(parametros, function (error, data) {
                            if (error) {
                                res.status(500).jsonp({ mensaje: error });
                            }
                            else {
                                res.status(200).jsonp(data);
                            }
                        });

                    }

                });

            } catch (error) {
                console.log(error);
                res.status(500).jsonp({ mensaje: error });
            }
        }
    }
];