var AWS = require('aws-sdk');
// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({
    apiVersion: '2012-08-10', region: 'us-east-2'
});

//exportar modulo
module.exports = {
    postGuardarDatos: function (parameters, callback) {
        // Call DynamoDB to add the item to the table
        ddb.putItem(parameters, callback);
    }
};
