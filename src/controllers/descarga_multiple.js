const AWS = require('aws-sdk');
const archiver = require('archiver');
const path = require('path');
const { PassThrough } = require('stream');
var pathDef = "/api/archivos";

const s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4',
    region: process.env.AWS_REGION, // ex) us-west-2
});

module.exports = [
    {
        method: 'POST',
        path: `${pathDef}/DownloadMultiple`,
        description: 'Descarga múltiple',
        handler: function (req, res) {
            try {

                //Variables             
                var body = req.body;
                var lstArchivosGen = [];

                //Ciclo de generación de archivos                
                const msStream = multiFilesStream(body);
                msStream.pipe(res);
                msStream.finalize();

            } catch (error) {
                console.log(error);
                res.status(500).jsonp(error);
            }
        }
    },
];

function multiFilesStream(files) {
    // using archiver package to create archive object with zip setting -> level from 0(fast, low compression) to 10(slow, high compression) 
    const archive = archiver('zip', { zlib: { level: 5 } });

    for (let i = 0; i < files.length; i += 1) {
        // using pass through stream object to wrap the stream from aws s3
        const passthrough = new PassThrough();
        s3bucket
            .getObject({
                Bucket: files[i].Bucket,
                Key: files[i].KeyFile
            })
            .createReadStream()
            .pipe(passthrough);
        // name parameter is the name of the file that the file needs to be when unzipped.
        archive.append(passthrough, { name: files[i].FileName });
    }
    return archive;
};

