var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10', region: 'us-east-2'
});
// Create the DynamoDB document
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'us-east-2' });
//exportar modulo
module.exports = {
    postConsultarTodosDatos: function (parameters, callback) {
        // Escanea toda la tabla
        docClient.scan(parameters, callback);
    },
    postConsultarAlgunosDatos: function (parameters, callback) {
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
