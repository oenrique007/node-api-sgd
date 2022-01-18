//dependencias
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const uuid = require('uuid').v4;
const moment = require('moment-timezone');
var archivos = require('../models/modelogenerico');
var pathDef = "/api/archivos";
var NombreTabla = "Archivos";
dotenv.config();

const S3 = new AWS.S3();

module.exports = [
    {
        method: 'POST',
        path: `${pathDef}/obtener/ConsultarArchivos`,
        description: 'Consultar los registros de transacciones de archivos',
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
                let Vista = req.body.Vista;
                let Factura = req.body.Factura;
                let Facturas = req.body.Facturas;
                var parametros;

                if (Vista == '2') { //por múltiples facturas

                    var filterExpression = "Factura in (";
                    var expressionAttributeValues = {};
                    var contentIdName;
                    var i = 0;

                    Facturas.forEach(function (factura) {

                        contentIdName = `:FacturaId${i}`;
                        if (i == 0) {
                            filterExpression += contentIdName;
                        } else {
                            filterExpression += `, ${contentIdName}`;
                        }
                        expressionAttributeValues[contentIdName] = factura;
                        i++;
                    });

                    filterExpression += ")";

                    parametros = {
                        TableName: NombreTabla,
                        FilterExpression: filterExpression,
                        ExpressionAttributeValues: expressionAttributeValues
                    };

                } else {
                    parametros = {
                        TableName: NombreTabla,
                        "ScanIndexForward": true,
                        FilterExpression: "#Fecha BETWEEN :FechaInicial AND :FechaFinal AND #Area = :Area AND contains(#IdentificacionPte, :IdentificacionPte) AND contains(#Admision, :Admision) AND contains(#Administradora, :Administradora) AND contains(#Documento, :Documento) AND contains(#UnidadFuncional, :UnidadFuncional) AND contains(#NombreArchivo, :NombreArchivo) AND contains(#Factura, :Factura)",
                        ExpressionAttributeNames: {
                            "#Fecha": "FormatoFecha",
                            "#Area": "CodigoArea",
                            "#Documento": "CodigoDocumento",
                            "#IdentificacionPte": "IdentificacionPte",
                            "#Admision": "Admision",
                            "#Administradora": "CodigoAdministradora",
                            "#UnidadFuncional": "CodigoUF",
                            "#NombreArchivo": "NombreArchivo",
                            "#Factura": "Factura"
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
                            ":Factura": Factura,
                        }
                    };
                }
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