//dependencias
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
var config = require('../../config/config');
const uuid = require('uuid').v4;
const moment = require('moment');
var pathDef = "/api/archivos";
var archivos = require('../models/modelogenerico');
dotenv.config();
//moment.tz.setDefault("America/Bogota");

// const S3 = new AWS.S3({
//     credentials: {
//         region: process.env.AWS_REGION,
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     }
// });

const S3 = new AWS.S3();

var ddb = new AWS.DynamoDB({
    apiVersion: config.dbConfig.apiVersion,
    region: config.dbConfig.regionDB
});

// Create the DynamoDB document
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: config.dbConfig.apiVersion,
    region: config.dbConfig.regionDB
});
//exportar modulo
module.exports = [
    {
        method: 'POST',
        path: `${pathDef}/SubirArchivos`,
        description: 'Subir Archivos',
        handler: function (req, res) {
            try {

                //const BucketEstatico = "archivos-sistema-gdc";
                let body = req.body;
                let file = req.file;
                //let BucketArea = BucketEstatico + "/" + req.body.BucketArea;
                let Estructura = body.Estructura;
                let IdentificacionPte = body.IdentificacionPte;
                let NombrePaciente = body.NombrePaciente;
                let Admision = body.Admision;
                let Administradora = body.Administradora;
                let Unidad_Funcional = body.UnidadFuncional;
                let bucketDefinitivo = body.BucketDefinitivo;
                //let Year = moment().format("YYYY");
                //var Mes = moment().format('MMMM');
                let getFechaHora = moment().tz('America/Bogota').format("YYYYMMDD HH_mm_ss");

                let myFile = req.file.originalname.split(".");
                const fileType = myFile[myFile.length - 1];
                let fileNameComplete = req.file.originalname;
                let BucketComplete = "";

                if (body.Estructura == 3) {
                    fileNameComplete = "DOC_" + IdentificacionPte + "_" + NombrePaciente + "_" + Administradora + "_" + getFechaHora + "." + fileType;
                }

                const params = {
                    //ACL: "public-read-write",
                    Bucket: body.BucketDefinitivo,//"archivos-sistema-gdc/admisiones/otro",
                    //Key: `${uuid()}.${fileType}`, // nombre del archivo.
                    Key: fileNameComplete,
                    Body: file.buffer
                }

                S3.upload(params, (error, data) => {
                    if (error) {
                        res.status(500).send(error);
                        return;
                    } else {

                        let getFechaHora = moment().tz('America/Bogota').format("DD/MM/YYYY HH:mm:ss");
                        let getFechaHoraFormato = moment().tz('America/Bogota').format("YYYY-MM-DD");
                        var parametros = {
                            TableName: 'Archivos',
                            Item: {
                                'Id': { S: `${uuid()}` },
                                'ETag': { S: `${data.ETag}` },
                                'KeyFile': { S: `${data.Key}` },
                                'Bucket': { S: `${data.Bucket}` },
                                'Ubicacion': { S: `${data.Location}` },
                                'IdentificacionPte': { S: `${body.IdentificacionPte}` },
                                'NombrePaciente': { S: `${body.NombrePaciente}` },
                                'Admision': { S: `${body.Admision}` },
                                'CodigoAdministradora': { S: `${body.CodigoAdministradora}` },
                                'Administradora': { S: `${body.Administradora}` },
                                'CodigoUF': { S: `${body.CodigoUF}` },
                                'UnidadFuncional': { S: `${body.UnidadFuncional}` },
                                'Usuario': { S: `${body.Usuario}` },
                                'Fecha': { S: `${getFechaHora}` },
                                'CodigoArea': { S: `${body.CodigoArea}` },
                                'NombreArea': { S: `${body.NombreArea}` },
                                'CodigoDocumento': { S: `${body.CodigoDocumento}` },
                                'NombreDocumento': { S: `${body.NombreDocumento}` },
                                'BloqueoDescarga': { S: `${body.BloqueoDescarga}` },
                                'NombreArchivo': { S: `${fileNameComplete}` },
                                'FormatoFecha': { S: `${getFechaHoraFormato}` }
                            }
                        };

                        archivos.postInsertarDatos(parametros, function (error, data) {
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
                res.status(500).jsonp({ mensaje: error });
            }

        }
    },
    {
        method: 'GET',
        path: `${pathDef}/obtener/Consecutivo/:Tipo`,
        description: 'Consultar el consecutivo',
        handler: function (req, res) {
            try {
                let body = req.body;
                let Tipo = req.params.Tipo;
                //let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
                var parametros = {
                    "TableName": "Consecutivos",
                    "ScanIndexForward": true,
                    "Limit": 100,
                    "FilterExpression": "#DYNOBASE_Tipo = :Tipo",
                    "ExpressionAttributeNames": {
                        "#DYNOBASE_Tipo": "Tipo"
                    },
                    "ExpressionAttributeValues": {
                        ":Tipo": Tipo
                    }
                };

                archivos.postConsultarScanDatos(parametros, function (error, data) {
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
        path: `${pathDef}/actualizar/Consecutivo`,
        description: 'Actualizar el consecutivo',
        handler: function (req, res) {
            try {

                let body = req.body;
                var parametros = {
                    TableName: "Consecutivos",
                    Key: {
                        Id: body.Id
                    },
                    UpdateExpression: `SET #Consecutivo = :Consecutivo`,
                    ExpressionAttributeNames: {
                        "#Consecutivo": "Consecutivo"
                    },
                    ExpressionAttributeValues: {
                        ":Consecutivo": body.Consecutivo
                    },
                    ReturnValues: 'UPDATED_NEW'
                };

                archivos.postActualizarDatos(parametros, function (error, data) {
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


// async function ProcesarDatos(parameters, done) {

//     console.log('Entra 2');
//     const params = {
//         //ACL: "public-read-write",
//         Bucket: parameters.BucketComplete,//"archivos-sistema-gdc/admisiones/otro",
//         //Key: `${uuid()}.${fileType}`, // nombre del archivo.
//         Key: parameters.FileNameComplete,
//         Body: parameters.File.buffer
//     }

//     S3.upload(params, (error, data) => {
//         if (error) {
//             // parameters.Res.status(500).send(error);
//             // console.log(error)
//             done(error);
//             return;
//         } else {
//             parameters.data = data;
//             //res.status(200).send(data);

//             // let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
//             // var parametros = {
//             //     TableName: 'Archivos',
//             //     Item: {
//             //         'Id': { S: `${uuid()}` },
//             //         'ETag': { S: `${data.ETag}` },
//             //         'KeyFile': { S: `${data.Key}` },
//             //         'Bucket': { S: `${data.Bucket}` },
//             //         'Ubicacion': { S: `${data.Location}` },
//             //         'IdentificacionPte': { S: `${parameters.Body.IdentificacionPte}` },
//             //         'NombrePaciente': { S: `${parameters.Body.NombrePaciente}` },
//             //         'Admision': { S: `${parameters.Body.Admision}` },
//             //         'Administradora': { S: `${parameters.Body.Administradora}` },
//             //         'UnidadFuncional': { S: `${parameters.Body.UnidadFuncional}` },
//             //         'Usuario': { S: `${parameters.Body.Usuario}` },
//             //         'Fecha': { S: `${getFechaHora}` },
//             //         'CodigoArea': { S: `${parameters.Body.CodigoArea}` },
//             //         'NombreArea': { S: `${parameters.Body.NombreArea}` },
//             //         'CodigoDocumento': { S: `${parameters.Body.CodigoDocumento}` },
//             //         'NombreDocumento': { S: `${parameters.Body.NombreDocumento}` },
//             //         'BloqueoDescarga': { S: `${parameters.Body.BloqueoDescarga}` }
//             //     }
//             // };

//             // console.log('Entra 3');

//             // archivos.postInsertarDatos(parametros, function (error, data) {
//             //     if (error) {
//             //         //parameters.Res.status(500).jsonp({ mensaje: error });
//             //         done(error);
//             //     }
//             //     else {
//             //         //parameters.Res.status(200).jsonp({ mensaje: "subida y guardado en db exitoso" });
//             //         done(null, data);
//             //         console.log('Entra 4');
//             //     }
//             // });
//         }
//     })
//     await GuardarRegistro(parameters, function (err, data) {
//         if (err) {
//             done(err);
//         } else {
//             done(null, data);
//         }
//     });

// }
// async function GuardarRegistro(parameters, done) {
//     console.log('Entra 3');
//     let getFechaHora = moment().format("DD/MM/YYYY HH:mm:ss");
//     let getFechaHoraFormato = moment().format("YYYY-MM-DD");
//     var parametros = {
//         TableName: 'Archivos',
//         Item: {
//             'Id': { S: `${uuid()}` },
//             'ETag': { S: `${parameters.data.ETag}` },
//             'KeyFile': { S: `${parameters.data.Key}` },
//             'Bucket': { S: `${parameters.data.Bucket}` },
//             'Ubicacion': { S: `${parameters.data.Location}` },
//             'IdentificacionPte': { S: `${parameters.Body.IdentificacionPte}` },
//             'NombrePaciente': { S: `${parameters.Body.NombrePaciente}` },
//             'Admision': { S: `${parameters.Body.Admision}` },
//             'CodigoAdministradora': { S: `${parameters.Body.CodigoAdministradora}` },
//             'Administradora': { S: `${parameters.Body.Administradora}` },
//             'CodigoUF': { S: `${parameters.Body.CodigoUF}` },
//             'UnidadFuncional': { S: `${parameters.Body.UnidadFuncional}` },
//             'Usuario': { S: `${parameters.Body.Usuario}` },
//             'Fecha': { S: `${getFechaHora}` },
//             'CodigoArea': { S: `${parameters.Body.CodigoArea}` },
//             'NombreArea': { S: `${parameters.Body.NombreArea}` },
//             'CodigoDocumento': { S: `${parameters.Body.CodigoDocumento}` },
//             'NombreDocumento': { S: `${parameters.Body.NombreDocumento}` },
//             'BloqueoDescarga': { S: `${parameters.Body.BloqueoDescarga}` },
//             'NombreArchivo': { S: `${parameters.Body.NombreArchivo}` },
//             'FormatoFecha': { S: `${getFechaHoraFormato}` }
//         }
//     }
//     try {
//         const result = await ddb.putItem(parametros).promise();
//         done(null, result);
//         console.log('Entra 4');
//     } catch (err) {
//         done(err);
//         console.log('Entra 4.5');
//     }
// }