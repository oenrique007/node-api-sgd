var AWS = require('aws-sdk');
var config = require('../../config/config');

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
module.exports = {
    postConsultarScanDatos: function (parameters, callback) {
        // Escanea toda la tabla
        docClient.scan(parameters, callback);
    },
    postConsultarQueryDatos: function (parameters, callback) {
        // Para búsquedas con condiciones
        docClient.query(parameters, callback);
    },
    postActualizarDatos: function (parameters, callback) {
        // Actualizar los datos de la tabla
        docClient.update(parameters, callback);
    },
    postInsertarDatos: function (parameters, callback) {
        // Insertar nuevo registro
        ddb.putItem(parameters, callback);
    },
    postEliminarDatos: function (parameters, callback) {
        // Eliminar registro
        docClient.delete(parameters, callback);
    }
};
